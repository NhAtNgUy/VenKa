from fastapi import FastAPI, HTTPException, Query
import requests
from googleapiclient.discovery import build
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

YOUTUBE_API_KEY = "AIzaSyBr-OZMcXcKGEkEnVbx5Qn2YBfSqkRcxiQ"
youtube = build('youtube', 'v3', developerKey = YOUTUBE_API_KEY)

# Danh sách các video đã được gán nhãn
labeled_videos = {
    "Karaoke nhạc trẻ": [],
    "Karaoke nhạc trending": [],
    "Karaoke nhạc bolero": []
}

@app.get("/search")
async def search_song(q: str = Query(..., min_length=1)):
    print(f"Received query: {q}")
    words = q.split() 
    words_select = []
    for i in words: 
        I = i.lower()
        if I != 'karaoke': 
            words_select.append(I) 
    q_new = ' '.join(words_select)
    
    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
    request_yt = youtube.search().list(
        q=f'"Karaoke {q}"', 
        part='snippet',
        type='video',
        maxResults=10, 
        order = 'relevance'
    )

    response = request_yt.execute() 

    vid_Id = [] 
    for item in response['items']: 
        vid_Id.append(item['id']['videoId'])

    view_request = youtube.videos().list(
        part = 'snippet, statistics', 
        id = ','.join(vid_Id)
    ) 

    view_response = view_request.execute()

    simplified_results = []
    for item in view_response['items']: 
        simplified_results.append( {'title' : item['snippet']['title'], 
                        'viewCount' : item['statistics']['viewCount'],
                        'thumbnail' : item['snippet']['thumbnails']['default']['url'], 
                        'videoId': item['id']
                        })
    return {"results": simplified_results}

labeled_videos = {}

@app.get("/category/{category_name}")
async def get_videos_by_category(category_name: str):
    # Check if the category exists in the dictionary
    if category_name not in labeled_videos:
        labeled_videos[category_name] = []

    # If the video list for this category is empty, fetch videos from YouTube
    if not labeled_videos[category_name]:
        try:
            # Search for videos by category
            search_request = youtube.search().list(
                q=f'"{category_name}"',
                part='snippet',
                type='video',
                maxResults=10,  # Configurable
                order='relevance'
            )
            search_response = search_request.execute()

            # Extract video IDs from the search response
            video_ids = [item['id']['videoId'] for item in search_response['items']]

            # Fetch video details (snippet and statistics) using video IDs
            video_request = youtube.videos().list(
                part='snippet,statistics',
                id=','.join(video_ids)
            )
            video_response = video_request.execute()

            # Populate the labeled_videos dictionary with video details
            labeled_videos[category_name] = [
                {
                    'title': item['snippet']['title'],
                    'viewCount': item['statistics']['viewCount'],
                    'thumbnail': item['snippet']['thumbnails']['default']['url'],
                    'videoId': item['id']
                }
                for item in video_response['items']
            ]

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching videos from YouTube: {str(e)}")

    return {"results": labeled_videos[category_name]}