import React, { useEffect, useState } from 'react';
import { usePlayer } from '@/hooks/usePlayer';
import { useAudio } from '@/hooks/useAudio';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaSync, FaDownload } from 'react-icons/fa';
import { Song } from "@/types";
import { Slider } from './Slider';
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { useLoadImage } from "@/hooks/useLoadImage";
import {toast} from "react-hot-toast";

interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

export const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
    const { ids, activeId, setId, isShuffling, shuffledIds, toggleShuffle, isLooping, toggleLoop, progress, duration, updateProgress } = usePlayer();
    const audioRef = useAudio(songUrl);
    const [isPlaying, setIsPlaying] = useState(true); // State for play/pause
    const [volume, setVolume] = useState(1);
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;
    const songImage = useLoadImage(song);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            updateProgress(audioRef.current.currentTime, audioRef.current.duration);
        }
    };

    const handleProgressBarClick = (e: { target: { getBoundingClientRect: () => any; }; clientX: number; }) => {
        if (!duration || isNaN(duration)) return; // Ensure duration is a valid number before using it

        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const newTime = (x / rect.width) * duration;
        if (audioRef.current && !isNaN(newTime)) {
            audioRef.current.currentTime = newTime;
            updateProgress(newTime, duration);
        }
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch((error) => {
                    console.error('Error playing audio:', error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (value: number) => {
        if (audioRef.current) {
            audioRef.current.volume = value;
            setVolume(value);
        }
    };

    const toggleMute = () => {
        if (volume === 0) {
            setVolume(1);
            if (audioRef.current) {
                audioRef.current.volume = 1;
            }
        } else {
            setVolume(0);
            if (audioRef.current) {
                audioRef.current.volume = 0;
            }
        }
    };

    const handlePrevious = () => {
        if (!activeId) return;
        const list = isShuffling ? shuffledIds : ids;
        const currentIndex = list.indexOf(activeId);
        const previousIndex = (currentIndex - 1 + list.length) % list.length;
        setId(list[previousIndex]);
    };

    const handleNext = () => {
        if (!activeId) return;
        const list = isShuffling ? shuffledIds : ids;
        const currentIndex = list.indexOf(activeId);
        const nextIndex = (currentIndex + 1) % list.length;
        setId(list[nextIndex]);
    };

    const handleEnded = () => {
        if (isLooping) {
            audioRef.current?.play();
        } else {
            handleNext();
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('ended', handleEnded);
            return () => {
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('ended', handleEnded);
            };
        }
    }, [audioRef, handleEnded]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch((error) => {
                console.error('Error playing audio:', error);
                toast.error('Unable to play audio. Please try another track.');
            });
            setIsPlaying(true);
        }
    }, [songUrl]);

    const formatTime = (time: number) => {
        if (isNaN(time) || time === undefined) {
            return '00:00';
        }
        return new Date(time * 1000).toISOString().substr(14, 5);
    };

    const downloadAudio = () => {
        const link = document.createElement('a');
        link.href = songUrl;
        link.download = `${song.title}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex items-center justify-between px-4 bg-black text-white h-full">
            <audio ref={audioRef} preload="auto" />

            <div className="flex items-center space-x-4">
                <img src={songImage || '/images/apple-touch-icon.png'} alt={song.title} className="w-12 h-12 object-cover" />
                <div className="flex flex-col">
                    <span className="font-bold">{song.title}</span>
                    <span className="text-xs text-gray-400">{song.author}</span>
                </div>
            </div>

            <div className="flex flex-col items-center mx-4 w-full max-w-xl">
                <div className="flex items-center space-x-4 mb-2">
                    <button onClick={toggleShuffle} className={`text-white ${isShuffling ? 'text-green-500' : ''}`}>
                        <FaRandom />
                    </button>
                    <button onClick={handlePrevious} className="text-white">
                        <FaStepBackward />
                    </button>
                    <button onClick={togglePlayPause} className="text-black bg-white rounded-full w-12 h-12 flex items-center justify-center">
                        {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                    </button>
                    <button onClick={handleNext} className="text-white">
                        <FaStepForward />
                    </button>
                    <button onClick={toggleLoop} className={`text-white ${isLooping ? 'text-green-500' : ''}`}>
                        <FaSync />
                    </button>
                </div>
                <div className="flex items-center w-full">
                    <span className="text-xs text-gray-400">{formatTime(progress)}</span>
                    <div onClick={handleProgressBarClick} style={{ cursor: 'pointer' }} className="relative h-1 bg-gray-600 flex-grow mx-2">
                        <div style={{ width: `${(progress / duration) * 100}%` }} className="absolute h-full bg-white"></div>
                    </div>
                    <span className="text-xs text-gray-400">{formatTime(duration)}</span>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="hidden md:flex w-full justify-end pr-2">
                    <div className="flex items-center gap-x-2 w-[120px]">
                        <VolumeIcon
                            onClick={toggleMute}
                            className="cursor-pointer"
                            size={34}
                        />
                        <Slider value={volume} onChange={handleVolumeChange}/>
                    </div>
                </div>
                <button onClick={downloadAudio} className="text-white">
                    <FaDownload/>
                </button>
            </div>
        </div>
    );
};