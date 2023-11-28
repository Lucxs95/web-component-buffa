import 'https://cdn.jsdelivr.net/npm/butterchurn@2.6.7/lib/butterchurn.min.js';
import 'https://cdn.jsdelivr.net/npm/butterchurn-presets@2.4.7/lib/butterchurnPresets.min.js';
class Trip extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        console.log("Trip constructed");
        this.presets = butterchurnPresets.getPresets(); // Load presets here
        this.visualizer = null;
        this.presetIndex = 0;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        document.addEventListener('audioSourceChanged', this.handleAudioSourceChange.bind(this));
        document.addEventListener('presetSelected', this.handlePresetSelected.bind(this));
        console.log("Trip connected");
    }

    handlePresetSelected(event) {
        const { presetKey } = event.detail;
        if (this.visualizer && presetKey) {
            this.visualizer.loadPreset(this.presets[presetKey], 0);
        }
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

        // Randomly select a preset
        this.presetIndex = Math.floor(Math.random() * presetKeys.length);
        const randomPresetKey = presetKeys[this.presetIndex];
        this.visualizer.loadPreset(presets[randomPresetKey], 0);

        // Dispatch an event to notify the Visualizer about the random selection
        this.dispatchEvent(new CustomEvent('presetSelected', {
            detail: { presetKey: randomPresetKey },
            bubbles: true,
            composed: true
        }));

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
