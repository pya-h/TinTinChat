/**
 * Voice & Music Message Players
 * Extracted from chat.js for readability.
 *
 * Dependencies (from chat.js global scope):
 *   getMessageElementById, messageMetaById, audioContext, activeAnalyser,
 *   getDecryptedMediaResource, showModal, showGlobalNowPlaying, stopAllAudio,
 *   I18N_TEXT, formatMessageTimeLabel
 */

function updateVoiceSeekBars(waveformBarsEl, ratio) {
    const bars = waveformBarsEl.querySelectorAll(".waveform-bar");
    const playedCount = Math.floor(ratio * bars.length);
    bars.forEach((bar, idx) => {
        if (idx < playedCount) bar.classList.add("played");
        else bar.classList.remove("played");
    });
}

function applyVoiceSeek(messageElement, clientX) {
    const waveformBarsEl = messageElement.querySelector(".waveform-bars");
    if (!waveformBarsEl) return;
    const rect = waveformBarsEl.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    updateVoiceSeekBars(waveformBarsEl, ratio);
    const audio = messageElement.querySelector("audio");
    if (audio && isFinite(audio.duration)) {
        audio.currentTime = ratio * audio.duration;
    } else {
        messageElement.dataset.pendingVoiceSeekRatio = String(ratio);
    }
}

window.playVoiceMessage = async function (messageId) {
    const messageDiv = getMessageElementById(messageId);
    if (!messageDiv) return;

    const messageMeta = messageMetaById.get(Number(messageId));
    if (!messageMeta) {
        showModal("Audio Error", "Unable to load voice metadata.", "error");
        return;
    }

    const playBtn = messageDiv.querySelector(".voice-play-btn");
    const durationDisplay = messageDiv.querySelector(".voice-duration-display");
    const voiceContainer = messageDiv.querySelector(".voice-player-container");

    const updateVoicePlaybackUi = function () {
        if (!durationDisplay || !audio) return;
        const hasDuration = isFinite(audio.duration) && audio.duration > 0;
        const currentSeconds = Math.max(0, Math.round(audio.currentTime || 0));
        const displaySeconds =
            audio.ended && hasDuration
                ? Math.round(audio.duration)
                : currentSeconds;
        const minutes = Math.floor(displaySeconds / 60);
        const seconds = displaySeconds % 60;
        durationDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        if (hasDuration) {
            const progress = Math.max(
                0,
                Math.min(1, audio.currentTime / audio.duration),
            );
            const waveformBarsEl = messageDiv.querySelector(".waveform-bars");
            if (waveformBarsEl) {
                updateVoiceSeekBars(waveformBarsEl, progress);
            }
        }
    };

    let audio = messageDiv.querySelector("audio");
    if (!audio) {
        if (!audioContext) {
            audioContext = new (
                window.AudioContext || window.webkitAudioContext
            )();
        }

        audio = document.createElement("audio");
        try {
            const mediaResource = await getDecryptedMediaResource(messageMeta);
            audio.src = mediaResource.objectUrl;
        } catch (error) {
            const isPurged = error?.message === "FILE_UNAVAILABLE";
            showModal(
                isPurged ? "File Expired" : "Audio Error",
                isPurged
                    ? "This voice message has been removed due to server cleanup."
                    : "Unable to decrypt voice message.",
                isPurged ? "warning" : "error",
            );
            if (playBtn) {
                playBtn.disabled = true;
                playBtn.style.opacity = "0.4";
            }
            return;
        }
        audio.preload = "metadata";
        audio.style.display = "none"; // Hide the actual audio element
        messageDiv.appendChild(audio);

        const source = audioContext.createMediaElementSource(audio);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);
        analyser.connect(audioContext.destination);

        messageDiv.audioAnalyser = { analyser, bufferLength, dataArray };

        audio.addEventListener("loadedmetadata", function () {
            if (isFinite(audio.duration)) {
                const pendingRatio = parseFloat(
                    messageDiv.dataset.pendingVoiceSeekRatio,
                );
                if (
                    isFinite(pendingRatio) &&
                    pendingRatio >= 0 &&
                    pendingRatio <= 1
                ) {
                    audio.currentTime = pendingRatio * audio.duration;
                    delete messageDiv.dataset.pendingVoiceSeekRatio;
                }
                updateVoicePlaybackUi();
            } else {
                durationDisplay.textContent = "??:??";
            }
        });

        audio.addEventListener("durationchange", function () {
            if (isFinite(audio.duration)) {
                updateVoicePlaybackUi();
            }
        });

        audio.addEventListener("timeupdate", function () {
            updateVoicePlaybackUi();
        });

        audio.addEventListener("play", function () {
            updateVoicePlaybackUi();
        });

        audio.addEventListener("ended", function () {
            playBtn.innerHTML = `<i class="fas fa-play"></i>`;
            playBtn.classList.remove("playing");
            voiceContainer?.classList.remove("is-playing");
            updateVoicePlaybackUi();

            const waveformBarsEl = messageDiv.querySelector(".waveform-bars");
            if (waveformBarsEl) {
                updateVoiceSeekBars(waveformBarsEl, 1);
            }
        });

        audio.addEventListener("error", function (e) {
            showModal(
                "Audio Error",
                "Unable to load voice message. The audio file may be missing or corrupted.",
                "error",
            );
            playBtn.disabled = true;
            playBtn.style.opacity = "0.5";
        });

        // Waveform seek: clicking on bars seeks audio to that position
        const waveformBarsEl = messageDiv.querySelector(".waveform-bars");
        if (waveformBarsEl) {
            waveformBarsEl.addEventListener("click", function (e) {
                if (!audio || !isFinite(audio.duration)) return;
                const rect = waveformBarsEl.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                audio.currentTime = ratio * audio.duration;

                // Immediately update played bars
                const bars = waveformBarsEl.querySelectorAll(".waveform-bar");
                const playedCount = Math.floor(ratio * bars.length);
                bars.forEach((bar, idx) => {
                    if (idx < playedCount) bar.classList.add("played");
                    else bar.classList.remove("played");
                });
            });
        }

        // ── Force-discover duration for blob URLs ──
        // WebM files produced by MediaRecorder lack a duration in their
        // container header, so browsers report audio.duration === Infinity.
        // Seeking to a huge value forces the browser to scan the file and
        // report the real duration via the "durationchange" event.
        if (!isFinite(audio.duration) || audio.duration <= 0) {
            await new Promise((resolve) => {
                let settled = false;
                const finish = () => {
                    if (settled) return;
                    settled = true;
                    audio.removeEventListener("durationchange", onDur);
                    resolve();
                };
                const onDur = () => {
                    if (isFinite(audio.duration) && audio.duration > 0) {
                        audio.currentTime = 0;
                        finish();
                    }
                };
                audio.addEventListener("durationchange", onDur);

                // Seek after enough data is available
                if (audio.readyState >= 1) {
                    audio.currentTime = 1e101;
                } else {
                    audio.addEventListener(
                        "loadedmetadata",
                        () => {
                            if (!settled) audio.currentTime = 1e101;
                        },
                        { once: true },
                    );
                }

                // Safety fallback — proceed even if discovery fails
                setTimeout(() => {
                    try {
                        if (!settled) audio.currentTime = 0;
                    } catch (_) {}
                    finish();
                }, 4000);
            });
        }
    }

    const { analyser, dataArray } = messageDiv.audioAnalyser;
    const waveformBarsContainer = messageDiv.querySelector(".waveform-bars");

    function draw() {
        if (audio.paused || audio.ended) {
            if (activeAnalyser === analyser) activeAnalyser = null;

            const bars = waveformBarsContainer.children;
            for (let i = 0; i < bars.length; i++) {
                const baseHeight = Number(bars[i].dataset?.baseHeight || 20);
                bars[i].style.height = `${Math.max(10, baseHeight)}%`;
            }

            return;
        }

        activeAnalyser = analyser;
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        const bars = waveformBarsContainer.children;
        const barCount = bars.length;

        for (let i = 0; i < barCount; i++) {
            const barHeight = Math.pow(dataArray[i] / 255, 2) * 100;
            bars[i].style.height = `${Math.max(10, barHeight)}%`;
        }
    }

    if (audio.paused) {
        // Stop all other audio sources
        stopAllAudio();

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        audio
            .play()
            .then(function () {
                draw();
                updateVoicePlaybackUi();
            })
            .catch(function (error) {
                showModal(
                    I18N_TEXT.playbackErrorTitle,
                    I18N_TEXT.playbackErrorBody,
                    "error",
                );
            });
        playBtn.classList.add("playing");
        voiceContainer?.classList.add("is-playing");
        playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        // Show global now-playing bar
        const voiceCaption =
            (messageMeta.sender_username || "Voice") +
            " · " +
            formatMessageTimeLabel(messageMeta.created_at);
        showGlobalNowPlaying(audio, voiceCaption, "voice");
    } else {
        audio.pause();
        playBtn.classList.remove("playing");
        voiceContainer?.classList.remove("is-playing");
        playBtn.innerHTML = `<i class="fas fa-play"></i>`;
    }
};

/* ── Music message player ── */
window.playMusicMessage = async function (messageId) {
    const messageDiv = getMessageElementById(messageId);
    if (!messageDiv) return;

    const messageMeta = messageMetaById.get(Number(messageId));
    if (!messageMeta) {
        showModal("Audio Error", "Unable to load music metadata.", "error");
        return;
    }

    const playBtn = messageDiv.querySelector(".music-play-btn");
    const durationDisplay = messageDiv.querySelector(".music-duration");
    const progressBar = messageDiv.querySelector(".music-progress-bar");
    const container = messageDiv.querySelector(".music-player-container");

    let audio = messageDiv.querySelector("audio");
    if (!audio) {
        if (!audioContext) {
            audioContext = new (
                window.AudioContext || window.webkitAudioContext
            )();
        }

        audio = document.createElement("audio");
        try {
            const mediaResource = await getDecryptedMediaResource(messageMeta);
            audio.src = mediaResource.objectUrl;
        } catch (error) {
            const isPurged = error?.message === "FILE_UNAVAILABLE";
            showModal(
                isPurged ? "File Expired" : "Audio Error",
                isPurged
                    ? "This music file has been removed due to server cleanup."
                    : "Unable to decrypt music file.",
                isPurged ? "warning" : "error",
            );
            if (playBtn) {
                playBtn.disabled = true;
                playBtn.style.opacity = "0.4";
            }
            return;
        }
        audio.preload = "metadata";
        audio.style.display = "none";
        messageDiv.appendChild(audio);

        audio.addEventListener("loadedmetadata", function () {
            if (isFinite(audio.duration)) {
                const dur = Math.round(audio.duration);
                const m = Math.floor(dur / 60);
                const s = dur % 60;
                durationDisplay.textContent = `${m}:${s.toString().padStart(2, "0")}`;
            }
        });

        audio.addEventListener("timeupdate", function () {
            if (isFinite(audio.duration) && audio.duration > 0) {
                const cur = Math.round(audio.currentTime);
                const m = Math.floor(cur / 60);
                const s = cur % 60;
                durationDisplay.textContent = `${m}:${s.toString().padStart(2, "0")}`;
                const pct = (audio.currentTime / audio.duration) * 100;
                if (progressBar) progressBar.style.width = `${pct}%`;
            }
        });

        audio.addEventListener("ended", function () {
            playBtn.innerHTML = `<i class="fas fa-play"></i>`;
            playBtn.classList.remove("playing");
            container?.classList.remove("is-playing");
            if (progressBar) progressBar.style.width = "100%";
        });

        audio.addEventListener("error", function () {
            showModal("Audio Error", "Unable to play music file.", "error");
            playBtn.disabled = true;
            playBtn.style.opacity = "0.5";
        });

        // Click + drag on progress bar to seek
        const progressWrap = messageDiv.querySelector(".music-progress-wrap");
        if (progressWrap) {
            function seekToPosition(clientX) {
                if (!audio || !isFinite(audio.duration)) return;
                const rect = progressWrap.getBoundingClientRect();
                const ratio = Math.max(
                    0,
                    Math.min(1, (clientX - rect.left) / rect.width),
                );
                audio.currentTime = ratio * audio.duration;
                if (progressBar) progressBar.style.width = `${ratio * 100}%`;
            }

            // Mouse drag
            progressWrap.addEventListener("mousedown", function (e) {
                e.preventDefault();
                seekToPosition(e.clientX);
                progressWrap.classList.add("seeking");
                function onMouseMove(ev) {
                    seekToPosition(ev.clientX);
                }
                function onMouseUp() {
                    progressWrap.classList.remove("seeking");
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                }
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            });

            // Touch drag
            progressWrap.addEventListener("touchstart", function (e) {
                e.preventDefault();
                e.stopPropagation();
                seekToPosition(e.touches[0].clientX);
                progressWrap.classList.add("seeking");
            });
            progressWrap.addEventListener("touchmove", function (e) {
                e.preventDefault();
                e.stopPropagation();
                seekToPosition(e.touches[0].clientX);
            });
            progressWrap.addEventListener("touchend", function () {
                progressWrap.classList.remove("seeking");
            });
        }
    }

    if (audio.paused) {
        // Stop all other audio sources
        stopAllAudio();

        if (audioContext.state === "suspended") audioContext.resume();
        audio.play().catch(() => {
            showModal("Playback Error", "Unable to play this audio.", "error");
        });
        playBtn.classList.add("playing");
        container?.classList.add("is-playing");
        playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        // Show global now-playing bar
        const musicCaption =
            messageDiv.querySelector(".music-title")?.textContent || "Music";
        showGlobalNowPlaying(audio, musicCaption, "music");
    } else {
        audio.pause();
        playBtn.classList.remove("playing");
        container?.classList.remove("is-playing");
        playBtn.innerHTML = `<i class="fas fa-play"></i>`;
    }
};
