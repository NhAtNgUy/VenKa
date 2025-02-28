import React from "react";
import ReactPlayer from "react-player";
import styled from "styled-components";

const Player = ({ videoId }) => {
  if (!videoId) return null;

  return (
    <StyledWrapper>
      <div className="Player" >
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${videoId}`}
          controls={true}
          width="100%"
        />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
.Player{
  width: 500px; 
  padding: 10px;
}

.Player h2{
  color:white
}

.Player ReactPlayer{
  border-radius: 15px
}
`
export default Player;