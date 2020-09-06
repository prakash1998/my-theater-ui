import React from "react";

import VideoPlayer from "../videoplayer";

const urlParams = new URLSearchParams(window.location.search);
// const origin = window.location.origin;
const urlRoomId = urlParams.get("room");
const urlVideoLink = urlParams.get("url");
const isAdmin = Boolean(urlParams.get("admin"));

function App() {
  // const isAdmin = urlRoomId == null;

  console.log({ urlRoomId, urlVideoLink, isAdmin });
  return (
    <div>
      {/* {(urlRoomId && urlVideoLink) ||
     (showVideo && room.trim() && videoUrl.trim()) ? ( */}

      {urlRoomId && urlVideoLink ? (
        <div>
          <VideoPlayer
            roomId={urlRoomId}
            videoUrl={urlVideoLink}
            isAdmin={isAdmin}
          />
        </div>
      ) : (
        <div>Not Enough Parameters available to play video</div>
      )}
    </div>
  );
}

export default App;
