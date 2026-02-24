import React, { useState, useEffect } from "react";
import { Music } from "lucide-react";

const MusicStatus = () => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchMusicStatus = async () => {
      try {
        if (window.electronAPI && window.electronAPI.getMusicStatus()) {
          const music = await window.electronAPI.getMusicStatus();
          setStatus(music);
        }
      } catch (error) {
        console.error("Failed to fetch music status:", error);
      }
    };

    fetchMusicStatus();
    const interval = setInterval(fetchMusicStatus, 3000); // อัปเดตทุก 3 วินาที

    return () => clearInterval(interval);
  }, []);

  if (!status || status === "No music playing" || status === "null")
    return null;

  return (
    <div className="flex items-center gap-3 px-5 py-2.5 bg-secondary/50 backdrop-blur-md rounded-2xl text-secondary-foreground text-sm md:text-base border border-white/5 transition-all duration-300 w-fit max-w-sm md:max-w-md lg:max-w-lg">
      <Music className="w-5 h-5 text-green-400 shrink-0" />
      <div className="overflow-hidden">
        <p className="font-medium tracking-tight whitespace-nowrap animate-marquee">
          {status}
        </p>
      </div>
    </div>
  );
};

export default MusicStatus;
