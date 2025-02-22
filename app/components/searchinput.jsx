'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
export default function SearchInput({ icon, placeholder }) {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const router=useRouter();
  const validatePlaylistURL = (url) => {
    const playlistRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be).*[?&]list=([^&]+)(&[^&]+)*$/;
    return playlistRegex.test(url);
  };

  useEffect(() => {
    const checkValidity = async () => {
      setIsChecking(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsValid(validatePlaylistURL(url));
      setIsChecking(false);
    };

    if (url) {
      checkValidity();
    } else {
      setIsValid(false);
    }
  }, [url]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      const playlistId = url.match(/[?&]list=([^&]+)/)?.[1];
      router.push(`/play/${playlistId}`)
    }
    
  };

  return (
    <div className="flex justify-center w-full px-2">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full "
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="relative flex flex-col items-center"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
              {icon}
            </div>
            
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={placeholder}
              className="md:w-[50vw] w-[90vw] pl-10 pr-24 h-12 text-base bg-orange-50 border-orange-200  focus:ring-orange-200 transition-colors text-left"
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <motion.div
                whileHover={isValid ? { scale: 1.05 } : {}}
                whileTap={isValid ? { scale: 0.95 } : {}}
              >
                <Button
                  type="submit"
                  disabled={!isValid || isChecking}
                  className={`bg-gradient-to-r ${
                    isValid 
                      ? 'from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600' 
                      : 'from-gray-400 to-gray-500'
                  } text-white transition-all duration-300`}
                  size="sm"
                >
                  {isChecking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Play
                      {isValid && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          ▶
                        </motion.span>
                      )}
                    </span>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>

          {url && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2 text-sm text-center ${
                isValid ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {isValid ? "Valid YouTube playlist! Ready to play!" : "Please enter a valid YouTube playlist URL"}
            </motion.div>
          )}
        </motion.div>
      </motion.form>
    </div>
  );
}