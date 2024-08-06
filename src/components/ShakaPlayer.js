import React, {useEffect, useRef, useState} from 'react';
import shaka from 'shaka-player';

const ShakaPlayer = ({src}) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        const player = new shaka.Player(video);
        const maxAttempts = 3;
        let retryCount = 0;
        let counter = 0;
        // Retry configuration
        player.configure({
            streaming: {
                retryParameters: {
                    maxAttempts,
                    baseDelay: 1000,
                    backoffFactor: 2,
                    fuzzFactor: 0.5,
                    timeout: 0,
                },
            },
        });
        player.getNetworkingEngine().registerRequestFilter((type, request) => {
            counter++;
            console.log("counter:", counter)
            console.log(request)
            if (type === 1 && counter >= 6)
                request.uris[0] += "/hu"
            console.log("request:", request.uris[0])
            return request;
        });

        // Error handling
        player.addEventListener('error', (event) => {
            const shakaError = event.detail;
            console.error('Shaka Player Error:', shakaError);
            // Check if the error is retryable
            if (shakaError.code === shaka.util.Error.Code.BAD_HTTP_STATUS) {
                retryCount++;
                console.log("retryCount:", retryCount)
                if (retryCount >= maxAttempts) {
                    const criticalError = new shaka.util.Error(
                        shaka.util.Error.Severity.CRITICAL,
                        shaka.util.Error.Category.NETWORK,
                        shaka.util.Error.Code.HTTP_ERROR
                    );
                    console.error('Max retry attempts reached:', criticalError);
                }
            } else {
                console.error('Video yüklenemedi. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.');
            }
        });

        player.load(src).catch(error => {
            console.error('Error loading video', error, getErrorName({code: shaka.util.Error.Code}));
        });

        return () => {
            player.destroy();
        };
    }, [src]);

    return (
        <div>
            <video
                ref={videoRef}
                width="640"
                controls
                style={{width: '500px', height: 'auto'}}
            />
        </div>
    );
};

export default ShakaPlayer;

const getErrorName = ({code}) => {
    const source = Object.entries(shaka.util.Error.Code).map((c) => {
        return {key:c[1], value:c[0]};
    }) || [];
    console.log(source)
    return source.find(s=>s.key===code)?.value;
}
