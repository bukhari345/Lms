import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useParams, useNavigate } from "react-router-dom";

interface VideoPlayerProps {
  videoKey: string | undefined | null;
  isCoursePurchased: boolean | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoKey,
  isCoursePurchased,
}) => {
  console.log("🚀 ~ videoKey:", videoKey);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any | null>(null);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/courses/${courseId}`);
  };

  useEffect(() => {
    const player = videojs(videoRef.current!, {
      controls: true,
      fluid: true,
    });

    playerRef.current = player;

    if (videoKey) {
      player.src({
        src: videoKey,
        type: "video/mp4",
      });
    } else {
      showPurchaseOverlay();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoKey, isCoursePurchased]);

  const showPurchaseOverlay = () => {
    const purchaseOverlay = (
      <div className="purchase-overlay pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="lock-icon w-20 h-20 bg-black bg-center bg-cover mx-auto"></div>
          <h2 className="text-2xl font-semibold mt-4">This video is locked</h2>
          <p className="text-lg text-gray-600 mt-2">
            Please purchase the course to unlock the content
          </p>
          <div className="flex items-center justify-center mt-2">
            <div
              onClick={handleClick}
              className="bg-gray-500 w-2/6 flex pb-1 items-center justify-center rounded-md hover:bg-gray-600 text-white"
            >
              <button className="mt-2 font-semibold py-2 px-4">
                Purchase Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    const videoContainer = document.querySelector(".video-js");
    if (videoContainer) {
      ReactDOM.render(purchaseOverlay, videoContainer);
    }

    if (playerRef.current) {
      playerRef.current.controls(false);
    }
  };

  console.log("🚀 ~ videoRef:", videoRef);
  return (
    <div className="relative h-full">
      <video ref={videoRef} className="video-js vjs-default-skin h-full w-full">
        {videoKey && <source src={videoKey} type="video/mp4"></source>}
        {videoKey && <source src={videoKey} type="video/ogg"></source>}
      </video>
    </div>
  );
};

export default VideoPlayer;
