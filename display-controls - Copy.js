// Display Controls - Fullscreen and Picture-in-Picture functionality
// For Timer, World Clock, and Countdown pages

(function() {
    'use strict';

    // ============================================
    // FULLSCREEN FUNCTIONALITY
    // ============================================

    /**
     * Enter fullscreen mode for an element
     * @param {HTMLElement} element - The element to make fullscreen
     */
    function enterFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari, Opera
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
            element.msRequestFullscreen();
        }
    }

    /**
     * Exit fullscreen mode
     */
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    /**
     * Check if currently in fullscreen mode
     */
    function isFullscreen() {
        return !!(document.fullscreenElement || 
                  document.mozFullScreenElement || 
                  document.webkitFullscreenElement || 
                  document.msFullscreenElement);
    }

    // ============================================
    // PICTURE-IN-PICTURE FUNCTIONALITY
    // ============================================

    /**
     * Create a canvas for Picture-in-Picture mode
     * @param {HTMLElement} element - The element to display in PiP
     * @returns {HTMLVideoElement} - Video element for PiP
     */
    async function createPiPCanvas(element) {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size based on element
        const rect = element.getBoundingClientRect();
        canvas.width = rect.width * 2; // Higher resolution
        canvas.height = rect.height * 2;

        // Create video element for PiP
        const video = document.createElement('video');
        video.srcObject = canvas.captureStream(30); // 30 fps
        video.muted = true;
        video.play();

        // Function to draw element content to canvas
        function drawToCanvas() {
            if (video.srcObject) {
                // Scale context for higher resolution
                ctx.save();
                ctx.scale(2, 2);

                // Clear canvas
                ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);

                // Get current theme
                const isDark = document.body.getAttribute('data-theme') === 'dark';

                // Set background
                ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
                ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

                // Draw border
                ctx.strokeStyle = isDark ? 'rgba(14, 165, 233, 0.3)' : 'rgba(14, 165, 233, 0.2)';
                ctx.lineWidth = 2;
                ctx.strokeRect(10, 10, canvas.width / 2 - 20, canvas.height / 2 - 20);

                // Get display text
                const displayElement = element.querySelector('.display, .clock-time');
                if (displayElement) {
                    const text = displayElement.textContent;

                    // Set text style
                    ctx.fillStyle = isDark ? '#f1f5f9' : '#1e293b';
                    ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    // Draw text
                    ctx.fillText(text, canvas.width / 4, canvas.height / 4);
                }

                // Draw title
                const titleElement = element.querySelector('h1, h3');
                if (titleElement) {
                    const title = titleElement.textContent;
                    ctx.fillStyle = '#0ea5e9';
                    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(title, canvas.width / 4, 40);
                }

                ctx.restore();

                requestAnimationFrame(drawToCanvas);
            }
        }

        drawToCanvas();
        return video;
    }

    /**
     * Enter Picture-in-Picture mode
     * @param {HTMLElement} element - The element to display in PiP
     */
    async function enterPiP(element) {
        try {
            // Check if PiP is supported
            if (!('pictureInPictureEnabled' in document)) {
                alert('Picture-in-Picture is not supported in your browser.');
                return;
            }

            // Create video element with canvas stream
            const video = await createPiPCanvas(element);

            // Request Picture-in-Picture
            await video.requestPictureInPicture();

            // Store video element for cleanup
            element.pipVideo = video;

            // Listen for PiP close
            video.addEventListener('leavepictureinpicture', () => {
                if (video.srcObject) {
                    video.srcObject.getTracks().forEach(track => track.stop());
                }
                video.remove();
                delete element.pipVideo;
            }, { once: true });

        } catch (error) {
            console.error('Error entering Picture-in-Picture:', error);
            alert('Could not enter Picture-in-Picture mode. ' + error.message);
        }
    }

    /**
     * Exit Picture-in-Picture mode
     */
    async function exitPiP() {
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            }
        } catch (error) {
            console.error('Error exiting Picture-in-Picture:', error);
        }
    }

    // ============================================
    // TIMER PAGE CONTROLS
    // ============================================

    const timerFullscreenBtn = document.getElementById('timerFullscreen');
    const timerPipBtn = document.getElementById('timerPip');
    const timerContainer = document.querySelector('.timer-container');

    if (timerFullscreenBtn && timerContainer) {
        timerFullscreenBtn.addEventListener('click', () => {
            if (isFullscreen()) {
                exitFullscreen();
            } else {
                enterFullscreen(timerContainer);
            }
        });
    }

    if (timerPipBtn && timerContainer) {
        timerPipBtn.addEventListener('click', () => {
            enterPiP(timerContainer);
        });
    }

    // ============================================
    // WORLD CLOCK PAGE CONTROLS
    // ============================================

    const worldClockFullscreenBtn = document.getElementById('worldClockFullscreen');
    const worldClockPipBtn = document.getElementById('worldClockPip');
    const clocksContainer = document.getElementById('clocksContainer');

    if (worldClockFullscreenBtn && clocksContainer) {
        worldClockFullscreenBtn.addEventListener('click', () => {
            if (isFullscreen()) {
                exitFullscreen();
            } else {
                enterFullscreen(clocksContainer.parentElement);
            }
        });
    }

    if (worldClockPipBtn && clocksContainer) {
        worldClockPipBtn.addEventListener('click', () => {
            const firstClock = clocksContainer.querySelector('.clock-card');
            if (firstClock) {
                enterPiP(firstClock);
            }
        });
    }

    // ============================================
    // STOPWATCH PAGE CONTROLS
    // ============================================

    const stopwatchFullscreenBtn = document.getElementById('stopwatchFullscreen');
    const stopwatchPipBtn = document.getElementById('stopwatchPip');
    const stopwatchContainer = document.querySelector('.stopwatch-container');

    if (stopwatchFullscreenBtn && stopwatchContainer) {
        stopwatchFullscreenBtn.addEventListener('click', () => {
            if (isFullscreen()) {
                exitFullscreen();
            } else {
                enterFullscreen(stopwatchContainer);
            }
        });
    }

    if (stopwatchPipBtn && stopwatchContainer) {
        stopwatchPipBtn.addEventListener('click', () => {
            enterPiP(stopwatchContainer);
        });
    }

    // ============================================
    // UPDATE BUTTON ICONS ON FULLSCREEN CHANGE
    // ============================================

    document.addEventListener('fullscreenchange', updateFullscreenIcons);
    document.addEventListener('mozfullscreenchange', updateFullscreenIcons);
    document.addEventListener('webkitfullscreenchange', updateFullscreenIcons);
    document.addEventListener('msfullscreenchange', updateFullscreenIcons);

    function updateFullscreenIcons() {
        const buttons = document.querySelectorAll('[id$="Fullscreen"]');
        buttons.forEach(button => {
            const svg = button.querySelector('svg path');
            if (svg) {
                if (isFullscreen()) {
                    // Exit fullscreen icon
                    svg.setAttribute('d', 'M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3');
                } else {
                    // Enter fullscreen icon
                    svg.setAttribute('d', 'M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3');
                }
            }
        });
    }

})();
