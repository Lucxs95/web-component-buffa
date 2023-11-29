import playList from '../assets/data.js';
import styles from './styles.js';
import './lecteurDirectory/lecteur.js';
import './playlistDirectory/playlist.js';
import './queueDirectory/queue.js';
import './mixTableDirectory/mixTable.js';
import './visualizerDirectory/visualizer.js';
import './tripDirectory/trip.js';

class MyAudioPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.selectedMusic = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isLooping = false;
        this._playList = playList;
        this._queue = [];
    }

    get playlist() {
        return this._playList;
    }
    get queue() {
        return this._queue;
    }

    connectedCallback() {
        this.render();
        const playlistComponent = this.shadowRoot.querySelector('playlist-component');
        const queueComponent = this.shadowRoot.querySelector('queue-component');
        const lecteurComponent = this.shadowRoot.querySelector('lecteur-component');
        if (playlistComponent) {
            playlistComponent.playlist = this._playList;
        }
        if (queueComponent) {
            queueComponent.queue = this._queue;
        }
        if (lecteurComponent) {
            lecteurComponent.queue = this._queue; // Pass the updated queue to the Lecteur component
        }
        this.updateLecteurQueue();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <script type="module" src="./lecteurDirectory/lecteur.js"></script>
            <script type="module" src="./playlistDirectory/playlist.js"></script>
            <script type="module" src="./queueDirectory/queue.js"></script>
            <script type="module" src="./mixTableDirectory/mixTable.js"></script>
            <script type="module" src="./visualizerDirectory/visualizer.js"></script>
            <style>${styles}</style>
             <div class="section">
                <trip-component class="section__background"></trip-component>


                <playlist-component></playlist-component>
                <lecteur-component></lecteur-component>
                <queue-component></queue-component>
                <mixtable-component class="mixTable-wrapper"></mixtable-component>
                <visualizer-component></visualizer-component>

            </div>
        `;
    }

    setupEventListeners() {
        this.shadowRoot.addEventListener('songEnded', (e) => {
            const { index } = e.detail;
            this.removeFromQueue(index);
        });
        this.shadowRoot.addEventListener('addSongToQueue', (e) => {
            const songIndex = e.detail.index;
            const songToAdd = this.playlist[songIndex];
            this.addToQueue(songToAdd);
        });
        this.shadowRoot.addEventListener('removeSongFromQueue', (e) => {
            this.removeFromQueue(e.detail.index);
        });
        this.shadowRoot.addEventListener('playSongAndAddRestToQueue', (e) => {
            const { startIndex } = e.detail;
            this.playSongAndAddRestToQueue(startIndex);
        });
    }

    playSongAndAddRestToQueue(startIndex) {
        this._queue = this._playList.slice(startIndex);
        this.updateQueueDisplay();
        this.updateLecteurQueue();

        const lecteurComponent = this.shadowRoot.querySelector('lecteur-component');
        if (lecteurComponent && this._queue.length > 0) {
            lecteurComponent.currentMusic = this._queue[0];
            lecteurComponent.playMusic();
        }
    }
    updateLecteurQueue() {
        const lecteurComponent = this.shadowRoot.querySelector('lecteur-component');
        if (lecteurComponent) {
            lecteurComponent.queue = this._queue;
            // If there is currently no music playing, set the first song in the queue as the current music.
            if (!this.isPlaying && this._queue.length > 0) {
                lecteurComponent.currentMusic = this._queue[0];
            }
        }
    }

    removeFromQueue(index) {
        // Remove the song from the queue
        if (index >= 0 && index < this._queue.length) {
            const songToRemove = this._queue[index];
            this._queue.splice(index, 1);
            this.updateQueueDisplay(); // Update the visual display of the queue

            // If the removed song was the current song, play the next one
            const lecteurComponent = this.shadowRoot.querySelector('lecteur-component');
            if (lecteurComponent && lecteurComponent.currentMusic === songToRemove) {
                lecteurComponent.currentMusic = this._queue[0] || null;
                if (lecteurComponent.currentMusic) {
                    lecteurComponent.playMusic();
                }
            }
        }
    }

    addToQueue(song) {
        const songExists = this._playList.find(s => s === song);
        if (songExists ) {
            this._queue.push(song);
            this.updateQueueDisplay();
        } else {
            console.error('Song does not exist in the playlist');
        }
    }
    updateQueueDisplay() {
        // Update the queue in the queue component
        const queueComponent = this.shadowRoot.querySelector('queue-component');
        if (queueComponent) {
            queueComponent.queue = this._queue;
        }
    }

}

customElements.define('my-audio-player', MyAudioPlayer);