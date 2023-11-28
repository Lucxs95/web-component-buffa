class Visualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.presets = []; // Presets
        this.activePresetKey = null; // Track the active preset key
    }

    connectedCallback() {
        this.loadPresets();
        this.render();
        this.setupEventListeners();
        document.addEventListener('audioSourceChanged', this.handleAudioSourceChange.bind(this));
        console.log("Visualizer connected");
    }

    loadPresets() {
        this.presets = butterchurnPresets.getPresets(); // Load presets here
    }

    generatePresetList() {
        return Object.keys(this.presets).map((presetKey, index) => {
            const isActive = presetKey === this.activePresetKey;
            return `
            <div class="playlist__song${isActive ? ' active' : ''}" data-preset-index="${index}">
                <div class="playlist__song-info">
                    <span class="playlist__song-title">${presetKey}</span>
                </div>
            </div>
        `;
        }).join('');
    }


    handleAudioSourceChange(event) {
        const {audioSrc} = event.detail;
        this.analyser = audioSrc.context.createAnalyser();
        this.analyser.fftSize = 2048;
        audioSrc.connect(this.analyser);
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.visualize();
    }

    render() {
        const presetList = this.generatePresetList();

        this.shadowRoot.innerHTML = `
        <style>
            #visualizerCanvas {
                position: absolute;

                right: 0;
                bottom: 0;
                height: 150px;

            }
         .preset-list {
                overflow-y: auto; 
                height: 150px;  
                scrollbar-width: thin;
                scrollbar-color: rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0.1);
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
        .playlist__song-info {
            flex-grow: 1;
        }
        .playlist__song-title {
            display: block;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 5px;
        }
        .playlist__song.active {
        background-color: rgb(108,108,108); /* Or any other style to highlight */
    }
        </style>
        <canvas id="visualizerCanvas"></canvas>
        <div class="preset-list">${presetList}</div>    `;

        this.canvas = this.shadowRoot.querySelector('#visualizerCanvas');
        this.canvasContext = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = this.shadowRoot.host.clientWidth;
    }

    visualize() {
        if (!this.canvasContext) {
            return;
        }

        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.analyser.getByteFrequencyData(this.frequencyData);

        let barWidth = (this.canvas.width / this.analyser.frequencyBinCount) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
            barHeight = this.frequencyData[i];
            this.canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
            this.canvasContext.fillRect(x, this.canvas.height - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth + 1;
        }
        requestAnimationFrame(this.visualize.bind(this));
    }

    setupEventListeners() {
        this.shadowRoot.addEventListener('click', this.handlePresetClick.bind(this));
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    handlePresetClick(event) {
        const presetItem = event.target.closest('.playlist__song');
        if (presetItem) {
            const presetIndex = parseInt(presetItem.getAttribute('data-preset-index'), 10);
            this.activePresetKey = Object.keys(this.presets)[presetIndex]; // Update active preset key
            console.log(this.activePresetKey);
            this.dispatchEvent(new CustomEvent('presetSelected', {
                detail: { presetKey: this.activePresetKey },
                bubbles: true,
                composed: true
            }));
            this.render(); // Re-render to update the visual indication
        }
    }

    disconnectedCallback() {
        document.removeEventListener('audioSourceChanged', this.handleAudioSourceChange.bind(this));
        window.removeEventListener('resize', this.resizeCanvas.bind(this));
    }
}

customElements.define('visualizer-component', Visualizer);