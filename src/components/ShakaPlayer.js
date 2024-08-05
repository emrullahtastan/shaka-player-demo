import React, { useEffect, useRef } from 'react';
import shaka from 'shaka-player';

const ShakaPlayer = ({ src }) => {
    const videoRef = useRef(null);
    useEffect(() => {
        const video = videoRef.current;
        const player = new shaka.Player(video);

        player.load(src).catch(error => {
            console.error('Error loading video', error);
        });

        return () => {
            player.destroy();
        };
    }, [src]);
    return (
        <video
            ref={videoRef}
            width="640"
            controls
            style={{ width: '100%', height: 'auto' }}
        />
    );
};

export default ShakaPlayer;
