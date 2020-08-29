import React, { useState, useRef, useContext, useEffect } from "react";

import ReactPlayer from "react-player";
import { WebSocketContext } from "../context";

const PROGRESS_INTERVAL = 2000;
const VideoPlayer = ({ roomId, videoUrl, isAdmin = false }) => {
  const { sendMessage, connectToServer } = useContext(WebSocketContext);

  const playerRef = useRef();
  const seekToSecond = (s) => {
    playerRef.current && playerRef.current.seekTo(s);
  };

  const getSeekSecond = () => {
    const seconds =
      (playerRef.current && playerRef.current.getCurrentTime()) || 0;
    return +seconds.toFixed(2);
  };

  console.log({
    playerRef: playerRef.current,
    seconds: getSeekSecond(),
    time: playerRef.current && playerRef.current.getCurrentTime(),
    playing: playerRef.current && playerRef.current.getCurrentTime(),
  });

  const [playing, setPlaying] = useState(true);

  // const [volume, setVolume] = useState(0.8);

  const lastPlayedRef = useRef(new Date().valueOf());
  const lastPausedRef = useRef(0);

  useEffect(() => {
    const onMessage = (msg) => {
      console.log("message received ", msg);
      if (!isAdmin) {
        console.log({ msg });
        setPlaying(msg.playing);
        if (!msg.playing || Math.abs(getSeekSecond() - msg.seek) > 2)
          seekToSecond(msg.seek);
      }
    };
    connectToServer(roomId, onMessage);
  }, [connectToServer, isAdmin, roomId]);

  const isImmediate = () => {
    return Math.abs(lastPlayedRef.current - lastPausedRef.current) < 100;
  };

  const onPlay = () => {
    console.log("Play clicked...");
    lastPlayedRef.current = new Date().valueOf();
    setTimeout(() => {
      if (!isImmediate()) {
        console.log("Play sent...");
        setPlaying(true);
        if (isAdmin) {
          sendMessage(getSeekSecond(), true);
        }
      }
    }, 200);
  };

  const onPause = () => {
    console.log("Pause clicked...");

    lastPausedRef.current = new Date().valueOf();
    setTimeout(() => {
      if (!isImmediate()) {
        console.log("Pause sent...");
        setPlaying(false);
        if (isAdmin) {
          sendMessage(getSeekSecond(), false);
        }
      }
    }, 200);
  };

  const onProgress = (e) => {
    console.log({ playing, e });
    if (isAdmin) {
      console.log("message sent");
      sendMessage(getSeekSecond(), playing);
    }
  };

  return (
    <div>
      {/* <h3>video player</h3>
      <button
        onClick={() => {
          playerRef.current.seekTo(50);
        }}
      >
        jump
      </button>
      <button
        onClick={() => {
          setPlaying((v) => !v);
        }}
      >
        {playing ? "Pause" : "Play"}
      </button>
      <div> */}
      <ReactPlayer
        width="100hw"
        height="100vh"
        style={{ overflow: "hidden" }}
        ref={playerRef}
        url={videoUrl}
        playing={playing}
        // volume={volume}
        onPlay={onPlay}
        onPause={onPause}
        onProgress={onProgress}
        onSeek={(seek) => {
          console.log({ seek });
        }}
        controls={isAdmin}
        progressInterval={PROGRESS_INTERVAL}
        config={{
          youtube: {
            playerVars: { rel: 0 },
          },
        }}
      />
      {/* </div> */}
    </div>
  );
};

export default VideoPlayer;
