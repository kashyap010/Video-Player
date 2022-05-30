// VARIABLES
const video = document.getElementsByTagName('video')[0],
	videoContainer = document.querySelector('.video'),
	videoBackground = document.querySelector('.video-background'),
	progressBar = document.querySelector('.progress-bar'),
	progressBarTrack = document.querySelector('.progress-bar-track'),
	playPause = document.querySelector('.play-pause'),
	volumeIcon = document.querySelector('.volume-icon'),
	volumeSlider = document.querySelector('.volume-slider'),
	volumeSliderTrack = document.querySelector('.volume-slider-track'),
	playbackSpeed = document.getElementById('playback-speed'),
	trackInfoRunning = document.querySelector('.running'),
	trackInfoTotal = document.querySelector('.total'),
	fullscreenIcon = document.querySelector('.full-screen');

let previousVolume = 1,
	fullscreenToggle = true;

// FUNCTIONS
function changePlaybackRate() {
	video.playbackRate = parseFloat(playbackSpeed.value);
}

// https://stackoverflow.com/a/11486026
function format(time) {
	//~~ shorthand for Math.floor
	var hrs = ~~(time / 3600);
	var mins = ~~((time % 3600) / 60);
	var secs = ~~time % 60;

	// Output like "1:01" or "4:03:59" or "123:03:59"
	var ret = '';
	if (hrs > 0) {
		ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
	}
	ret += '' + mins + ':' + (secs < 10 ? '0' : '');
	ret += '' + secs;
	return ret;
}

function makeFullscreen(elem) {
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) {
		/* Safari */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) {
		/* IE11 */
		elem.msRequestFullscreen();
	}
	fullscreenIcon.firstElementChild.classList.replace('fa-expand', 'fa-compress');
	videoBackground.classList.add('video-background-fullscreen');
}

function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		/* Safari */
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		/* IE11 */
		document.msExitFullscreen();
	}
	fullscreenIcon.firstElementChild.classList.replace('fa-compress', 'fa-expand');
	videoBackground.classList.remove('video-background-fullscreen');
}

function handlePlayPause() {
	if (video.paused) {
		video.play();
		playPause.firstElementChild.classList.replace('fa-play', 'fa-pause');
	} else {
		video.pause();
		playPause.firstElementChild.classList.replace('fa-pause', 'fa-play');
	}
}

function handleMute() {
	if (volumeIcon.firstElementChild.classList.contains('fa-volume-up')) {
		volumeIcon.firstElementChild.classList.replace('fa-volume-up', 'fa-volume-mute');
		volumeSlider.style.display = 'none';
		previousVolume = video.volume;
		video.volume = 0;
	} else {
		volumeIcon.firstElementChild.classList.replace('fa-volume-mute', 'fa-volume-up');
		volumeSlider.style.display = 'inline';
		video.volume = previousVolume;
	}
}

function handleTimeUpdate() {
	trackInfoRunning.innerText = format(video.currentTime);
	currentProgressPercentage = video.currentTime / video.duration * 100;
	progressBarTrack.style.width = currentProgressPercentage + '%';
}

function handleVolumeChange(e) {
	// const left = volumeSlider.getBoundingClientRect().left,
	// 	right = volumeSlider.getBoundingClientRect().right;
	let clickedPosition = Math.abs(e.offsetX);
	volumeSliderTrack.style.width = clickedPosition + '%';
	video.volume = clickedPosition / 100;
}

function handleProgressBar(e) {
	let clickedPosition = Math.abs(e.offsetX),
		progressBarWidth = progressBar.getBoundingClientRect().width,
		percentageProgress = clickedPosition / progressBarWidth * 100;
	progressBarTrack.style.width = percentageProgress + '%';
	video.currentTime = percentageProgress / 100 * video.duration;
	trackInfoRunning.innerText = format(video.currentTime);
}

function handleFullscreenToggle() {
	if (fullscreenToggle) {
		makeFullscreen(videoContainer);
	} else closeFullscreen();
	fullscreenToggle = !fullscreenToggle;
}

// EVENTS
playPause.addEventListener('click', handlePlayPause);
videoBackground.addEventListener('click', () => {
	playPause.click();
});
video.addEventListener('loadeddata', () => {
	trackInfoTotal.innerText = format(video.duration);
});
video.addEventListener('ended', () => {
	video.play();
});
video.addEventListener('timeupdate', handleTimeUpdate);
volumeIcon.addEventListener('click', handleMute);
volumeSlider.addEventListener('click', handleVolumeChange);
progressBar.addEventListener('click', handleProgressBar);
fullscreenIcon.addEventListener('click', handleFullscreenToggle);
