import stylesLecteur from './stylesLecteur.js';

class Lecteur extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // State properties
        this.isPlaying = false;
        this.isShuffled = false;
        this.isLooping = false;
        this._queue = []; // Queue will be set by parent
    }

    connectedCallback() {
        console.log(this._queue);
        if (this._queue.length > 0) {
            this.currentMusic = this._queue[0]; // Initialize currentMusic with the first song in the queue
            this.render();
        }
    }
    get currentMusic() {
        return this._currentMusic;
    }
    set currentMusic(music) {
        this._currentMusic = music;
        this.render();
    }
    get queue() {
        return this._queue;
    }
    set queue(newQueue) {
        this._queue = newQueue;
        if (this._queue.length > 0) {
            this.currentMusic = this._queue[0]; // Set the current music to the first item of the new queue
        }
    }
    render() {
        // Render the UI with the current music data
        if (this.currentMusic) {
            this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                <style>${stylesLecteur}</style>
                <div class="music-card__wrapper">
                    <div class="music-card">
                        <div class="music-card__content">
                            <img class="music-image" src="${this.currentMusic.cover}" alt="${this.currentMusic.musicName}">
                            <div class="music-info">
                                <h2 class="music-name">${this.currentMusic.musicName}</h2>
                                <p class="music-artist">${this.currentMusic.artist}</p>
                            </div>
                            <audio src="${this.currentMusic.musicPath}"></audio>
                            <div class="music-progress">
                                <div id="progress-bar" class="music-progress-bar"></div>
                                <div class="music-progress__time">
                                    <span class="music-progress__time-item music-current-time">00:00</span>
                                    <span class="music-progress__time-item music-duration-time">00:00</span>
                                </div>
                            </div>
                            <div class="music-controls">
                                <button id="loop" class="music-controls-item">
                                    <i class="fas fa-redo music-controls-item--icon"></i>
                                </button>
                                <button id="prev" class="music-controls-item">
                                    <i class="fas fa-backward music-controls-item--icon"></i>
                                </button>
                                <button id="play" class="music-controls-item">
                                    <i class="fas fa-play music-controls-item--icon play-icon"></i>
                                </button>
                                <button id="next" class="music-controls-item">
                                    <i class="fas fa-forward music-controls-item--icon"></i>
                                </button>
                                <button id="shuffle" class="music-controls-item">
                                    <i class="fas fa-random music-controls-item--icon"></i>
                                </button>
                            </div>
                            <div class="volume-controls">
                                <i class="fas fa-volume-up volume-icon"></i>
                                <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="1">
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Setup event listeners after rendering new elements
            this.setupEventListeners();
        }
    }
    updateVolume() {
        const music = this.shadowRoot.querySelector('audio');
        const volumeSlider = this.shadowRoot.querySelector('#volumeSlider');
        music.volume = volumeSlider.value;
    }
    toggleShuffle() {
        const shuffleButton = this.shadowRoot.querySelector('#shuffle');
        const shuffleIcon = shuffleButton.querySelector('i');

        this.isShuffled = !this.isShuffled;

        // Toggle the 'active' class to visually indicate the shuffle status
        shuffleIcon.classList.toggle('active', this.isShuffled);

        if (this.isShuffled) {
            this.shuffleQueue();
        } else {
            // Potentially restore the original queue here
        }
    }
    shuffleQueue() {
        // Assuming the queue is managed here, otherwise this method should
        // be called where the queue is managed to reorder it.
        for (let i = this.queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }

        // After shuffling, we might want to reload the music with the first song in the shuffled queue
        if (this.queue.length > 0) {
            this.loadMusic(this.queue[0]);
        }
    }
    toggleLoop() {
        const loopButton = this.shadowRoot.querySelector('#loop');
        const loopIcon = loopButton.querySelector('i');

        this.isLooping = !this.isLooping;

        // Toggle the 'active' class to visually indicate the loop status
        loopIcon.classList.toggle('active', this.isLooping);

        // Set the audio element's loop property accordingly
        const audio = this.shadowRoot.querySelector('audio');
        audio.loop = this.isLooping; // This will cause the audio to loop the current track
    }
    playMusic() {
        const audio = this.shadowRoot.querySelector('audio');
        if (audio) {
            audio.play();
            this.isPlaying = true;
            this.updatePlayButtonIcon();
        }
    }
    pauseMusic() {
        const audio = this.shadowRoot.querySelector('audio');
        if (audio) {
            audio.pause();
            this.isPlaying = false;
            this.updatePlayButtonIcon();
        }
    }
    updatePlayButtonIcon() {
        const playIcon = this.shadowRoot.querySelector('.play-icon');
        if (playIcon) {
            if (this.isPlaying) {
                playIcon.classList.replace('fa-play', 'fa-pause');
            } else {
                playIcon.classList.replace('fa-pause', 'fa-play');
            }
        }
    }
    updateProgress() {
        const audio = this.shadowRoot.querySelector('audio');
        const progressBar = this.shadowRoot.querySelector('#progress-bar');
        const currentTimeDisplay = this.shadowRoot.querySelector('.music-current-time');
        const durationTimeDisplay = this.shadowRoot.querySelector('.music-duration-time');

        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;

            currentTimeDisplay.textContent = this.formatTime(audio.currentTime);
            durationTimeDisplay.textContent = this.formatTime(audio.duration);
        }
    }
    setMusicTime() {
        const audio = this.shadowRoot.querySelector('audio');
        const currentTimeDisplay = this.shadowRoot.querySelector('.music-current-time');
        const durationTimeDisplay = this.shadowRoot.querySelector('.music-duration-time');

        if (audio.currentTime && audio.duration) {
            currentTimeDisplay.textContent = this.formatTime(audio.currentTime);
            durationTimeDisplay.textContent = this.formatTime(audio.duration);
        }
    }
    setProgress(e) {
        const audio = this.shadowRoot.querySelector('audio');
        const progressZone = this.shadowRoot.querySelector('.music-progress');

        if (e.offsetX && progressZone.clientWidth && audio.duration) {
            const clickX = e.offsetX;
            const width = progressZone.clientWidth;
            const fraction = clickX / width;
            audio.currentTime = fraction * audio.duration;
        }
    }
    nextMusic() {
        const currentIndex = this.queue[0];
        // Assuming 'queue' and 'playList' are managed by MyAudioPlayer
        // This is an example and needs to be adapted based on how you manage the queue
        const nextIndex = (this.queue.indexOf(this.currentMusic) + 1) % this.queue.length;
        const nextSong = this.queue[nextIndex];
        this.loadMusic(nextSong);
        if (this.isPlaying) {
            this.playMusic();
        }
    }
    prevMusic() {
        // Similar to nextMusic, but going backwards
        const currentIndex = this.queue.indexOf(this.currentMusic);
        const prevIndex = (currentIndex - 1 + this.queue.length) % this.queue.length;
        const prevSong = this.queue[prevIndex];
        this.loadMusic(prevSong);
        if (this.isPlaying) {
            this.playMusic();
        }
    }
    loadMusic(musicInfo) {
        // Ensure 'musicInfo' contains the properties you're trying to access
        const music = this.shadowRoot.querySelector('audio');
        const musicImage = this.shadowRoot.querySelector('.music-image');
        const musicName = this.shadowRoot.querySelector('.music-name');
        const musicArtist = this.shadowRoot.querySelector('.music-artist');
        const backgroundImage = this.shadowRoot.querySelector('.section__background-image');

        if (music && musicImage && musicName && musicArtist && backgroundImage) {
            music.src = musicInfo.musicPath;
            music.load(); // Important to load the new source
            musicImage.src = musicInfo.cover;
            musicName.textContent = musicInfo.musicName;
            musicArtist.textContent = musicInfo.artist;
            backgroundImage.style.backgroundImage = `url('${musicInfo.cover}')`;

            // Optional: Reset UI elements for the new song
            this.isPlaying = false;
            this.updatePlayButtonIcon();
            this.updateProgress();
        }
    }
    formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    }
    setupEventListeners() {
        // Bind the context to this class for each event listener
        const playButton = this.shadowRoot.querySelector('#play');
        playButton.addEventListener('click', () => this.isPlaying ? this.pauseMusic() : this.playMusic());

        const nextButton = this.shadowRoot.querySelector('#next');
        nextButton.addEventListener('click', () => this.nextMusic());

        const prevButton = this.shadowRoot.querySelector('#prev');
        prevButton.addEventListener('click', () => this.prevMusic());

        const volumeSlider = this.shadowRoot.querySelector('#volumeSlider');
        volumeSlider.addEventListener('input', () => this.updateVolume());

        const shuffleButton = this.shadowRoot.querySelector('#shuffle');
        shuffleButton.addEventListener('click', () => this.toggleShuffle());

        const loopButton = this.shadowRoot.querySelector('#loop');
        loopButton.addEventListener('click', () => this.toggleLoop());

        // Additional event listeners for the audio element and progress bar
        const audio = this.shadowRoot.querySelector('audio');
        audio.addEventListener('timeupdate', () => this.updateProgress());

        const progressBarContainer = this.shadowRoot.querySelector('.music-progress');
        progressBarContainer.addEventListener('click', (e) => this.setProgress(e));

        const progressZone = this.shadowRoot.querySelector('.music-progress');
        progressZone.addEventListener('click', (e) => this.setProgress(e));
    }
}

customElements.define('lecteur-component', Lecteur);