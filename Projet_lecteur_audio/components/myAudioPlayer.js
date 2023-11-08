import playList from '../assets/data.js';
import styles from './styles.js';
import './lecteurDirectory/lecteur.js';
import './playlistDirectory/playlist.js';
import './queueDirectory/queue.js';
import './mixTableDirectory/mixTable.js';
import './visualizerDirectory/visualizer.js';

class MyAudioPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.selectedMusic = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isLooping = false;
        this.playList = playList;
        this.queue = playList; // Initialize the queue as empty
    }

    connectedCallback() {
        this.render();
        this.updateCurrentMusic(); // Add this line to call the update method after the component is rendered.
        this.setupEventListeners();
    }

    updateCurrentMusic() {
        const lecteurComponent = this.shadowRoot.querySelector('lecteur-component');
        const currentMusic = this.playList[this.selectedMusic];
        if (lecteurComponent && currentMusic) {
            lecteurComponent.currentMusic = currentMusic;
        }
    }


    render() {
        const currentMusic = this.playList[this.selectedMusic];

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <script type="module" src="lecteurDirectory/lecteur.js"></script>
            <script type="module" src="playlistDirectory/playlist.js"></script>
            <script type="module" src="queueDirectory/queue.js"></script>
            <script type="module" src="mixTableDirectory/mixTable.js"></script>
            <script type="module" src="visualizerDirectory/visualizer.js"></script>
            <style>${styles}</style>
             <div class="section">
                <div class="section__background">
                    <img id="backgroundImage" class="section__background-image" src="" alt="">
                </div>

                <playlist-component></playlist-component>
                <lecteur-component></lecteur-component>
                <queue-component></queue-component>
                <mixtable-component></mixtable-component>
                <visualizer-component></visualizer-component>

            </div>
        `;
    }

    setupEventListeners() {
        this.shadowRoot.addEventListener('click', (e) => {
            if (e.target.classList.contains('playlist__song-play')) {
                const songIndex = e.target.parentElement.getAttribute('data-song-index');
                this.selectedMusic = parseInt(songIndex);
                this.loadMusic(this.playList[this.selectedMusic]);
                this.playMusic();
            }
        });
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
            if (e.target.classList.contains('fa-minus')) {
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

}

customElements.define('my-audio-player', MyAudioPlayer);