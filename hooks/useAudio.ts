import { useEffect, useRef } from 'react';

export const useAudio = (src: string) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = src;
            audioRef.current.play().catch((error) => {
                console.error('Error playing audio:', error);
            });
        }
    }, [src]);

    return audioRef;
};