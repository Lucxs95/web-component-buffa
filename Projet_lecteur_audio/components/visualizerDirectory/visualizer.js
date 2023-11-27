import stylesVisualizer from './stylesVisualizer.js';

class Visualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Log to check if constructor is called
        console.log("Visualizer constructed");
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();

        // Listen to the audioSourceChanged event
        document.addEventListener('audioSourceChanged', this.handleAudioSourceChange.bind(this));

        // Log to check if connectedCallback is executed
        console.log("Visualizer connected");
    }

    handleAudioSourceChange(event) {
        const { audioSrc } = event.detail;

        // Setup Analyser
        this.analyser = audioSrc.context.createAnalyser();
        this.analyser.fftSize = 2048; // You can adjust this value
        audioSrc.connect(this.analyser);

        // Create a buffer to receive the frequency data
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

        // Call visualize function
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
                opacity: 0.3; /* Adjust this value between 0 and 1 as needed */
            }
        </style>
        <canvas id="visualizerCanvas"></canvas>
    `;

        // Initialize the canvas and its drawing context
        this.canvas = this.shadowRoot.querySelector('#visualizerCanvas');
        this.canvasContext = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        // Adjust the width of the canvas to match the parent element's width
        this.canvas.width = this.shadowRoot.host.clientWidth;

        // You can keep the height fixed or adjust it based on your requirements
        // Example for a fixed height: this.canvas.height = 150;
        // Example for a dynamic height: this.canvas.height = this.shadowRoot.host.clientHeight * 0.2; // 20% of parent height
    }

    visualize() {
        if (!this.canvasContext) {
            return;
        }

        // Clear the canvas
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Get the frequency data
        this.analyser.getByteFrequencyData(this.frequencyData);

        // Draw the frequency data as bars
        let barWidth = (this.canvas.width / this.analyser.frequencyBinCount) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
            barHeight = this.frequencyData[i];

            this.canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
            this.canvasContext.fillRect(x, this.canvas.height - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        }

        // Call the visualize function repeatedly
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