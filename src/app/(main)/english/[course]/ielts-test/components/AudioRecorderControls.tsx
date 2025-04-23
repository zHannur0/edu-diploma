// src/app/(main)/listening/[course]/ielts-test/[ieltsTest]/speaking/components/AudioRecorderControls.tsx

"use client";

import React from 'react';

interface AudioRecorderControlsProps {
    isRecording: boolean;
    startRecording: () => Promise<void> | void;
    stopRecording: () => void;
    // transcript: string; // Accept transcript for potential display
    disabled?: boolean;
}

export default function AudioRecorderControls({ isRecording, startRecording, stopRecording, disabled = false }: AudioRecorderControlsProps) {

    const handleRecordClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center justify-center gap-6">
                <div className={`w-24 h-8 rounded-full flex items-center justify-center text-xs transition-colors ${isRecording ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}`}>
                    {isRecording ? "Recording..." : "Ready"}
                </div>

                <button
                    onClick={handleRecordClick}
                    disabled={disabled}
                    className={`p-4 rounded-full transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isRecording
                            ? 'bg-[#7B68EE] text-white focus:ring-[#7B68EE]'
                            : 'bg-[#7B68EE] text-white focus:ring-[#7B68EE]'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={isRecording ? "Stop Recording" : "Start Recording"}
                >
                    {/* Simple SVG Mic/Stop icons */}
                    {isRecording ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 5h10v10H5V5z" clipRule="evenodd"></path></svg> // Stop Square
                    ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 11a1 1 0 10-2 0 5 5 0 01-9.998.001A1 1 0 103 11a7.002 7.002 0 006 6.93V19a1 1 0 102 0v-2.07z"></path></svg> // Mic Icon
                    )}
                </button>

                {/* Optional: Display transcript preview */}
                {/* {transcript && (
                    <div className="text-xs text-gray-500">
                        Preview: {transcript.slice(-50)}...
                    </div>
                 )} */}
            </div>
            {/* Optional transcript display area */}
            {/* <div className="mt-2 text-xs text-gray-500 w-full text-center truncate">
                {transcript || "Transcript will appear here..."}
            </div> */}
        </div>
    );
}