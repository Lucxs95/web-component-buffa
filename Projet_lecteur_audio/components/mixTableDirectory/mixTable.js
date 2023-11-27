import stylesmixTable from './stylesmixTable.js';
import '../../libraries/webaudio-controls.js';


class MixTable extends HTMLElement {
    constructor() {
        super();
        this.balanceValue = 50;
        this.attachShadow({ mode: 'open' });

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
                        <div>
                        <webaudio-knob id="knob-2" src="./assets/knobs/BSW_Knob_2.png" min="0" max="100"></webaudio-knob>

                        <webaudio-slider min="0" max="100" value="50"></webaudio-slider>

                        
                        </div>
                    </div>
                </div>
            </div>
        `;


    }


    setupEventListeners() {

        const reverbButton = this.shadowRoot.querySelector('#knob-2');
        reverbButton.addEventListener('input', () => {
            // Récupérer la valeur de la reverb ici
            const reverbValue = reverbButton.value /* obtenir la valeur de la reverb */
            this.dispatchEvent(new CustomEvent('reverbChanged', {
                detail: { reverbValue },
                bubbles: true,
                composed: true
            }));
        });

        const sliderBalance = this.shadowRoot.querySelector('webaudio-slider');
        sliderBalance.addEventListener('input', () => {
            // Récupérer la valeur de la reverb ici
            const balanceValue = sliderBalance.value /* obtenir la valeur de la reverb */
            // this.dispatchEvent(new CustomEvent('balanceChanged', { 
            //     detail: { balanceValue },
            //     bubbles: true,
            //     composed: true
            // }));

            this.balanceValue = balanceValue;
            console.log(this.balanceValue);
            buildGraph();

        });

    }

    buildGraph() {

        // Création d'une instance AudioContext
        const audioContext = new AudioContext();

        // Création du nœud source (ici, un oscillator pour l'exemple)
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.value = 440; // Fréquence à 440 Hz pour l'exemple

        // Création du nœud de panner stéréo (balance)
        const stereoPannerNode = audioContext.createStereoPanner();

        // Connexion du nœud source au nœud de panner stéréo
        oscillator.connect(stereoPannerNode);

        // Connexion du nœud de panner stéréo à la destination de l'audio context
        stereoPannerNode.connect(audioContext.destination);

        // Utilisation de la propriété pan pour ajuster la balance (entre -1 pour gauche et 1 pour droite)
        stereoPannerNode.pan.value = 0; // 0 pour le centre, -1 complètement à gauche, 1 complètement à droite

        console.log(audioContext);
    }



}

customElements.define('mixtable-component', MixTable);
