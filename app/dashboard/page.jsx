"use client";
import { useEffect, useState } from "react";
import { auth, signInWithGoogle, logout, db } from "../lib/firebaseConfig"; // Import Firestore database (db)
import {  getDoc,doc } from "firebase/firestore"; // Import Firestore query functions
import PlaylistButton from "../components/tooltip";
import PlaylistCard from "../components/playlistcard";
export default function Page() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playlists, setplaylist] = useState([]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await signInWithGoogle();
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      setError("Error signing out. Try again.");
    }
    setLoading(false);
  };

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

            console.log("User's saved playlists:", playlists); // Log the playlists array
            setplaylist(playlists);
          } else {
            console.log("No playlists found for this user.");
          }
        } catch (error) {
          console.error("Error fetching playlists:", error);
        }
      }
    };

    fetchPlaylists();
  }, [user]); // Run effect when user state changes

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
        <a href="/" className="cursor-pointer">
          <h1 className="text-xl font-semibold">FocusGate</h1>
        </a>

        {loading ? (
          <p className="animate-pulse font-bold">Checking auth...</p>
        ) : user ? (
          <div className="flex items-center gap-3">
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <p>{user.displayName}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className={`
            group
            relative
            flex
            items-center
            gap-3
            px-2
            py-2
            rounded-md
            font-medium
            text-white
            overflow-hidden
            transition-all
            duration-300
            transform
            hover:scale-105
            active:scale-95
            disabled:opacity-70
            disabled:cursor-not-allowed
            bg-gradient-to-r
            from-yellow-400
            via-orange-500
            to-red-500
            shadow-lg
            hover:shadow-xl
          `}
          >
            <div className="w-6 h-6 bg-white rounded-full p-1 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </div>
            <span className="text-lg">{"Sign in with Google"}</span>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        )}

        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>

      {user && (
        <div>
          <div className="mt-3">
            <PlaylistButton user={user} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <PlaylistCard playlists={playlists}/>
          </div>
        </div>
      )}
    </>
  );
}
