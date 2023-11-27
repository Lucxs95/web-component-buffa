import './libs/butterchurn/lib/butterchurn.js';
import './libs/butterchurn-presets/lib/butterchurnPresets.min.js';

class Visualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        console.log("Visualizer constructed");
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        document.addEventListener('audioSourceChanged', this.handleAudioSourceChange.bind(this));
        console.log("Visualizer connected");
    }

    handleAudioSourceChange(event) {
        const { audioSrc } = event.detail;
        this.analyser = audioSrc.context.createAnalyser();
        this.analyser.fftSize = 2048;
        audioSrc.connect(this.analyser);
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.visualize();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            #visualizerCanvas {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                height: 630px;
                z-index: -1;
                opacity: 0.3;
            }
        </style>
        <canvas id="visualizerCanvas"></canvas>
    `;

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
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    disconnectedCallback() {
        document.removeEventListener('audioSourceChanged', this.handleAudioSourceChange.bind(this));
        window.removeEventListener('resize', this.resizeCanvas.bind(this));
    }
}

customElements.define('visualizer-component', Visualizer);