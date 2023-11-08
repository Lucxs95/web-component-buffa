import playList from './assets/modules/data.js';
import styles from './assets/modules/styles.js';

class MyAudioPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.selectedMusic = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isLooping = false;
        this.playList = playList;
        this.queue = []; // Initialize the queue as empty
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

        // Adding 'now playing' section
        const nowPlaying = this.queue.length > 0 ? this.generateNowPlaying(this.queue[0]) : '';


        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <style>${styles}</style>
             <div class="section">
            <div class="section__background">
                <img id="backgroundImage" class="section__background-image" src="" alt="">
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

        this.shadowRoot.addEventListener('click', (e) => {
            if (e.target.classList.contains('playlist__song-play')) {
                const songIndex = e.target.parentElement.getAttribute('data-song-index');
                this.selectedMusic = parseInt(songIndex);
                this.loadMusic(this.playList[this.selectedMusic]);
                this.playMusic();

                // Add the currently playing song to the beginning of the queue if it's not already there
                if (!this.queue.some(song => song === this.playList[this.selectedMusic])) {
                    this.queue.unshift(this.playList[this.selectedMusic]);
                }
                // Update the queue display
                this.updateQueueDisplay();
            }
        });

        this.shadowRoot.addEventListener('click', (e) => {
            // Check if the plus button in the playlist was clicked
            if (e.target.classList.contains('fa-plus')) {
                const songIndex = e.target.closest('.playlist__song').getAttribute('data-song-index');
                const songToAdd = this.playList[parseInt(songIndex)];
                // Add the song to the queue if it's not already there
                if (!this.queue.includes(songToAdd)) {
                    this.queue.push(songToAdd);
                    // If this is the first song in the queue, load and play it
                    if (this.queue.length === 1) {
                        this.loadMusic(songToAdd);
                        this.playMusic();
                    }
                    // Update the queue display
                    this.updateQueueDisplay();
                }
            }
        });

        this.shadowRoot.addEventListener('click', (e) => {
            // Check if the minus button in the queue was clicked
            if (e.target.closest('.queue__song-add')) {
                const songIndex = e.target.closest('.queue__song').getAttribute('data-song-index');
                this.queue.splice(parseInt(songIndex), 1);
                // Update the queue display
                this.updateQueueDisplay();
            }
        });

        this.shadowRoot.addEventListener('click', (e) => {
            // Check if the minus button in the queue was clicked
            if (e.target.classList.contains('fa-minus') ) {
                // Get the parent .playlist__song to find the index of the song
                const songElement = e.target.closest('.playlist__song');
                const songIndex = parseInt(songElement.getAttribute('data-song-index'));

                // Remove the song from the queue array
                this.queue.splice(songIndex, 1);

                // Update the queue display
                this.updateQueueDisplay();
            }
        });


    }
    updateVolume() {
        const music = this.shadowRoot.querySelector('audio');
        const volumeSlider = this.shadowRoot.querySelector('#volumeSlider');
        music.volume = volumeSlider.value;
    }

    toggleShuffle() {
        // Toggle the shuffle state
        this.isShuffled = !this.isShuffled;

        // Update the shuffle button appearance
        const shuffleButton = this.shadowRoot.querySelector('#shuffle');
        const shuffleIcon = shuffleButton.querySelector('i');
        shuffleButton.classList.toggle('active', this.isShuffled);
        shuffleIcon.classList.toggle('fa-random', this.isShuffled);
        shuffleIcon.classList.toggle('fa-undo', !this.isShuffled);

        // Only shuffle if there are more than one item in the queue to shuffle
        if (this.isShuffled && this.queue.length > 1) {
            // Keep the currently playing song intact and shuffle the rest of the queue
            let currentSong = this.queue.slice(0, 1); // Take the currently playing song out
            let songsToShuffle = this.queue.slice(1); // Extract the songs to shuffle

            this.shuffleArray(songsToShuffle); // Shuffle the remaining songs

            this.queue = [...currentSong, ...songsToShuffle]; // Combine the currently playing song with the shuffled songs
        }

        // Update the queue display
        this.updateQueueDisplay();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    updateQueueDisplay() {
        // Update the queue in the DOM
        const queueTabs = this.generateSongTabs(this.queue, 'fa-minus');
        const queueContent = this.shadowRoot.querySelector('.queue-content');
        queueContent.innerHTML = queueTabs;
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
        // Check if the song that just ended is the same as the first in the queue
        if (this.queue.length > 0 && this.queue[0] === this.playList[this.selectedMusic]) {
            this.queue.shift(); // Remove the first element from the queue
        }

        // If the queue is not empty, play the next song from the queue
        if (this.queue.length > 0) {
            // Set the next song in the queue as the selected music
            const nextSong = this.queue[0];
            this.selectedMusic = this.playList.findIndex(song => song === nextSong);
            // Load and play the next song
            this.loadMusic(nextSong);
            this.playMusic();
        } else if (this.isLooping) {
            // If loop is active and the queue is empty, play the current song again
            this.loadMusic(this.playList[this.selectedMusic]);
            this.playMusic();
        } else {
            // If the queue is empty and loop is not active, move to the next song in the playlist
            this.nextMusic();
        }

        // Always update the queue display after handling the end of a song
        this.updateQueueDisplay();
    }

    playMusic() {
        const music = this.shadowRoot.querySelector('audio');
        if (!music.src) {
            // If there is no source, it means no song is loaded yet.
            // You could load the first song from the queue if it's not empty.
            if (this.queue.length > 0) {
                this.loadMusic(this.queue[0]);
            } else {
                console.error("No music in the queue to play.");
                return; // Exit if there's nothing to play.
            }
        }

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
        if (this.queue.length > 0) {
            // Move to the next song in the queue
            this.queue.shift(); // Remove the current song from the queue
            if (this.queue.length > 0) {
                // Load and play the next song in the queue
                const nextSong = this.queue[0];
                this.selectedMusic = this.playList.findIndex(song => song === nextSong);
                this.loadMusic(nextSong);
                if (this.isPlaying) this.playMusic();
            } else {
                // If the queue becomes empty, just load the next song but don't play automatically
                this.selectedMusic = (this.selectedMusic + 1) % this.playList.length;
                this.loadMusic(this.playList[this.selectedMusic]);
            }
        } else if (this.isShuffled) {
            // Shuffle logic as before
            this.selectedMusic = Math.floor(Math.random() * this.playList.length);
            this.loadMusic(this.playList[this.selectedMusic]);
            if (this.isPlaying) this.playMusic();
        } else {
            // Normal next logic as before
            this.selectedMusic = (this.selectedMusic + 1) % this.playList.length;
            this.loadMusic(this.playList[this.selectedMusic]);
            if (this.isPlaying) this.playMusic();
        }

        // Update the queue display in either case
        this.updateQueueDisplay();
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