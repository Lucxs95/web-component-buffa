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
        if (this._queue.length > 0) {
            this.currentMusic = this._queue[0]; // Initialize currentMusic with the first song in the queue
            this.render();
        }
        this.setupEventListeners();
    }

    getInputNode() {
        return this.inputGainNode;
    }

    getOutputNode() {
        return this.outputGainNode;
    }

    SetAudioContext(newContext) {
        this.audioContext = newContext;
        this.buildGraph();
    }

    buildGraph() {
        this.inputGainNode = this.audioContext.createGain();
        this.outputGainNode = this.audioContext.createGain();

        this.audioElement = new Audio();
        this.audioSrc = this.audioContext.createMediaElementSource(this.audioElement);

        // Connect nodes
        // on connecte inputGain au noeud du lecteur
        // this.inputGainNode.connect(this.audioSrc);

        this.audioSrc.connect(this.outputGainNode);

    }

    get currentMusic() {
        return this._currentMusic;
    }

    set currentMusic(music) {
        this._currentMusic = music;
        this.render();

               // Dispatch an event with the audio source
               this.dispatchEvent(new CustomEvent('audioSourceChanged', {
                detail: { audioSrc: this.audioSrc },
                bubbles: true, // To let the event bubble up through the DOM
                composed: true // To let the event cross the shadow DOM boundary
            }));
    
    }

    get queue() {
        return this._queue;
    }

    set queue(newQueue) {
        this._queue = newQueue;
        // If the current music is not in the new queue, play the first song of the new queue
        if (!this._queue.includes(this.currentMusic)) {
            this.currentMusic = this._queue[0] || null;
            if (this.currentMusic) {
                this.playMusic();
            }
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
        } else {
            // Render a different UI when there is no song
            this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                <style>${stylesLecteur}</style>
                <div class="music-card__wrapper">
                    <div class="music-card">
                        <div class="music-card__content">
                            <img class="music-image" src="https://static.vecteezy.com/system/resources/previews/021/736/279/non_2x/transparent-background-4k-empty-grid-checkered-layout-wallpaper-free-vector.jpg" >
                            <div class="music-info">
                                <h2 class="music-name">N/A</h2>
                                <p class="music-artist">N/A</p>
                            </div>
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
        }
        if (this.currentMusic) {
            this.audioElement.src = this.currentMusic.musicPath;
            this.audioElement.load();
        }


    }


    updateVolume() {
        const volumeSlider = this.shadowRoot.querySelector('#volumeSlider');
        this.outputGainNode.gain.value = volumeSlider.value;
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

        this.audioElement.loop = this.isLooping; // This will cause the audio to loop the current track
    }

    playMusic() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        this.audioElement.play()
            .then(() => {
                this.isPlaying = true;
                this.updatePlayButtonIcon();
            })
    }

    pauseMusic() {
        this.audioElement.pause();
        this.isPlaying = false;
        this.updatePlayButtonIcon();
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
        const progressBar = this.shadowRoot.querySelector('#progress-bar');
        const currentTimeDisplay = this.shadowRoot.querySelector('.music-current-time');
        const durationTimeDisplay = this.shadowRoot.querySelector('.music-duration-time');

        if (this.audioElement.duration) {
            const progressPercent = (this.audioElement.currentTime / this.audioElement.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;

            currentTimeDisplay.textContent = this.formatTime(this.audioElement.currentTime);
            durationTimeDisplay.textContent = this.formatTime(this.audioElement.duration);
        }
    }

    setMusicTime() {
        const currentTimeDisplay = this.shadowRoot.querySelector('.music-current-time');
        const durationTimeDisplay = this.shadowRoot.querySelector('.music-duration-time');

        if (this.audioElement.currentTime && this.audioElement.duration) {
            currentTimeDisplay.textContent = this.formatTime(this.audioElement.currentTime);
            durationTimeDisplay.textContent = this.formatTime(this.audioElement.duration);
        }
    }

    setProgress(e) {
        const progressZone = this.shadowRoot.querySelector('.music-progress');

        if (e.offsetX && progressZone.clientWidth && this.audioElement.duration) {
            const clickX = e.offsetX;
            const width = progressZone.clientWidth;
            const fraction = clickX / width;
            this.audioElement.currentTime = fraction * this.audioElement.duration;
        }
    }

    nextMusic() {
        const currentIndex = this._queue.findIndex(music => music === this._currentMusic);
        const nextIndex = (currentIndex + 1) % this._queue.length;
        const nextSong = this._queue[nextIndex];

        // Retirer la chanson actuelle de la file d'attente
        this._queue.splice(currentIndex, 1);

        // Mettre à jour la musique actuelle avec la chanson suivante
        this.currentMusic = nextSong;
        this.playMusic();

        // Émettre un événement pour notifier le changement de la file d'attente
        this.dispatchEvent(new CustomEvent('queueUpdated', {
            detail: { newQueue: this._queue },
            bubbles: true,
            composed: true
        }));
    }

    prevMusic() {
        const currentIndex = this._queue.findIndex(music => music === this._currentMusic);
        const prevIndex = (currentIndex - 1 + this._queue.length) % this._queue.length;
        const prevSong = this._queue[prevIndex];
        this.currentMusic = prevSong; // Update the current music with the previous song
        this.playMusic();
    }

    loadMusic(musicInfo) {
        // Ensure 'musicInfo' contains the properties you're trying to access
        const music = this.audioElement;
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
        if (this.currentMusic) {

            // Bind the context to this class for each event listener
            const playButton = this.shadowRoot.querySelector('#play');
            playButton.addEventListener('click', () => {
                if (this.isPlaying) {
                    this.pauseMusic();
                } else {
                    this.playMusic();
                }
            });

            const nextButton = this.shadowRoot.querySelector('#next');
            nextButton.addEventListener('click', () => this.nextMusic());

            const prevButton = this.shadowRoot.querySelector('#prev');
            prevButton.addEventListener('click', () => this.prevMusic());

            const volumeSlider = this.shadowRoot.querySelector('#volumeSlider');
            if (volumeSlider) {
                volumeSlider.addEventListener('input', () => this.updateVolume());
            }

            this.addEventListener('updateReverb', (e) => {
                const { reverbValue } = e.detail;
                // Mettre à jour la reverb de l'audio avec la valeur donnée
                console.log("dans le lecteur valeur : " + reverbValue)
                //this.updateReverb(reverbValue);
            });


            const shuffleButton = this.shadowRoot.querySelector('#shuffle');
            shuffleButton.addEventListener('click', () => this.toggleShuffle());

            const loopButton = this.shadowRoot.querySelector('#loop');
            loopButton.addEventListener('click', () => this.toggleLoop());


            // Additional event listeners for the audio element and progress bar
            this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
            this.audioElement.addEventListener('ended', () => {
                this.removeCurrentSongFromQueue();
                this.nextMusic();
            });

            const progressBarContainer = this.shadowRoot.querySelector('.music-progress');
            progressBarContainer.addEventListener('click', (e) => this.setProgress(e));

            const progressZone = this.shadowRoot.querySelector('.music-progress');
            progressZone.addEventListener('click', (e) => this.setProgress(e));
        }
    }

    removeCurrentSongFromQueue() {
        const currentSongIndex = this._queue.findIndex(song => song === this._currentMusic);
        if (currentSongIndex !== -1) {
            // Remove the current song from the queue
            this._queue.splice(currentSongIndex, 1);

            // Inform the parent component to update its queue as well
            this.dispatchEvent(new CustomEvent('songEnded', { detail: { index: currentSongIndex } }));
        }
    }
}

customElements.define('lecteur-component', Lecteur);