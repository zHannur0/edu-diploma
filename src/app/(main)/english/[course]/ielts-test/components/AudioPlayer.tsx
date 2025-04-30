"use client";

import React, { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
    audioUrl: string;
    onEnded?: () => void;
    onPlay?: () => void;
    disableSeekBack?: boolean;
    disableReplay?: boolean;
}

const AudioPlayer = forwardRef<({ getCurrentTime: () => number }), AudioPlayerProps>(
    ({ audioUrl, onEnded, onPlay, disableSeekBack = false, disableReplay = false }, ref) => {
        const audioRef = useRef<HTMLAudioElement>(null);
        const progressBarRef = useRef<HTMLInputElement>(null);

        const [isPlaying, setIsPlaying] = useState(false);
        const [duration, setDuration] = useState<number>(0);
        const [currentTime, setCurrentTime] = useState<number>(0);
        const [volume, setVolume] = useState<number>(1);
        const [isMuted, setIsMuted] = useState<boolean>(false);
        const [hasPlayed, setHasPlayed] = useState<boolean>(false);

        useImperativeHandle(ref, () => ({
            getCurrentTime: () => audioRef.current?.currentTime || 0,
        }));

        useEffect(() => {
            const audio = audioRef.current;
            if (!audio) return;

            const setAudioData = () => setDuration(audio.duration);
            const setAudioTime = () => setCurrentTime(audio.currentTime);
            const handleAudioEnd = () => {
                setIsPlaying(false);
                if (onEnded) onEnded();
            };
            const handleAudioPlay = () => {
                setIsPlaying(true);
                setHasPlayed(true);
                if(onPlay) onPlay();
            };
            const handleAudioPause = () => {
                setIsPlaying(false);
            };

            audio.addEventListener('loadedmetadata', setAudioData);
            audio.addEventListener('timeupdate', setAudioTime);
            audio.addEventListener('ended', handleAudioEnd);
            audio.addEventListener('play', handleAudioPlay);
            audio.addEventListener('pause', handleAudioPause);

            if (audio.currentSrc !== audioUrl) {
                audio.src = audioUrl;
                audio.load();
                setCurrentTime(0);
                setDuration(0);
                setIsPlaying(false);
                setHasPlayed(false);
            }

            return () => {
                audio.removeEventListener('loadedmetadata', setAudioData);
                audio.removeEventListener('timeupdate', setAudioTime);
                audio.removeEventListener('ended', handleAudioEnd);
                audio.removeEventListener('play', handleAudioPlay);
                audio.removeEventListener('pause', handleAudioPause);
            };
        }, [audioUrl, onEnded, onPlay]);

        const togglePlayPause = useCallback(() => {
            if (!audioRef.current) return;
            if (disableReplay && hasPlayed && !isPlaying) {
                return;
            }

            const audio = audioRef.current;
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(error => {
                    console.error("Audio play() failed:", error);
                });
            }
            // Состояние isPlaying обновится через обработчики 'play'/'pause'
        }, [isPlaying, disableReplay, hasPlayed]);

        const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const audio = audioRef.current;
            if (!audio) return;
            const newTime = Number(event.target.value);

            if (disableSeekBack && newTime < currentTime && hasPlayed) {
                if(progressBarRef.current) progressBarRef.current.value = String(currentTime);
                return;
            }

            audio.currentTime = newTime;
            setCurrentTime(newTime);
        };

        const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const audio = audioRef.current;
            if (!audio) return;
            const newVolume = Number(event.target.value);
            audio.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        };

        const toggleMute = () => {
            const audio = audioRef.current;
            if (!audio) return;
            const currentlyMuted = !isMuted;
            audio.muted = currentlyMuted;
            setIsMuted(currentlyMuted);
            if (!currentlyMuted) {
                const restoredVolume = volume > 0 ? volume : 0.5;
                setVolume(restoredVolume);
                audio.volume = restoredVolume;
            }
            // Если включили mute, громкость уже 0 или станет 0 через audio.muted = true
        };

        const formatTime = (time: number): string => {
            if (isNaN(time) || time < 0 || !isFinite(time)) return "0:00";
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };

        return (
            <div className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center gap-4 w-full">
                <audio ref={audioRef} src={audioUrl} preload="metadata" />

                <button
                    onClick={togglePlayPause}
                    disabled={disableReplay && hasPlayed && !isPlaying}
                    className={`p-2 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isPlaying ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <span className="text-xs font-mono text-gray-600 w-10 text-center">{formatTime(currentTime)}</span>

                <input
                    ref={progressBarRef}
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="flex-grow h-1.5 bg-gray-300 rounded-full appearance-none cursor-pointer thumb:bg-blue-500"
                    aria-label="Audio progress"
                    disabled={disableSeekBack && hasPlayed}
                />

                <span className="text-xs font-mono text-gray-600 w-10 text-center">{formatTime(duration)}</span>

                <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none" aria-label={isMuted ? 'Unmute' : 'Mute'}>
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1.5 bg-gray-300 rounded-full appearance-none cursor-pointer thumb:bg-blue-500"
                        aria-label="Volume"
                    />
                </div>
            </div>
        );
    }
);

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;