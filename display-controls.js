// Display Controls - Fullscreen and Picture-in-Picture functionality
// For Timer, World Clock, and Countdown pages

(function() {
    'use strict';

    // ============================================
    // FULLSCREEN FUNCTIONALITY
    // ============================================

    function enterFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

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

    function isFullscreen() {
        return !!(document.fullscreenElement || 
                  document.mozFullScreenElement || 
                  document.webkitFullscreenElement || 
                  document.msFullscreenElement);
    }

    // ============================================
    // PICTURE-IN-PICTURE FUNCTIONALITY
    // ============================================

    async function createPiPCanvas(element) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const rect = element.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;

        const video = document.createElement('video');
        video.srcObject = canvas.captureStream(30);
        video.muted = true;
        video.play();

        function drawToCanvas() {
            if (video.srcObject) {
                ctx.save();
                ctx.scale(2, 2);
                ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);

                const isDark = document.body.getAttribute('data-theme') === 'dark';
                ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
                ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

                ctx.strokeStyle = isDark ? 'rgba(14, 165, 233, 0.3)' : 'rgba(14, 165, 233, 0.2)';
                ctx.lineWidth = 2;
                ctx.strokeRect(10, 10, canvas.width / 2 - 20, canvas.height / 2 - 20);

                const displayElement = element.querySelector('.display, .clock-time');
                if (displayElement) {
                    const text = displayElement.textContent;
                    ctx.fillStyle = isDark ? '#f1f5f9' : '#1e293b';
                    ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(text, canvas.width / 4, canvas.height / 4);
                }

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

    async function enterPiP(element) {
        try {
            if (!('pictureInPictureEnabled' in document)) {
                alert('Picture-in-Picture is not supported in your browser.');
                return;
            }

            const video = await createPiPCanvas(element);
            await video.requestPictureInPicture();
            element.pipVideo = video;

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
                    svg.setAttribute('d', 'M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3');
                } else {
                    svg.setAttribute('d', 'M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3');
                }
            }
        });
    }

})();
