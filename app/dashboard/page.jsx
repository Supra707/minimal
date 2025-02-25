"use client";
import { useEffect, useState } from "react";
import { auth, signInWithGoogle, logout, db } from "../lib/firebaseConfig"; // Import Firestore database (db)
import { getDoc, doc } from "firebase/firestore"; // Import Firestore query functions
import PlaylistButton from "../components/tooltip";
import PlaylistCard from "../components/playlistcard";
import GoogleLogin from "../components/googlelogin";
import { useRouter } from "next/navigation";
export default function Page() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const [error, setError] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const router=useRouter();
  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setLoading(true); // Set loading to true whenever auth state changes
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (user) {
        try {
          // Reference to the user's specific document in the "playlists" collection
          const userDocRef = doc(db, "playlists", user.uid);
          const userDocSnap = await getDoc(userDocRef); // Fetch user document

          if (userDocSnap.exists()) {
            // If the document exists, access the 'items' array from the document
            const playlists = userDocSnap.data().items || []; // Default to an empty array if no playlists

            setPlaylists(playlists);
          } else {
            console.log("No playlists found for this user.");
          }
        } catch (error) {
          console.error("Error fetching playlists:", error);
          setError("Failed to load playlists. Please try again.");
        } finally {
          setLoading(false); // Ensure loading state is set to false after fetching data
        }
      }
    };

    fetchPlaylists();
  }, [user]); // Run effect when user state changes

  const handleLogin = async () => {
    setError("");
    setsigninloading(true);
    try {
      const loggedInUser = await signInWithGoogle();
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    } finally {
      setsigninloading(false); // Ensure loading state is set to false after login attempt
    }
  };

  const handleLogout = async () => {
    setLoading(true); // Set loading to true during logout
    try {
      await logout();
      setUser(null);
    } catch (err) {
      setError("Error signing out. Try again.");
    } finally {
      setLoading(false); // Ensure loading state is set to false after logout attempt
      router.push('/');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
        <a href="/" className="cursor-pointer">
          <h1 className="text-xl font-semibold p-4 transition all text-black hover:scale-95 duration-2000 w-full bg-yellow-300">
            <span className="text-blue-600 font-bold">FocusGate</span> :Focus on
            Gate 2026 and nothing else
          </h1>
        </a>

        {user ? (
          <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-lg shadow-md">
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-sm"
            />
            <p className="text-lg font-semibold text-gray-800">
              {user.displayName}
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition duration-200 shadow-md"
            >
              Logout
            </button>
          </div>
        ) : (
          <GoogleLogin />
        )}

        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>

      {user && (
        <div>
          <div className="mt-3">
            <PlaylistButton user={user} />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-md"
                >
                  {/* Thumbnail Skeleton */}
                  <div className="relative aspect-video w-full bg-gray-200 animate-pulse overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skeleton-shine" />
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-4">
                    {/* Title Skeleton */}
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded-full w-3/4 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded-full w-1/2 animate-pulse" />
                    </div>

                    {/* Info Row Skeleton */}
                    <div className="flex gap-4">
                      <div className="h-3 bg-gray-200 rounded-full w-20 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded-full w-20 animate-pulse" />
                    </div>

                    {/* Action Bar Skeleton */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"
                          />
                        ))}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : playlists.length !== 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              <PlaylistCard playlists={playlists} userId={user.uid} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-transparent rounded-lg">
              <p className="text-xl font-semibold text-gray-700 mb-2">
                No Playlists Found
              </p>
              <p className="text-gray-500">
                Start creating your first playlist to see it here
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
