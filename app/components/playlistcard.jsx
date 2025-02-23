import React from "react";
import { Play, Clock, Music, MoreVertical } from "lucide-react";
import Link from "next/link";
const PlaylistCard = ({ playlists }) => {
  return (
        <>
      {playlists.map((playlist, index) => (
        <Link key={playlist.id} href={`/play/${playlist.id}`}>
          <div
            key={index}
            className="group relative bg-white rounded-2xl overflow-hidden transform 
                     transition-all duration-500 hover:scale-[1.02]
                     shadow-[0_10px_20px_rgba(0,0,0,0.08)]
                     hover:shadow-[0_20px_40px_rgba(255,166,0,0.2)]"
          >
            {/* Thumbnail Container */}
            <div className="relative aspect-video w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
              <img
                src={playlist.thumbnail || "/api/placeholder/400/225"}
                alt={playlist.title}
                className="w-full h-full object-cover transform transition-transform 
                         duration-700 group-hover:scale-110"
              />

              {/* Play Button Overlay */}
              <button
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                             z-20 bg-orange-500 text-white rounded-full p-4
                             transform transition-all duration-500 
                             opacity-0 group-hover:opacity-100 hover:bg-orange-600
                             scale-50 group-hover:scale-100
                             shadow-[0_0_20px_rgba(255,166,0,0.3)]"
              >
                <Play size={24} fill="white" />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Title */}
              <h3
                className="text-xl font-bold mb-2 line-clamp-2 bg-gradient-to-r 
                          from-orange-600 to-yellow-500 bg-clip-text text-transparent"
              >
                {playlist.title || "Playlist Title"}
              </h3>

              {/* Playlist Info */}
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Music size={16} className="text-orange-500" />
                  <span className="text-sm">18 tracks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} className="text-orange-500" />
                  <span className="text-sm">1h 24m</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white 
                             bg-gradient-to-br from-orange-400 to-yellow-500"
                    />
                  ))}
                </div>

                <button
                  className="p-2 rounded-full hover:bg-gray-100 
                               transition-colors duration-300"
                >
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r 
                         from-yellow-500 via-orange-500 to-yellow-500 opacity-0 
                         transition-opacity duration-300 group-hover:opacity-100"
            />

            <div
              className="absolute -bottom-1 -left-1 w-12 h-12 bg-gradient-to-tr 
                         from-orange-500 to-yellow-500 rounded-full blur-2xl 
                         opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            />

            <div
              className="absolute -top-1 -right-1 w-12 h-12 bg-gradient-to-bl 
                         from-yellow-500 to-orange-500 rounded-full blur-2xl 
                         opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            />
          </div>
        </Link>
      ))}
  </>
  );
};

export default PlaylistCard;
