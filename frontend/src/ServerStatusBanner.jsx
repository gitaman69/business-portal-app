import { useEffect, useState } from "react";
import axios from "axios";

export default function ServerStatusBanner() {
  const [isServerUp, setIsServerUp] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [lastStatus, setLastStatus] = useState(null); // null so we detect first load

  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/health`);
        setIsServerUp(true);
        if (lastStatus === null || lastStatus === false) {
          setShowToast(true); // show on first load or status change
        }
        setLastStatus(true);
      } catch (err) {
        setIsServerUp(false);
        if (lastStatus === null || lastStatus === true) {
          setShowToast(true); // show on first load or status change
        }
        setLastStatus(false);
      }
    };

    // Call the server check every 5 seconds
    const interval5Sec = setInterval(checkServer, 5000); 

    // Call the server check every 4 minutes (240000 ms)
    const interval4Min = setInterval(checkServer, 240000);

    return () => {
      clearInterval(interval5Sec);
      clearInterval(interval4Min);
    };
  }, [lastStatus]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <>
      {/* Floating status dot */}
      <div className="fixed bottom-5 left-5 z-50">
        <div className="w-10 h-10 bg-black flex items-center justify-center rounded-full shadow-md">
          <div className="inline-grid *:[grid-area:1/1] relative w-2 h-2">
            <div
              className={`status ${
                isServerUp ? "status-success" : "status-error"
              } animate-ping`}
            ></div>
            <div
              className={`status ${
                isServerUp ? "status-success" : "status-error"
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* Toast shown on initial load or status change */}
      {showToast && (
        <div className="fixed bottom-20 left-5 z-50 bg-white border border-gray-300 px-4 py-2 rounded-md shadow-lg transition-opacity duration-500 animate-fade-in-out text-sm text-black">
          {isServerUp ? "✅ Server is Up" : "❌ Server is Down"}
        </div>
      )}
    </>
  );
}
