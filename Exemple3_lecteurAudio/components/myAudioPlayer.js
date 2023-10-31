export class MyAudioPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML = `
    <style>
        :host {
            display: block;
            width: 100%;
            font-family: 'Arial', sans-serif;
        }
        .controls {
            display: flex;
            justify-content: center;
            gap: 10px;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.1);
        }
        .audio-progress-bar {
            width: 100%;
            height: 20px;
            background-color: #ccc;
            border-radius: 10px;
            margin: 15px 0;
        }
        .audio-progress-bar > div {
            height: 100%;
            width: 0;
            background-color: #FF0000; /* Couleur YouTube */
            border-radius: 10px;
            transition: width 0.2s;
        }
        button {
            padding: 10px 15px;
            border: none;
            background: none;
            cursor: pointer;
            outline: none;
            transition: background-color 0.2s;
        }
        button:hover {
            background-color: rgba(255, 0, 0, 0.1); /* Couleur YouTube légère pour le hover */
        }
        #playBtn:before, #pauseBtn:before, #volumeUp:before, #volumeDown:before, 
        #rewind:before, #forward:before, #previousBtn:before, #nextBtn:before {
            font-family: "Font Awesome 6 Pro";
            display: inline-block;
            font-style: normal;
            font-weight: 400;
        }

        #currentTrackName {
            display: block;
            text-align: center;
            padding: 10px;
            color: #555;
        }
    </style>
    <!-- ... le reste de votre HTML ... -->

      
      <audio id="player"></audio>
      <div class="controls">
        <button id="playBtn">Play</button>
        <button id="pauseBtn">Pause</button>
        <button id="volumeUp">Volume Up</button>
        <button id="volumeDown">Volume Down</button>
        <button id="rewind">Rewind 5s</button>
        <button id="forward">Forward 5s</button>
        <button id="previousBtn">Previous</button> 
        <button id="nextBtn">Next</button>  
      </div>
      <div class="audio-progress-bar">

        <div></div>
      </div>
            <span id="currentTime">00:00</span> / <span id="totalTime">00:00</span>

      <span id="currentTrackName"></span>
    <!-- Gain Control -->
    <label for="gainSlider">Gain</label>
    <input type="range" min="0" max="1" step="0.01" value="1" id="gainSlider" />
    
    <!-- Panner Control (Balance) -->
    <label for="pannerSlider">Balance</label>
    <input type="range" min="-1" max="1" step="0.1" value="0" id="pannerSlider" />

    <!-- Biquad Filter Control -->
    <label>Frequency</label>
    <input type="range" min="0" max="22050" step="1" value="350" id="biquadFilterFrequencySlider" />
    <label>Detune</label>
    <input type="range" min="0" max="100" step="1" value="0" id="biquadFilterDetuneSlider" />
    <label>Q</label>
    <input type="range" min="0.0001" max="1000" step="0.01" value="1" id="biquadFilterQSlider" />
    <label>Type</label>z
    <select id="biquadFilterTypeSelector">
        <option value="lowpass">LowPass</option>
        <option value="highpass">HighPass</option>
        <option value="bandpass">BandPass</option>
        <option value="lowshelf">LowShelf</option>
        <option value="highshelf">HighShelf</option>
        <option value="peaking">Peaking</option>
        <option value="notch">Notch</option>
        <option value="allpass">AllPass</option>
    </select>
    `;
    }

    connectedCallback() {
        this.setupAudioPlayer();
    }

    setupAudioPlayer() {
        const player = this.shadowRoot.querySelector('#player');
        const progressBar = this.shadowRoot.querySelector('.audio-progress-bar > div');
        const previousBtn = this.shadowRoot.querySelector('#previousBtn');
        const nextBtn = this.shadowRoot.querySelector('#nextBtn');

        const currentTrackName = this.shadowRoot.querySelector('#currentTrackName');
        const currentTimeElem = this.shadowRoot.querySelector('#currentTime');
        const totalTimeElem = this.shadowRoot.querySelector('#totalTime');


        player.addEventListener('loadedmetadata', () => {
            currentTrackName.textContent = player.currentSrc.split('/').pop(); // This extracts the file name from the URL
            totalTimeElem.textContent = formatTime(player.duration);  // Use totalTimeElem which is already defined using shadowRoot
        });

        if (this.hasAttribute('src')) {
            player.src = this.getAttribute('src');
        } else if (this.hasAttribute('playlist')) {
            const playlist = this.getAttribute('playlist').split(',');
            let currentIndex = 0;
            player.src = playlist[currentIndex];

            // Gérer le bouton "next"
            nextBtn.addEventListener('click', () => {
                if (playlist && currentIndex < playlist.length - 1) {
                    currentIndex++;
                    player.src = playlist[currentIndex];
                    player.play();
                }
            });

            // Gérer le bouton "previous"
            previousBtn.addEventListener('click', () => {
                if (playlist && currentIndex > 0) {
                    currentIndex--;
                    player.src = playlist[currentIndex];
                    player.play();
                }
            });

            player.addEventListener('ended', () => {
                currentIndex++;
                if (currentIndex < playlist.length) {
                    player.src = playlist[currentIndex];
                    player.play();
                } else if (this.hasAttribute('loop')) {
                    currentIndex = 0;
                    player.src = playlist[currentIndex];
                    player.play();
                }
            });
        }

        const audioContext = new AudioContext();
        const audioSrc = audioContext.createMediaElementSource(player);

        const gainNode = audioContext.createGain();
        const pannerNode = audioContext.createStereoPanner();
        const biquadFilter = audioContext.createBiquadFilter();

        audioSrc.connect(gainNode).connect(pannerNode).connect(biquadFilter).connect(audioContext.destination);


        const play = this.shadowRoot.querySelector('#playBtn');
        const pause = this.shadowRoot.querySelector('#pauseBtn');
        const volumeUp = this.shadowRoot.querySelector('#volumeUp');
        const volumeDown = this.shadowRoot.querySelector('#volumeDown');
        const rewind = this.shadowRoot.querySelector('#rewind');
        const forward = this.shadowRoot.querySelector('#forward');
        const gainSlider = this.shadowRoot.querySelector('#gainSlider');

        gainSlider.addEventListener('input', (e) => {
            gainNode.gain.value = e.target.value;
        });

        const pannerSlider = this.shadowRoot.querySelector('#pannerSlider');
        pannerSlider.addEventListener('input', (e) => {
            pannerNode.pan.value = e.target.value;
        });

        const frequencySlider = this.shadowRoot.querySelector('#biquadFilterFrequencySlider');
        const detuneSlider = this.shadowRoot.querySelector('#biquadFilterDetuneSlider');
        const qSlider = this.shadowRoot.querySelector('#biquadFilterQSlider');
        const typeSelector = this.shadowRoot.querySelector('#biquadFilterTypeSelector');

        frequencySlider.addEventListener('input', (e) => {
            biquadFilter.frequency.value = e.target.value;
        });

        detuneSlider.addEventListener('input', (e) => {
            biquadFilter.detune.value = e.target.value;
        });

        qSlider.addEventListener('input', (e) => {
            biquadFilter.Q.value = e.target.value;
        });

        typeSelector.addEventListener('change', (e) => {
            biquadFilter.type = e.target.value;
        });

        play.addEventListener('click', () => player.play());
        pause.addEventListener('click', () => player.pause());
        volumeUp.addEventListener('click', () => {
            if (player.volume < 1) player.volume += 0.1;
        });
        volumeDown.addEventListener('click', () => {
            if (player.volume > 0) player.volume -= 0.1;
        });
        rewind.addEventListener('click', () => player.currentTime -= 5);
        forward.addEventListener('click', () => player.currentTime += 5);

        player.addEventListener('timeupdate', () => {
            const percentage = (player.currentTime / player.duration) * 100;
            progressBar.style.width = percentage + '%';
            currentTimeElem.textContent = formatTime(player.currentTime);
        });
    }
}
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}


customElements.define('my-audio-player', MyAudioPlayer);
