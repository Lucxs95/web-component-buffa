import stylesPlaylist from './stylesPlaylist.js';
class Playlist extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    set playlist(songs) {
        this._playlist = songs; // Use an internal property to hold the playlist data.
        this.render(); // Re-render the component to display the new playlist.
    }

    render() {
        const songTabs = this._playlist ? this.generateSongTabs(this._playlist, 'fa-plus') : '';

        this.shadowRoot.innerHTML = `
        <style>${stylesPlaylist}</style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        <div class="playlist-wrapper">
            <div>
                <h3 class="playlist__title">Playlist</h3>
            </div>
            <div class="playlist">
                <div class="playlist-content">${songTabs}</div>
            </div>
        </div>
    `;
    }
    generateSongTabs(songs, addIcon) {
        return songs.map((song, index) => `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        <style>${stylesPlaylist}</style>
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
    setupEventListeners() {
        this.shadowRoot.addEventListener('click', (e) => {
            const songAddButton = e.target.closest('.playlist__song-add');

            if (songAddButton) {
                const songIndex = songAddButton.parentElement.getAttribute('data-song-index');
                this.dispatchEvent(new CustomEvent('addSongToQueue', {
                    detail: { index: parseInt(songIndex, 10) },
                    bubbles: true,
                    composed: true
                }));
            }
        });
        this.shadowRoot.addEventListener('click', (e) => {
            const songPlayButton = e.target.closest('.playlist__song-play');

            if (songPlayButton) {
                const songIndex = parseInt(songPlayButton.parentElement.getAttribute('data-song-index'), 10);
                // Envoyer un événement avec l'index de la chanson et un indicateur pour ajouter toutes les chansons suivantes
                this.dispatchEvent(new CustomEvent('playSongAndAddRestToQueue', {
                    detail: { startIndex: songIndex },
                    bubbles: true,
                    composed: true
                }));
            }
        });
    }


}

customElements.define('playlist-component', Playlist);
