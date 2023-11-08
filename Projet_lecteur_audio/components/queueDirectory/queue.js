import stylesQueue from './stylesQueue.js';
import playList from '../../assets/data.js';
class Queue extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.queue = playList; // Initialize the queue with the playlist data
    }
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    render() {
        const queueTabs = this.generateSongTabs(this.queue, 'fa-minus');
        this.shadowRoot.innerHTML = `
            <style>${stylesQueue}</style>
            <div class="queue-wrapper">
                <div class="queue__header">
                    <h3 class="queue__title">File d'attente</h3>
                </div>
                <div class="queue">
                    <div class="queue-content">${queueTabs}</div>
                </div>
            </div>
        `;

    }
    generateSongTabs(songs, addIcon) {
        return songs.map((song, index) => `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <style>${stylesQueue}</style>
            <div class="queue__song" data-song-index="${index}">
                <img class="queue__song-cover" src="${song.cover}" alt="${song.musicName} cover">
                <div class="queue__song-info">
                    <span class="queue__song-title">${song.musicName}</span>
                    <span class="queue__song-artist">${song.artist}</span>
                </div>
                <button class="queue__song-play">
                    <i class="fas fa-play"></i>
                </button>
                <button class="queue__song-add">
                    <i class="fas ${addIcon}"></i>
                </button>
            </div>
        `).join('');
    }

    setupEventListeners() {

    }

    updateQueueDisplay() {
        // Update the queue in the DOM
        const queueTabs = this.generateSongTabs(this.queue, 'fa-minus');
        const queueContent = this.shadowRoot.querySelector('.queue-content');
        queueContent.innerHTML = queueTabs;
    }
}

customElements.define('queue-component', Queue);