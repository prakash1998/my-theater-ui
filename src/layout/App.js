import React, { useState } from "react";

import VideoPlayer from "../videoplayer";

const urlParams = new URLSearchParams(window.location.search);
const origin = window.location.origin;
const urlRoomId = urlParams.get("room");
const urlVideoLink = urlParams.get("url");

function App() {
  const [room, setRoom] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [urlToShare, setUrlToShare] = useState("");

  const [showVideo, setShowVideo] = useState(false);

  const isAdmin = urlRoomId == null;

  return (
    <div>
      {(urlRoomId && urlVideoLink) ||
      (showVideo && room.trim() && videoUrl.trim()) ? (
        <div>
          <VideoPlayer
            roomId={urlRoomId || room}
            videoUrl={urlVideoLink || videoUrl}
            isAdmin={isAdmin}
          />
          <br />
          Video Url : {urlToShare}
        </div>
      ) : (
        <div>
          Room ID:
          <input value={room} onChange={(e) => setRoom(e.target.value)} />
          <br />
          Video URL:
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <br />
          <button
            onClick={() => {
              setUrlToShare(`${origin}?room=${room}&url=${videoUrl}`);
              setShowVideo(true);
            }}
          >
            {" "}
            JOIN{" "}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
