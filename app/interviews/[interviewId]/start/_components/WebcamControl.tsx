"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";

interface WebcamControlProps {
  userAvatar?: string | null;
}

const WebcamControl = ({ userAvatar }: WebcamControlProps) => {
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const webcamRef = useRef(null);

  const toggleWebcam = () => {
    setIsWebcamEnabled(!isWebcamEnabled);
  };

  return (
    <motion.div className="flex flex-col space-y-6">
      <div className="size-full min-h-80 rounded-md border border-gray-50 bg-gray-100">
        <div className="flex h-full items-center justify-center">
          {isWebcamEnabled ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-md"
            />
          ) : (
            <>
              {userAvatar ? (
                <UserAvatar avatar={userAvatar} sizes="size-24" />
              ) : (
                <p>No user image available</p>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <Button variant="outline" className="w-full" onClick={toggleWebcam}>
          {isWebcamEnabled ? "Disable Webcam" : "Enable Webcam"}
        </Button>
      </div>
    </motion.div>
  );
};

export default WebcamControl;
