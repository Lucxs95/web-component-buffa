import playList from './modules/data.js';
import styles from './modules/styles.js';

class MyAudioPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.selectedMusic = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isLooping = false;
        this.playList = playList;
        this.queue = playList;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    generateSongTabs(songs, addIcon) {
        return songs.map((song, index) => `
            <div class="playlist__song" data-song-index="${index}">
                <img class="playlist__song-cover" src="${song.cover}" alt="${song.musicName} cover">
                <div class="playlist__song-info">
                    <span class="playlist__song-title">${song.musicName}</span>
                    <span class="playlist__song-artist">${song.artist}</span>
                </div>
                <button class="playlist__song-play">
                    <i class="fas fa-play"></i>
                </button>
                <button class="playlist__song-add">
                    <i class="fas ${addIcon}"></i>
                </button>
            </div>
        `).join('');
    }

    render() {
        const currentMusic = this.playList[this.selectedMusic];
        const songTabs = this.generateSongTabs(this.playList, 'fa-plus');
        const queueTabs = this.generateSongTabs(this.queue, 'fa-minus');

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <style>${styles}</style>
            <div class="section">
                <div class="section__background">
                    <img id="backgroundImage" class="section__background-image" src="${currentMusic.cover}" alt="">
                </div>
                <div class="playlist-wrapper">
                    <div class="playlist__header">
                        <h3 class="playlist__title">Playlist</h3>
                    </div>
                    <div class="playlist">
                        <div class="playlist-content">${songTabs}</div>
                    </div>
                </div>
                <div class="music-card__wrapper">
                <div class="music-card">
                    <div class="music-card__content">
                        <img class="music-image" src="${currentMusic.cover}" alt="">
                        <div class="music-info">
                            <h2 class="music-name">${currentMusic.musicName}</h2>
                            <p class="music-artist">${currentMusic.artist}</p>
                        </div>
                        <audio src="${currentMusic.musicPath}"></audio>
                        <div class="music-progress">
                            <div id="progress-bar" class="music-progress-bar"></div>
                            <div class="music-progress__time">
                                <span class="music-progress__time-item music-current-time">00:00</span>
                                <span class="music-progress__time-item music-duration-time">00:00</span>
                            </div>
                        </div>
                        <div class="music-controls">
                            <div id="loop" class="music-controls-item">
                                <i class="fas fa-redo music-controls-item--icon"></i>
                            </div>
                            <div id="prev" class="music-controls-item">
                                <i class="fas fa-backward music-controls-item--icon"></i>
                            </div>

                            <div id="play" class="music-controls-item">
                                <i class="fas fa-play music-controls-item--icon play-icon"></i>
                                <div class="play-icon-background"></div>
                            </div>

                            <div id="next" class="music-controls-item">
                                <i class="fas fa-forward music-controls-item--icon"></i>
                            </div>
                            <div id="shuffle" class="music-controls-item">
                                <i class="fas fa-random music-controls-item--icon"></i>
                            </div>
                        </div>
                        <div class="volume-controls">
                            <i class="fas fa-volume-up volume-icon"></i>
                            <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="1" class>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="queue-wrapper">
                    <div class="queue__header">
                        <h3 class="queue__title">File d'attente</h3>
                    </div>
                    <div class="queue">
                        <div class="queue-content">${queueTabs}</div>
                    </div>
                </div>
                <div class="mixTable-wrapper">
                    <div class="mixTable">
                        <div class="mixTable__header">
                            <h3 class="mixTable__title">Mix Table</h3>
                        </div>
                    </div>
                </div>
                <div class="new-wrapper">
                    <video controls width="100%" autoplay loop muted>
                        <source src="" type="video/mp4">
                    </video>
                </div>
            </div>
        `;
    }

    setupEventListeners() {

        const play = this.shadowRoot.querySelector('#play');
        const next = this.shadowRoot.querySelector('#next');
        const prev = this.shadowRoot.querySelector('#prev');
        const music = this.shadowRoot.querySelector('audio');
        const progressZone = this.shadowRoot.querySelector('.music-progress');
        const shuffle = this.shadowRoot.querySelector('#shuffle');
        const loop = this.shadowRoot.querySelector('#loop');
        const volumeSlider = this.shadowRoot.querySelector('#volumeSlider');
        volumeSlider.addEventListener('input', this.updateVolume.bind(this));


        loop.addEventListener('click', this.toggleLoop.bind(this));

        shuffle.addEventListener('click', this.toggleShuffle.bind(this));

        play.addEventListener('click', () => {
            this.isPlaying ? this.pauseMusic() : this.playMusic();
        });

        this.shadowRoot.addEventListener('click', (e) => {
            if (e.target.classList.contains('playlist__song-play')) {
                const songIndex = e.target.parentElement.getAttribute('data-song-index');
                this.selectedMusic = parseInt(songIndex);
                this.loadMusic(this.playList[this.selectedMusic]);
                this.playMusic();
            }
        });

        next.addEventListener('click', this.nextMusic.bind(this));
        prev.addEventListener('click', this.prevMusic.bind(this));
        music.addEventListener('timeupdate', this.updateProgress.bind(this));
        music.addEventListener('timeupdate', this.setMusicTime.bind(this));
        music.addEventListener('ended', this.handleMusicEnd.bind(this));
        progressZone.addEventListener('click', this.setProgress.bind(this));

        // Load the default music
        this.loadMusic(this.playList[0]);
    }
    updateVolume() {
        const music = this.shadowRoot.querySelector('audio');
        const volumeSlider = this.shadowRoot.querySelector('#volumeSlider');
        music.volume = volumeSlider.value;
    }

    toggleShuffle() {
        const shuffleButton = this.shadowRoot.querySelector('#shuffle');
        const shuffleIcon = this.shadowRoot.querySelector('#shuffle > i');

        this.isShuffled = !this.isShuffled;

        // Toggle the 'active' class on both the button and the icon
        shuffleButton.classList.toggle('active', this.isShuffled);
        shuffleIcon.classList.toggle('active', this.isShuffled);
    }

    toggleLoop() {
        const loopButton = this.shadowRoot.querySelector('#loop');
        const loopIcon = this.shadowRoot.querySelector('#loop > i');

        this.isLooping = !this.isLooping;

        // Toggle the 'active' class on both the button and the icon to indicate its state
        loopButton.classList.toggle('active', this.isLooping);
        loopIcon.classList.toggle('active', this.isLooping);
    }

    handleMusicEnd() {
        if (this.isLooping) {
            // If redo is active, simply play the current song again
            this.playMusic();
        } else {
            // Otherwise, move to the next song in the playlist (or shuffle if that's active)
            this.nextMusic();
        }
    }

    playMusic() {
        const music = this.shadowRoot.querySelector('audio');
        const playIcon = this.shadowRoot.querySelector('.play-icon');
        const musicCard = this.shadowRoot.querySelector('.music-card');

        music.play();
        playIcon.classList.replace('fa-play', 'fa-pause');
        this.isPlaying = true;
        musicCard.classList.add('middle-weight');
        setTimeout(() => {
            musicCard.classList.remove('middle-weight');
        }, 200);
    }

    pauseMusic() {
        const music = this.shadowRoot.querySelector('audio');
        const playIcon = this.shadowRoot.querySelector('.play-icon');

        music.pause();
        playIcon.classList.replace('fa-pause', 'fa-play');
        this.isPlaying = false;
    }

    nextMusic() {
        if (this.isLooping) {
            // If looping (redo) is active, play the same song again
            this.loadMusic(this.playList[this.selectedMusic]);
            if (this.isPlaying) this.playMusic();
            return;
        }

        if (this.isShuffled) {
            this.selectedMusic = Math.floor(Math.random() * this.playList.length);
        } else {
            this.selectedMusic = (this.selectedMusic + 1) % this.playList.length;
        }
        this.loadMusic(this.playList[this.selectedMusic]);
        if (this.isPlaying) this.playMusic();
    }

    prevMusic() {
        if (this.isLooping) {
            // If looping (redo) is active, play the same song again
            this.loadMusic(this.playList[this.selectedMusic]);
            if (this.isPlaying) this.playMusic();
            return;
        }

        this.selectedMusic = (this.selectedMusic - 1 + this.playList.length) % this.playList.length;
        this.loadMusic(this.playList[this.selectedMusic]);
        if (this.isPlaying) this.playMusic();
    }

    updateProgress() {
        const music = this.shadowRoot.querySelector('audio');
        const progressBar = this.shadowRoot.querySelector('#progress-bar');

        const progressPercent = (music.currentTime / music.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }

    setMusicTime() {
        const music = this.shadowRoot.querySelector('audio');
        const currentTimeDisplay = this.shadowRoot.querySelector('.music-current-time');
        const durationTimeDisplay = this.shadowRoot.querySelector('.music-duration-time');

        currentTimeDisplay.textContent = this.formatTime(music.currentTime);
        durationTimeDisplay.textContent = this.formatTime(music.duration);
    }

    setProgress(e) {
        const music = this.shadowRoot.querySelector('audio');
        const progressZone = this.shadowRoot.querySelector('.music-progress');

        const clickX = e.offsetX;
        const width = progressZone.clientWidth;

        const fraction = clickX / width;
        music.currentTime = fraction * music.duration;
    }

    loadMusic(musicInfo) {
        const music = this.shadowRoot.querySelector('audio');
        const musicImage = this.shadowRoot.querySelector('.music-image');
        const musicName = this.shadowRoot.querySelector('.music-name');
        const musicArtist = this.shadowRoot.querySelector('.music-artist');
        const backgroundImage = this.shadowRoot.querySelector('#backgroundImage');
        const volumeSlider = this.shadowRoot.querySelector('#volumeSlider');

        music.src = musicInfo.musicPath;
        musicImage.src = musicInfo.cover;
        backgroundImage.src = musicInfo.cover;  // Update the background image
        musicName.textContent = musicInfo.musicName;
        musicArtist.textContent = musicInfo.artist;
        music.volume = volumeSlider.value;
    }

    formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
}

customElements.define('my-audio-player', MyAudioPlayer);