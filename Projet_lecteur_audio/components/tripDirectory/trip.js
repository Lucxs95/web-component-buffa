import 'https://cdn.jsdelivr.net/npm/butterchurn@2.6.7/lib/butterchurn.min.js';
import 'https://cdn.jsdelivr.net/npm/butterchurn-presets@2.4.7/lib/butterchurnPresets.min.js';
class Trip extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        console.log("Trip constructed");

        // Initial state
        this.visualizer = null;
        this.presetIndex = 0;
    }

    connectedCallback() {
        this.render();
        document.addEventListener('audioSourceChanged', this.handleAudioSourceChange.bind(this));
        console.log("Trip connected");
    }

    handleAudioSourceChange(event) {
        const { audioSrc } = event.detail;

        // Create and configure the Butterchurn visualizer
        const options = {
            width: this.shadowRoot.host.clientWidth,
            height: 150, // Set the height as needed
            pixelRatio: window.devicePixelRatio || 1,
            textureRatio: 1
        };
        this.visualizer = butterchurn.default.createVisualizer(audioSrc.context, this.canvas, options);
        this.visualizer.connectAudio(audioSrc);

        // Load a preset
        const presets = butterchurnPresets.getPresets();
        const presetKeys = Object.keys(presets);
        this.presetIndex = Math.floor(Math.random() * presetKeys.length);
        this.visualizer.loadPreset(presets[presetKeys[this.presetIndex]], 0);

        // Start rendering
        this.startRendering();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
        #tripCanvas {
            position: fixed; /* Use fixed positioning relative to the viewport */
            top: 0;
            left: 0;
            width: 100vw; /* Full viewport width */
            height: 100vh; /* Full viewport height */
            z-index: 1; /* Above other content */
        }
    </style>
    <canvas id="tripCanvas"></canvas>
    `;

        this.canvas = this.shadowRoot.querySelector('#tripCanvas');
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = this.shadowRoot.host.clientWidth;
        this.canvas.height = 150; // Set the height as needed
    }

    startRendering() {
        const renderLoop = () => {
            if (this.visualizer) {
                this.visualizer.render();
            }
            requestAnimationFrame(renderLoop);
        };
        renderLoop();
    }

    setupEventListeners() {
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    disconnectedCallback() {
        document.removeEventListener('audioSourceChanged', this.handleAudioSourceChange.bind(this));
        window.removeEventListener('resize', this.resizeCanvas.bind(this));
    }
}

customElements.define('trip-component', Trip);
