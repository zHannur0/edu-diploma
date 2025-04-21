// src/app/(main)/listening/[course]/ielts-test/components/AudioPlayer.tsx

"use client";

import React, { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'; // Пример иконок

interface AudioPlayerProps {
    audioUrl: string;
    onEnded?: () => void;
    onPlay?: () => void; // Колбэк при начале проигрывания
    disableSeekBack?: boolean; // Запретить перемотку назад?
    disableReplay?: boolean; // Запретить повторное проигрывание после первого старта?
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
        // Отслеживаем, был ли трек проигран хотя бы раз (для disableReplay)
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
                setHasPlayed(true); // Фиксируем факт проигрывания
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

            // Загрузка метаданных при смене URL
            audio.load();

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
            // Запрещаем повторное проигрывание, если флаг установлен и уже играло
            if (disableReplay && hasPlayed && !isPlaying) {
                console.log("Replay disabled.");
                return;
            }

            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(error => console.error("Audio play failed:", error));
            }
            setIsPlaying(!isPlaying);
        }, [isPlaying, disableReplay, hasPlayed]);

        const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (!audioRef.current) return;
            const newTime = Number(event.target.value);

            // Запрещаем перемотку назад, если флаг установлен
            if (disableSeekBack && newTime < currentTime) {
                console.log("Seeking back disabled.");
                // Возвращаем ползунок на место
                if(progressBarRef.current) progressBarRef.current.value = String(currentTime);
                return;
            }

            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        };

        const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (!audioRef.current) return;
            const newVolume = Number(event.target.value);
            audioRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        };

        const toggleMute = () => {
            if (!audioRef.current) return;
            const currentlyMuted = !isMuted;
            audioRef.current.muted = currentlyMuted;
            setIsMuted(currentlyMuted);
            if (!currentlyMuted) {
                // При включении звука восстанавливаем предыдущую громкость, если она не была 0
                setVolume(prevVolume => prevVolume > 0 ? prevVolume : 0.5);
                audioRef.current.volume = volume > 0 ? volume : 0.5;
            } else {
                audioRef.current.volume = 0; // Убедимся что громкость 0 при mute
            }
        };

        const formatTime = (time: number): string => {
            if (isNaN(time) || time === Infinity) return "0:00";
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };

        return (
            <div className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center gap-4 w-full">
                <audio ref={audioRef} src={audioUrl} preload="metadata" />

                <button
                    onClick={togglePlayPause}
                    disabled={disableReplay && hasPlayed && !isPlaying} // Блокируем Play если нельзя переигрывать
                    className={`p-2 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isPlaying ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <span className="text-xs font-mono text-gray-600">{formatTime(currentTime)}</span>

                <input
                    ref={progressBarRef}
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="flex-grow h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
                    aria-label="Audio progress"
                />

                <span className="text-xs font-mono text-gray-600">{formatTime(duration)}</span>

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
                    className="w-16 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
                    aria-label="Volume"
                />
            </div>
        );
    }
);

AudioPlayer.displayName = 'AudioPlayer'; // Для DevTools

export default AudioPlayer;