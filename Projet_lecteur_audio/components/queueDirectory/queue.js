import stylesQueue from './stylesQueue.js';
class Queue extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }
    set queue(songs) {
        this._queue = songs;
        this.render();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    render() {
        const queueTabs = this._queue ? this.generateSongTabs(this._queue, 'fa-minus') : '';
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
                <button class="queue__song-add">
                    <i class="fas ${addIcon}"></i>
                </button>
            </div>
        `).join('');
    }

    setupEventListeners() {
        this.shadowRoot.addEventListener('click', (event) => {
            // Check if the fa-minus icon inside the queue__song-add button was clicked
            if (event.target.classList.contains('fa-minus')) {
                // Find the closest parent .queue__song div to get its data-song-index attribute
                const songElement = event.target.closest('.queue__song');
                const songIndex = parseInt(songElement.getAttribute('data-song-index'));

                // Dispatch a custom event with the index of the song to be removed
                this.dispatchEvent(new CustomEvent('removeSongFromQueue', {
                    detail: { index: songIndex },
                    bubbles: true,
                    composed: true // Ensures the event bubbles up through the shadow DOM boundary
                }));
            }
        });
    }

}

customElements.define('queue-component', Queue);