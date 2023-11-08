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
                    <div class="mixTable__header">
                        <h3 class="mixTable__title">Mix Table</h3>
                    </div>
                </div>
            </div>
            
            `;

    }
    setupEventListeners() {

    }

}
customElements.define('mixtable-component', MixTable);