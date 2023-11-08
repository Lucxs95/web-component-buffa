import stylesmixTable from './stylesmixTable.js';
class MixTable extends HTMLElement {
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
            <style>${stylesmixTable}</style>
            <div class="mixTable-wrapper">
                <div class="mixTable">
                    <div>
                        <h3>Mix Table</h3>
                    </div>
                </div>
            </div>
            
            `;

    }
    setupEventListeners() {

    }

}
customElements.define('mixtable-component', MixTable);