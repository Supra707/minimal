import { useState, useRef, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { ChevronRight, ChevronLeft, PlayCircle, Home } from "lucide-react";
import axios from "axios";

export default function PlayerLayout({ playlistId }) {
  const [collapsed, setCollapsed] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [url, setvideourl] = useState("");
  const [isLoading, setisloading] = useState(false);
  const [playlist, setplaylist] = useState([]);
  const [title, settitle] = useState("");
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


  async function fetchData(playlistId) {
    if (!playlistId) return; // Prevent API call with an empty ID
    let allVideos = [];
    let nextPageToken = "";

    try {
      setisloading(true);
      do {
        const response = await axios.request({
          method: "GET",
          url: "https://youtube-v3-lite.p.rapidapi.com/playlistItems",
          params: {
            playlistId: playlistId,
            part: "snippet",
            maxResults: 50, // Ensures API returns as many videos per request as possible
            pageToken: nextPageToken, // Handle pagination
          },
          headers: {
            "x-rapidapi-key":
              "b8dee9cb48mshcdf3b9dcfb365c8p1ae6e8jsnc937618846dd",
            "x-rapidapi-host": "youtube-v3-lite.p.rapidapi.com",
          },
        });
        setisloading(false);
        // Ensure response data structure is correct
        console.log("API Response:", response.data[0]);

        // Properly concatenate data to form a continuous array
        allVideos = allVideos.concat(response.data[0].items);

        // Update page token to fetch the next batch
        nextPageToken = response.data[0].nextPageToken;
      } while (nextPageToken); // Continue fetching if there's more data

      // Save to localStorage AFTER all videos are fetched
      localStorage.setItem("playlist", JSON.stringify(allVideos));
      localStorage.setItem("id", playlistId);

      setplaylist(allVideos); // Update UI with full playlist
      setvideourl(allVideos[0].snippet.resourceId.videoId);
    } catch (error) {
      console.error("Error fetching playlist:", error);
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

        setvideourl(list2[0].snippet.resourceId.videoId);
      }
    } else {
      console.log("not equal to previous");
      fetchData(playlistId);
    }
    getPlaylistTitle(playlistId);
  }, []); // Runs only when the component mounts or playlistId changes
  useEffect(() => {
    console.log(playlist);
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
            Home
          </Button>
        </a>
        <h2 className="font-semibold mx-auto text-xl text-yellow-800">{title}</h2>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel
          defaultSize={75}
          minSize={30}
          className={collapsed ? "w-full" : ""}
        >
          <div className="w-full h-full relative rounded-lg overflow-hidden m-2 shadow-xl">
            <iframe
              src={`https://www.youtube.com/embed/${url}?autoplay=1&controls=1&modestbranding=1&rel=0&fs=1&showinfo=0&iv_load_policy=3&disablekb=1&playsinline=1`}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
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
