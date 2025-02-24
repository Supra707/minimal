import { useState, useRef, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  ChevronRight,
  ChevronLeft,
  PlayCircle,
  Home,
  Play,
} from "lucide-react";
import axios from "axios";
import ReactPlayer from "react-player";

export default function PlayerLayout({ playlistId }) {
  const [collapsed, setCollapsed] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [url, setvideourl] = useState("");
  const [isLoading, setisloading] = useState(false);
  const [playlist, setplaylist] = useState([]);
  const [title, settitle] = useState("");
  async function fetchData(playlistId) {
    if (!playlistId) return;
    let allVideos = [];
    let nextPageToken = "";

    try {
      setisloading(true);
      do {
        const response = await axios.get(
          "https://youtube-v3-lite.p.rapidapi.com/playlistItems",
          {
            params: {
              playlistId: playlistId,
              part: "snippet",
              maxResults: 50,
              pageToken: nextPageToken,
            },
            headers: {
              "x-rapidapi-key":
                "b8dee9cb48mshcdf3b9dcfb365c8p1ae6e8jsnc937618846dd",
              "x-rapidapi-host": "youtube-v3-lite.p.rapidapi.com",
            },
          }
        );

        allVideos = allVideos.concat(response.data[0].items);
        nextPageToken = response.data[0].nextPageToken;
      } while (nextPageToken);

      setplaylist(allVideos);
      localStorage.setItem("id", playlistId);
      localStorage.setItem("playlist", JSON.stringify(allVideos));
      setisloading(false);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  }

  async function getPlaylistTitle(playlistId) {
    try {
      const response = await fetch(
        `/api/playlist-title?playlistId=${playlistId}`
      );
      const data = await response.json();
      console.log("Playlist Title:", data.title);
      settitle(data.title);
    } catch (error) {
      console.error("Error fetching title:", error);
    }
  }

  useEffect(() => {
    console.log(playlistId);
    if (localStorage.getItem("id") === playlistId) {
      console.log("equal to previous");
      const list = localStorage.getItem("playlist");

      if (list) {
        const list2 = JSON.parse(list);
        setplaylist(list2); // Convert JSON string back to an array
      }
    } else {
      console.log("not equal to previous");
      fetchData(playlistId);
    }
    getPlaylistTitle(playlistId);
  }, []); // Runs only when the component mounts or playlistId changes

  useEffect(() => {
    console.log(playlist);
    if (playlist.length >= 1) {
      setvideourl(playlist[0].snippet.resourceId.videoId);
    }
  }, [playlist]);

  const handleVideoSelect = (videoId, index) => {
    setCurrentVideoIndex(index);
    setvideourl(videoId);
  };
  return (
    <div className="h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex flex-col">
      <style>
        {`
        @keyframes waveAnimation {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
      `}
      </style>

      <div className="flex items-center justify-between p-2 border-b border-yellow-500 bg-white/50 backdrop-blur-sm">
        <a href="/">
          <Button
            type="submit"
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-white transition-all duration-300 hover:scale-105 flex gap-2 items-center"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Button>
        </a>
        <h2 className="font-semibold mx-auto text-xl text-yellow-800">
          {title}
        </h2>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel
          defaultSize={75}
          minSize={30}
          className={collapsed ? "w-full" : ""}
        >
          <div className="w-full h-full relative rounded-lg overflow-hidden m-2 shadow-xl">
            {isLoading ? (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="relative">
                  {/* Outer pulsing circle */}
                  <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />

                  {/* Inner circle with play icon */}
                  <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-gray-900" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0">
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${url}`}
                  controls
                  playing
                  width="100%"
                  height="100%"
                  style={{ position: "absolute", top: 0, left: 0 }}
                />
              </div>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-yellow-200 hover:bg-yellow-300 transition-colors"
        />

        <ResizablePanel
          defaultSize={25}
          minSize={20}
          maxSize={40}
          className={`transition-all duration-300 ${
            collapsed ? "w-0 hidden" : ""
          }`}
        >
          <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between p-1 border-b border-yellow-200">
              <h2 className="font-bold truncate mx-auto text-xl text-yellow-800">
                {playlist.length} Videos
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(true)}
                className="hover:bg-yellow-100 text-yellow-700 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="h-20 bg-yellow-100/50 rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  playlist.map((video, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleVideoSelect(
                          video.snippet.resourceId.videoId,
                          index
                        )
                      }
                      className={`relative w-full p-2 rounded-lg flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] ${
                        index === currentVideoIndex
                          ? "bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 shadow-lg"
                          : "hover:bg-yellow-50"
                      }`}
                    >
                      <span className="text-sm font-semibold text-yellow-600 w-6 text-right">
                        {index + 1}.
                      </span>

                      <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-yellow-100 shadow-md">
                        <img
                          src={video.snippet.thumbnails.high.url}
                          alt=""
                          className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                        />

                        {index === currentVideoIndex && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                            <PlayCircle className="w-8 h-8 text-yellow-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <p
                          className={`text-sm leading-tight ${
                            index === currentVideoIndex
                              ? "text-yellow-800 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {video.snippet.title}
                        </p>
                      </div>

                      {index === currentVideoIndex}
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {collapsed && (
        <Button
          variant="default"
          size="icon"
          className="fixed right-4 bottom-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white"
          onClick={() => setCollapsed(false)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
