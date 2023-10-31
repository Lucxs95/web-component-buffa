class MyAudioPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.selectedMusic = 0;  // Starting from index 0
        this.isPlaying = false; // Add this line
        this.isShuffled = false;  // Default is not shuffled
        this.isLooping = false;  // Default is not looping

        this.playList = [{
            artist: 'Post Malone',
            cover: 'https://yildirimzlm.s3.us-east-2.amazonaws.com/post-malone-2.jpeg',
            musicName: 'Rockstar ft. 21 Savage',
            musicPath: `https://yildirimzlm.s3.us-east-2.amazonaws.com/Post+Malone+-+rockstar+ft.+21+Savage+(Official+Audio).mp3`
        }, {
            artist: 'Unlike Pluto',
            cover: 'https://yildirimzlm.s3.us-east-2.amazonaws.com/unlike-pluto.jpeg',
            musicName: 'No Scrubs ft. Joanna Jones',
            musicPath: `https://yildirimzlm.s3.us-east-2.amazonaws.com/Unlike+Pluto+-+No+Scrubs+ft.+Joanna+Jones+(Cover).mp3`
        }, {
            artist: 'Post Malone',
            cover: 'https://yildirimzlm.s3.us-east-2.amazonaws.com/circles.jpeg',
            musicName: 'Circles',
            musicPath: `https://yildirimzlm.s3.us-east-2.amazonaws.com/Post+Malone+-+Circles+(Lyrics).mp3`
        }, {
            artist: 'Lil Nas X',
            cover: 'https://yildirimzlm.s3.us-east-2.amazonaws.com/montero.jpeg',
            musicName: 'MONTERO (Call Me By Your Name)',
            musicPath: `https://yildirimzlm.s3.us-east-2.amazonaws.com/Lil+Nas+X+-+MONTERO+(Call+Me+By+Your+Name)+(Lyrics).mp3`
        }, {
            artist: 'Post Malone',
            cover: 'https://yildirimzlm.s3.us-east-2.amazonaws.com/post-malone-1.jpeg',
            musicName: 'Better Now',
            musicPath: `https://yildirimzlm.s3.us-east-2.amazonaws.com/Post+Malone+-+Better+Now.mp3`
        }, {
            artist: 'Unlike Pluto',
            cover: 'https://yildirimzlm.s3.us-east-2.amazonaws.com/unlike-pluto.jpeg',
            musicName: 'No Scrubs ft. Joanna Jones',
            musicPath: `https://yildirimzlm.s3.us-east-2.amazonaws.com/Unlike+Pluto+-+No+Scrubs+ft.+Joanna+Jones+(Cover).mp3`
        }, {
            artist: 'Post Malone',
            cover: 'https://yildirimzlm.s3.us-east-2.amazonaws.com/circles.jpeg',
            musicName: 'Circles',
            musicPath: `https://yildirimzlm.s3.us-east-2.amazonaws.com/Post+Malone+-+Circles+(Lyrics).mp3`
        }, {
            artist: 'Unlike Pluto',
            cover: 'https://yildirimzlm.s3.us-east-2.amazonaws.com/unlike-pluto.jpeg',
            musicName: 'No Scrubs ft. Joanna Jones',
            musicPath: `https://yildirimzlm.s3.us-east-2.amazonaws.com/Unlike+Pluto+-+No+Scrubs+ft.+Joanna+Jones+(Cover).mp3`
        }, {
            artist: 'Post Malone',
            cover: 'https://yildirimzlm.s3.us-east-2.amazonaws.com/circles.jpeg',
            musicName: 'Circles',
            musicPath: `https://yildirimzlm.s3.us-east-2.amazonaws.com/Post+Malone+-+Circles+(Lyrics).mp3`
        }, {
            artist: 'Unlike Pluto',
            cover: 'https://yildirimzlm.s3.us-east-2.amazonaws.com/unlike-pluto.jpeg',
            musicName: 'No Scrubs ft. Joanna Jones',
            musicPath: `https://yildirimzlm.s3.us-east-2.amazonaws.com/Unlike+Pluto+-+No+Scrubs+ft.+Joanna+Jones+(Cover).mp3`
        }, {
            artist: 'Post Malone',
            cover: 'https://yildirimzlm.s3.us-east-2.amazonaws.com/circles.jpeg',
            musicName: 'Circles',
            musicPath: `https://yildirimzlm.s3.us-east-2.amazonaws.com/Post+Malone+-+Circles+(Lyrics).mp3`
        }, {
            artist: 'Unlike Pluto',
            cover: 'https://yildirimzlm.s3.us-east-2.amazonaws.com/unlike-pluto.jpeg',
            musicName: 'No Scrubs ft. Joanna Jones',
            musicPath: `https://yildirimzlm.s3.us-east-2.amazonaws.com/Unlike+Pluto+-+No+Scrubs+ft.+Joanna+Jones+(Cover).mp3`
        }, {
            artist: 'Post Malone',
            cover: 'https://yildirimzlm.s3.us-east-2.amazonaws.com/circles.jpeg',
            musicName: 'Circles',
            musicPath: `https://yildirimzlm.s3.us-east-2.amazonaws.com/Post+Malone+-+Circles+(Lyrics).mp3`
        },]
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const currentMusic = this.playList[this.selectedMusic];
        // Create song tabs for playlist
        let songTabs = '';
        this.playList.forEach((song, index) => {
            songTabs += `
            <div class="playlist__song" data-song-index="${index}">
                <img class="playlist__song-cover" src="${song.cover}" alt="${song.musicName} cover">
                <div class="playlist__song-info">
                    <span class="playlist__song-title">${song.musicName}</span>
                    <span class="playlist__song-artist">${song.artist}</span>
                </div>
                    <button class="playlist__song-play">
                        <i class="fas fa-play"></i> <!-- Font Awesome play icon -->
                    </button>
                    <button class="playlist__song-add">
                        <i class="fas fa-plus"></i> <!-- Font Awesome add icon (you can choose another if you prefer) -->
                    </button>
            </div>
        `;
        });
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        <style>
        * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Georama', sans-serif;
}

body {
    background-color: rgb(31, 31, 31);
    overflow: hidden;
}

.section {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;  /* 3 columns */
    grid-template-rows: 1fr 1fr;         /* 2 rows */
    gap: 20px;                           /* Gap between grid items */
    padding: 10px;                       /* Some padding around */
}

.section__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.section__background:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    background-color: rgba(31, 31, 31, .8);
    height: 100vh;
    backdrop-filter: blur(20px);
    z-index: 11;
}
}

.section__background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.music-card {
    position: relative;
    max-width: 400px;    /* Increase the maximum width */
    width: 100%;
    height: 450px;      /* Reduce the height to make it more rectangular */
    border-radius: 25px;
    transform-style: preserve-3d;
    transition: all .2s linear;
    z-index: 2;
}

.music-card.right-weight {
    transform: rotateY(4deg) rotateX(-5deg);
}

.music-card.middle-weight {
    transform: rotateY(0) rotateX(-5deg);
}

.music-card.left-weight {
    transform: rotateY(-4deg) rotateX(-5deg);
}


.music-card__content {
    padding-bottom: 20px;
}

.music-card:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .2);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    z-index: -1;
}

.music-image {
    position: relative;
    width: 400px;       /* Adjust width to fit inside the new card size */
    height: 260px;      /* Adjust height to fit inside the new card size */
    padding: 10px;
    border-radius: 20px;
    object-fit: cover;
    filter: drop-shadow(-20px 10px 10px rgba(0, 0, 0, 0.25));
}

.music-image.animate {
    animation-name: coverAnimate;
    animation-duration: .3s;
    animation-iteration-count: 1;
    animation-direction: alternate;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
}

.music-info {
    padding-inline: 20px;
}

.music-name {
    font-size: 1.4em;
    color: rgba(255, 255, 255, .8);
    margin-bottom: 4px;
    line-height: 1;
}

.music-artist {
    font-size: 1em;
    color: rgba(255, 255, 255, .5);
}

.music-controls {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0px;
    margin-inline: auto;
    width: 270px;
}

.music-controls-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    padding: 6px;
    border-radius: 50%;
    cursor: pointer;
    transition: ease-in-out .2s;
}

.play-icon-background {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #a5a5a5;
    z-index: -1;
    opacity: 0;
    pointer-events: none;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, .25));
    transition: all .2s;
}

.music-controls-item#play .play-icon {
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, .3));
    transition: all .2s;
}

.music-controls-item#play:hover .play-icon-background {
    animation-name: playIconBackgroundAnimate;
    animation-duration: .3s;
    animation-iteration-count: 1;
    opacity: 1;
}

.music-controls-item#play:hover .play-icon {
    animation-name: playIconAnimate;
    animation-duration: .3s;
    animation-iteration-count: 1;
}

.music-controls-item:hover:not(#play) {
    background: #a5a5a5;
}

.music-controls-item--icon {
    font-size: 1.2em;
    color: #fff;
}

.music-progress {
    position: relative;
    width: calc(100% - 40px);
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 20px;
    cursor: pointer;
}

.music-progress-bar {
    position: relative;
    width: 0;
    height: 5px;
    border-radius: 5px;
    background-color: #fff;
}

.music-progress-bar:after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: rgba(255, 255, 255, 1);
    filter: drop-shadow(0px 0px 4px rgba(46, 45, 45, 1));
    border-radius: 50%;
    box-sizing: border-box;
}

.music-progress:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 5px;
    background: rgba(255, 255, 255, .3);
    border-radius: 5px;
    z-index: -1;
}

.music-progress__time {
    position: absolute;
    top: 12px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.music-progress__time-item {
    color: #fff;
    font-size: 12px;
    opacity: .4;
}

@keyframes coverAnimate {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(0.98);
    }
    100% {
        transform: scale(1);
    }
}

@-webkit-keyframes coverAnimate {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(0.98);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes playIconAnimate {
    0% {
        transform: scale(1);
    }
    20% {
        transform: scale(1);
    }
    85% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes playIconBackgroundAnimate {
    0% {
        opacity: 1;
        transform: scale(0.7);
        filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, .1));
    }
    65% {
        transform: scale(1.1);
        filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, .25));
    }
    85% {
        transform: scale(1);
        filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, .18));
        opacity: 1;
    }
    100% {
        transform: scale(1);
        filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, .18));
        opacity: 1;
    }
}

@media screen and (max-width: 480px) {
    .music-image {
        width: 100%;
        max-width: calc(100% - 40px);
        margin: 20px;
        left: unset;
        top: unset;
        height: 360px;
        border-radius: 12px;
        filter: drop-shadow(0px 10px 10px rgba(0, 0, 0, 0.20));
    }
    .music-card {
        width: 100%;
        max-width: calc(100% - 20px);
        margin-inline: auto;
    }
}

.music-controls-item:hover,
.music-controls-item.active {
    background-color: rgba(0, 0, 0, 0.1); /* Example shade */
    cursor: pointer;
}

.music-controls-item--icon.active {
    color: #007BFF; /* Example blue color */
}

.volume-controls {
    position: relative;
    display: flex;
    align-items: center;
    width: calc(100% - 40px);
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 20px;
    cursor: pointer;
}

.volume-icon {
    margin-right: 10px;
    color: #fff;
}

#volumeSlider {
    position: relative;
    width: calc(100% - 30px);
    height: 5px;
    margin: 0;  /* Reset the margin */
    padding: 0;  /* Reset the padding */
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    vertical-align: middle; /* Center the thumb vertically */
}

#volumeSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -5px;  /* Adjust margin to center the thumb on the track */
}

#volumeSlider::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
}

#volumeSlider::-moz-range-track {
    background: transparent;
    border: none;
}

#volumeSlider::-webkit-slider-runnable-track {
    height: 5px;
    border-radius: 5px;
    background-color: #fff;
}

#volumeSlider::-moz-range-progress {
    background-color: #fff;
    height: 5px;
    border-radius: 5px;
}

#volumeSlider::-moz-range-track {
    background-color: transparent;
    height: 5px;
}

.playlist-wrapper {
    grid-column: 1 / 2;  /* Position in the first column */
    grid-row: 1 / 2;    /* Position in the first row */
    display: flex;
    flex-direction: column; /* This makes the content flow vertically */
    justify-content: flex-start; /* Align the content to the top */
    align-items: center;
    height: 100%;  /* ensure it takes full height of its grid cell */
    margin: auto;   
}

.music-card__wrapper {
    grid-column: 2 / 3;  /* Position in the second column */
    grid-row: 1 / 2;    /* Position in the first row */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;  /* ensure it takes full height of its grid cell */
}
.queue-wrapper {
    grid-column: 3 / 4;  /* Position in the third column */
    grid-row: 1 / 2;    /* Position in the first row */
    display: flex;
    flex-direction: column; /* This makes the content flow vertically */
    justify-content: flex-start; /* Align the content to the top */
    align-items: center;
    height: 100%;  /* ensure it takes full height of its grid cell */
    margin: auto;
}
.mixTable-wrapper {
    grid-column: 2 / 3;  /* Position in the second column */
    grid-row: 2 / 2;    /* Position in the second row */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;  /* ensure it takes full height of its grid cell */
}
.new-wrapper {
    grid-column: 3 / 4;  /* Position in the third column */
    grid-row: 2 / 3;    /* Position in the second row */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;  /* ensure it takes full height of its grid cell */
}
.playlist__song {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    background-color: rgba(31, 31, 31, 0.7);
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.playlist__song:hover {
    background-color: rgba(31, 31, 31, 0.9);
}

.playlist__song-cover {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 10px;
    margin-right: 15px;
}

.playlist__song-info {
    flex-grow: 1;
}

.playlist__song-title {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 5px;
}

.playlist__song-artist {
    color: rgba(255, 255, 255, 0.5);
}

.playlist__song-play,.playlist__song-add {
    padding: 5px 10px;
    border: none;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.playlist__song-play:hover,.playlist__song-add:hover {
    background-color: rgba(255, 255, 255, 0.2);
}
.playlist__header, .queue__header {
    position: sticky;
    top: 0;
    z-index: 10; /* ensure it stays on top */
    padding: 10px 0; /* some padding for aesthetics */
    text-align: center; /* center the title */
}

/* Styling the scrollbar for WebKit browsers */
.playlist::-webkit-scrollbar, .queue::-webkit-scrollbar{
    width: 10px; /* width of the scrollbar */
}

.playlist::-webkit-scrollbar-track, .queue::-webkit-scrollbar-track {
    background-color: rgba(255, 255, 255, 0.1); /* background color of the scrollbar track */
    border-radius: 5px; /* rounded corners */
}

.playlist::-webkit-scrollbar-thumb, .queue::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.4); /* color of the draggable scrolling handle */
    border-radius: 5px; /* rounded corners */
}

.playlist {
    max-height: 100vh;  /* Set a maximum height */
    direction: rtl;
    overflow-y: auto;  /* Set overflow to auto for vertical scrolling */
    width: 100%;       /* Ensure it takes full width */
    padding: 0px;     /* Some padding for aesthetics */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0.1);
}

.queue {
    max-height: 100vh;  /* Set a maximum height */
    
    overflow-y: auto;  /* Set overflow to auto for vertical scrolling */
    width: 100%;       /* Ensure it takes full width */
    padding: 0px;     /* Some padding for aesthetics */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0.1);
}


.playlist-content, .queue-content {
    direction: ltr; /* revert the direction */
    width: 98%; /* slightly less than 100% to fit within the extra space in .playlist */
    float: right; /* push the content to the right side */
    max-height: 400px; /* for example, limit the height to 400px */
}


.playlist__title , .queue__title {
    font-size: 24px;  /* Setting a font size */
    font-weight: bold; /* Making the text bold */
    color: #ffffff;  /* Setting a text color */
    margin-bottom: 20px;  /* Giving some space below the title */
    text-align: center;  /* Center aligning the text */
    text-transform: uppercase; /* Making the text uppercase */
}

        </style>         
        <div class="section">
            <div class="section__background">
                <img id="backgroundImage" class="section__background-image" src="${currentMusic.cover}" alt="">
            </div>
            
            <div class="playlist-wrapper">
                    <div class="playlist__header">
                        <h3 class="playlist__title">Playlist</h3>
                    </div>
                <div class="playlist">

                <div class="playlist-content">
                    ${songTabs}  <!-- Inject the song tabs here -->
                </div>                </div>
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
                    <div class="queue-content">
                        ${songTabs}  <!-- Inject the song tabs here -->
                    </div>                
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