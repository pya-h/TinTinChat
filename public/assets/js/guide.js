/**
 * Guide / Tips Modal
 *
 * Shows a guide overlay with tips about features that users may not
 * discover on their own. Opened from the settings context menu.
 */
(function initGuide() {
    "use strict";

    const GUIDE_TIPS = [
        {
            icon: "fa-hand-pointer",
            title: "Message Actions",
            desc: "Right-click or double-click a message on desktop. On mobile, long-press or double-tap to open the action menu.",
            demo: "right-click / long-press",
        },
        {
            icon: "fa-arrows-alt-h",
            title: "Swipe Gestures",
            desc: "Swipe right on any message to reply. Swipe left on your own messages to edit or forward. Works on both mobile (swipe) and desktop (click-drag).",
            demo: "swipe \u2192 reply &nbsp;&bull;&nbsp; swipe \u2190 edit",
        },
        {
            icon: "fa-paperclip",
            title: "Send Files",
            desc: "Long-press or right-click the Send button to upload a file (any type). The camera and media buttons only appear when you tap the \"+\" icon next to the composer.",
            demo: "hold send button \u2192 file picker",
        },
        {
            icon: "fa-microphone",
            title: "Voice Messages",
            desc: "Tap the microphone button to record a voice message. Tap again to send, or cancel to discard. Voice messages include an interactive waveform for playback.",
        },
        {
            icon: "fa-camera",
            title: "Photo & Video Capture",
            desc: "From the \"+\" media menu, choose \"Camera\" to take a photo or \"Record video\" to capture video directly from your device. You can also select existing photos and videos from your gallery.",
        },
        {
            icon: "fa-share",
            title: "Forward Messages",
            desc: "Forward any message to another chat. Use the action menu on a single message, or enter Select mode to forward multiple messages at once.",
        },
        {
            icon: "fa-check-double",
            title: "Select Multiple Messages",
            desc: "In the message action menu, choose \"Select\" to enter multi-select mode. You can then copy, forward, or delete multiple messages at once.",
        },
        {
            icon: "fa-smile",
            title: "Reactions",
            desc: "Open the message action menu and tap \"React\" to add an emoji reaction to any message.",
        },
        {
            icon: "fa-search",
            title: "Search in Chat",
            desc: "Use Ctrl+F (or Cmd+F) to search within the current conversation. You can also open it from the search icon in the chat header.",
        },
        {
            icon: "fa-reply",
            title: "Reply to Messages",
            desc: "Besides swiping, you can reply to any message from the action menu. The reply preview appears above the composer.",
        },
        {
            icon: "fa-edit",
            title: "Edit Messages",
            desc: "You can edit your own text messages within the allowed time window. Swipe left or use the action menu to enter edit mode.",
        },
        {
            icon: "fa-bookmark",
            title: "Saved Messages",
            desc: "Send messages to yourself using the \"Saved Messages\" chat at the top of your chat list. Great for notes, bookmarks, and file storage.",
        },
        {
            icon: "fa-music",
            title: "Music & Playlist",
            desc: "Audio files sent in chat are detected as music with an inline player. You can add tracks to a playlist from the message action menu for continuous playback.",
        },
        {
            icon: "fa-bars",
            title: "Mobile Chat List",
            desc: "On mobile, pull down the chat-list handle at the top to expand the full chat list. Pull up or press Back to collapse it.",
            demo: "pull down \u2192 expand &nbsp;&bull;&nbsp; back \u2192 collapse",
        },
        {
            icon: "fa-lock",
            title: "End-to-End Encryption",
            desc: "All messages are end-to-end encrypted. Private chats use RSA, group chats use AES-GCM. Media files are encrypted with an envelope scheme.",
        },
        {
            icon: "fa-users",
            title: "Group Chats",
            desc: "Create groups from the \"+\" button below the chat list. Share the join link to invite members. Group owners can manage members from the group info panel.",
        },
        {
            icon: "fa-image",
            title: "Stickers",
            desc: "Open the sticker picker with the smiley icon next to the composer. You can upload your own stickers, with automatic background removal.",
        },
        {
            icon: "fa-bell",
            title: "Browser Notifications",
            desc: "Enable in Settings \u2192 General to receive notifications even when the tab is in the background.",
        },
        {
            icon: "fa-palette",
            title: "Themes & Appearance",
            desc: "Change theme (light/dark/system), message density, font size, and more from Settings \u2192 General.",
        },
    ];

    const overlay = document.getElementById("guideOverlay");
    const body = document.getElementById("guideBody");
    const dismissBtn = document.getElementById("guideDismissBtn");
    const closeBtn = document.getElementById("guideCloseBtn");
    const openBtn = document.getElementById("openGuideBtn");
    if (!overlay || !body) return;

    function renderGuide() {
        let html = '<div class="guide-list">';
        GUIDE_TIPS.forEach((tip, i) => {
            html += `<div class="guide-tip" style="animation-delay:${i * 50}ms">
                <div class="guide-tip-icon"><i class="fas ${tip.icon}"></i></div>
                <div class="guide-tip-content">
                    <div class="guide-tip-title">${tip.title}</div>
                    <div class="guide-tip-desc">${tip.desc}</div>
                    ${tip.demo ? `<div class="guide-tip-demo"><i class="fas fa-hand-point-right me-1"></i>${tip.demo}</div>` : ""}
                </div>
            </div>`;
        });
        html += "</div>";
        body.innerHTML = html;
    }

    function openGuide() {
        renderGuide();
        overlay.style.display = "flex";
        requestAnimationFrame(() => overlay.classList.add("visible"));
        // Close settings panel if open
        const settingsPanel = document.getElementById("chatSettingsPanel");
        if (settingsPanel && !settingsPanel.hidden) settingsPanel.hidden = true;
    }

    function closeGuide() {
        overlay.classList.remove("visible");
        setTimeout(() => { overlay.style.display = "none"; }, 500);
    }

    openBtn?.addEventListener("click", openGuide);
    dismissBtn?.addEventListener("click", closeGuide);
    closeBtn?.addEventListener("click", closeGuide);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeGuide();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.style.display !== "none") closeGuide();
    });

    window.openGuide = openGuide;
})();
