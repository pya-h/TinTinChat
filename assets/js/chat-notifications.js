(function (global) {
    const DEFAULT_VOLUME = 0.7;
    const FALLBACK_SOUND_DATA_URI =
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";

    function createPlayer({ customSoundPath = "", volume = DEFAULT_VOLUME } = {}) {
        let notificationAudio = null;
        let customNotificationAudio = null;
        let customObjectUrl = null;

        function initNotificationSound() {
            if (!notificationAudio) {
                notificationAudio = new Audio();
                notificationAudio.src = FALLBACK_SOUND_DATA_URI;
                notificationAudio.volume = volume;
            }
        }

        function createNotificationSound() {
            try {
                const audioContext = new (global.AudioContext || global.webkitAudioContext)();
                const now = audioContext.currentTime;

                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();

                osc.connect(gain);
                gain.connect(audioContext.destination);

                osc.type = "sine";
                osc.frequency.setValueAtTime(850, now);
                osc.frequency.setValueAtTime(550, now + 0.12);

                gain.gain.setValueAtTime(0.6, now);
                gain.gain.exponentialRampToValueAtTime(0.05, now + 0.25);

                osc.start(now);
                osc.stop(now + 0.25);
            } catch (error) {
                initNotificationSound();
            }
        }

        function playDefaultNotificationSound() {
            initNotificationSound();
            createNotificationSound();
            return notificationAudio.cloneNode().play();
        }

        async function preloadCustom() {
            if (!customSoundPath) {
                return false;
            }

            try {
                const response = await fetch(customSoundPath);
                if (response.ok) {
                    const blob = await response.blob();
                    if (customObjectUrl) URL.revokeObjectURL(customObjectUrl);
                    customObjectUrl = URL.createObjectURL(blob);
                    customNotificationAudio = new Audio();
                    customNotificationAudio.src = customObjectUrl;
                    customNotificationAudio.volume = volume;
                    return true;
                }
            } catch (error) {
                initNotificationSound();
                createNotificationSound();
            }

            return false;
        }

        function play() {
            if (customNotificationAudio) {
                return customNotificationAudio
                    .cloneNode()
                    .play()
                    .catch(() => playDefaultNotificationSound());
            }

            initNotificationSound();
            createNotificationSound();
            return notificationAudio
                .cloneNode()
                .play()
                .catch(() => playDefaultNotificationSound());
        }

        return {
            preloadCustom,
            play,
        };
    }

    global.ChatNotificationService = {
        createPlayer,
    };
})(window);