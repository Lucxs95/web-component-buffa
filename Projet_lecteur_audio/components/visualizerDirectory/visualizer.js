import stylesVisualizer from './stylesVisualizer.js';
class Visualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    render() {
        this.shadowRoot.innerHTML = `
        <h3>Visualizer</h3>
        `;

    }
    setupEventListeners() {

    }

}
customElements.define('visualizer-component', Visualizer);