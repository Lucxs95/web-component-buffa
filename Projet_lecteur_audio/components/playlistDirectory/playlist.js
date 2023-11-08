import stylesPlaylist from './stylesPlaylist.js';
import playList from '../../assets/data.js';
class Playlist extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.playlist = playList; // Initialize the queue with the playlist data
    }
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    render() {
        const songTabs = this.generateSongTabs(this.playlist, 'fa-plus');
        this.shadowRoot.innerHTML = `
            <style>${stylesPlaylist}</style>
             <div class="playlist-wrapper">
                <div class="playlist__header">
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
            if (e.target.classList.contains('playlist__song-play')) {
                const songIndex = e.target.parentElement.getAttribute('data-song-index');
                this.dispatchEvent(new CustomEvent('selectSong', {
                    detail: { index: parseInt(songIndex) },
                    bubbles: true,
                    composed: true
                }));
            } else if (e.target.classList.contains('playlist__song-add')) {
                const songIndex = e.target.parentElement.getAttribute('data-song-index');
                this.dispatchEvent(new CustomEvent('addSongToQueue', {
                    detail: { index: parseInt(songIndex) },
                    bubbles: true,
                    composed: true
                }));
            }
        });
    }

}

customElements.define('playlist-component', Playlist);
