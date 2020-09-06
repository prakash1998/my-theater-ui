import React, {
  useState,
  useRef,
  useContext,
  useEffect,
  useCallback,
} from "react";

import ReactPlayer from "react-player";
import { WebSocketContext } from "../context";

const PROGRESS_INTERVAL = 500;
const DESIRED_PLAY_PAUSE_GAP = 500;
const VideoPlayer = ({ roomId, videoUrl, isAdmin = false }) => {
  const { sendMessage, connectToServer } = useContext(WebSocketContext);

  // console.log({
  //   playerRef: playerRef.current,
  //   seconds: getSeekSecond(),
  //   time: playerRef.current && playerRef.current.getCurrentTime(),
  //   playing: playerRef.current && playerRef.current.getCurrentTime(),
  // });

  const [playing, setPlaying] = useState(true);

  const userPlayPauseStatus = useRef(true);

  const playerRef = useRef();
  const seekToSecond = (s) => {
    playerRef.current && playerRef.current.seekTo(s);
  };

  const lastProgress = useRef(0);

  const lastPlayedRef = useRef(new Date().valueOf());
  const lastPausedRef = useRef(0);

  const getSeekSecond = useCallback(() => {
    const seconds =
      (playerRef.current && playerRef.current.getCurrentTime()) || 0;
    return +seconds.toFixed(2);
  }, []);

  useEffect(() => {
    const onMessage = (msg) => {
      console.log("message received ", msg);
      if (!isAdmin) {
        console.log({ msg });
        // if (userPlayPauseStatus === true) {
        setPlaying(msg.playing);
        // }
        if (!msg.playing || Math.abs(getSeekSecond() - msg.seek) > 2)
          seekToSecond(msg.seek);
      }
    };
    connectToServer(roomId, onMessage);
  }, [connectToServer, getSeekSecond, isAdmin, roomId]);

  const isImmediate = useCallback(() => {
    return (
      Math.abs(lastPlayedRef.current - lastPausedRef.current) <
      DESIRED_PLAY_PAUSE_GAP
    );
  }, []);

  const onPlay = useCallback(() => {
    console.log("Play clicked...");
    lastPlayedRef.current = new Date().valueOf();
    setTimeout(() => {
      if (!isImmediate()) {
        setPlaying(true);
        userPlayPauseStatus.current = true;
        if (isAdmin) {
          console.log("Play sent...");
          sendMessage({ seek: getSeekSecond(), playing: true });
        }
      }
    }, DESIRED_PLAY_PAUSE_GAP + 50);
  }, [getSeekSecond, isAdmin, isImmediate, sendMessage]);

  const onPause = useCallback(() => {
    console.log("Pause clicked...");

    lastPausedRef.current = new Date().valueOf();
    setTimeout(() => {
      if (!isImmediate()) {
        setPlaying(false);
        userPlayPauseStatus.current = true;
        if (isAdmin) {
          console.log("Pause sent...");
          sendMessage({ seek: getSeekSecond(), playing: false });
        }
      }
    }, DESIRED_PLAY_PAUSE_GAP + 50);
  }, [getSeekSecond, isAdmin, isImmediate, sendMessage]);

  const onProgress = (e) => {
    // console.log({ playing, e });
    const played = e.playedSeconds;

    // console.log({
    //   played,
    //   lastPlayed: lastProgress.current,
    //   diff: Math.abs(played - lastProgress.current),
    // });
    if (Math.abs(played - lastProgress.current) > 1) {
      if (isAdmin) {
        console.log("progress message sent");
        sendMessage({ seek: getSeekSecond(), playing });
      }
    }
    lastProgress.current = played;
  };

  return (
    <div>
      <ReactPlayer
        width="100hw"
        height="100vh"
        style={{ overflow: "hidden" }}
        ref={playerRef}
        url={videoUrl}
        playing={playing}
        volume={0.5}
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
