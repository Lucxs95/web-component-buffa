import stylesmixTable from './stylesmixTable.js';
import '../../libraries/webaudio-controls.js';


class MixTable extends HTMLElement {
    constructor() {
        super();
        this.balanceValue = 50;
        this.attachShadow({ mode: 'open' });
        this.createIds();
        this.filters = [];

    }



    connectedCallback() {
        this.render();
        this.getElements();

        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${stylesmixTable}</style>
            <div class="mixTable-wrapper">
            <div class="mixTable">
                <div>
                    <h3>Mix Table</h3>
                    <div class="knob-container">
  
                        <div>
                            <webaudio-knob id="freq_60" src="./assets/knobs/sliderDJ.png" min="-30" max="30" value="1" step="0.1" size="40"></webaudio-knob>
                            <p>60hz</p><label id="label_0" for="freq_60">0dB</label>
                        </div>
                        <div>
                            <webaudio-knob id="freq_170" src="./assets/knobs/sliderDJ.png" min="-30" max="30" value="1" step="0.1" size="40"></webaudio-knob>
                            <p>170hz</p><label id="label_1" for="freq_170">0dB</label>
                        </div>
                        <div>
                            <webaudio-knob id="freq_350" src="./assets/knobs/sliderDJ.png" min="-30" max="30" value="1" step="0.1" size="40"></webaudio-knob>
                            <p>350hz</p><label id="label_2" for="freq_350">0dB</label>
                        </div>
                        <div>
                            <webaudio-knob id="freq_1000" src="./assets/knobs/sliderDJ.png" min="-30" max="30" value="1" step="0.1" size="40"></webaudio-knob>
                            <p>1000hz</p><label id="label_3" for="freq_1000">0dB</label>
                        </div>
                        <div>
                            <webaudio-knob id="freq_3500" src="./assets/knobs/sliderDJ.png" min="-30" max="30" value="1" step="0.1" size="40"></webaudio-knob>
                            <p>3000hz</p><label id="label_4" for="freq_3500">0dB</label>
                        </div>
                        <div>
                            <webaudio-knob id="freq_10000" src="./assets/knobs/sliderDJ.png" min="-30" max="30" value="1" step="0.1" size="40"></webaudio-knob>
                            <p>10000hz</p><label id="label_5" for="freq_10000">0dB</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;


    }

    getInputNode() {
        return this.inputGainNode;
    }

    getOutputNode() {
        return this.outputGainNode;
    }

    SetAudioContext(audioContext, inputGainNode) {
        this.audioContext = audioContext;
        this.buildGraph(inputGainNode);
    }

    async buildGraph(inputGainNode) {

        this.outputGainNode = this.audioContext.createGain();

        // On va créer un graphe audio pour gérer 6 frequences (un equalizer);
        [60, 170, 350, 1000, 3500, 10000].forEach((freq, i) => {
            const eq = this.audioContext.createBiquadFilter();
            eq.frequency.value = freq;
            eq.type = "peaking";
            eq.gain.value = 0;
            this.filters.push(eq);
        });

        // On les connecte en série
        this.filters.forEach((filter, i) => {
            if (i < this.filters.length - 1) {
                filter.connect(this.filters[i + 1]);
            }
        });


        // On a donc un graphe de 6 filtres qui vont gérer 6 frequences

        // On crée le sous graphe pour la reverb
        // await this.createReverbAudioGraph();


        // Maintenant on connecte la sortie de l'equalizer (le dernier filtre)
        // a l'entrée de la reverb
        // this.filters[this.filters.length - 1].connect(this.reverbInputGainNode);

        //Je veux connecter mon inputGainNode à mon premier élement de filters
        inputGainNode.connect(this.filters[0]);
        
        this.filters[this.filters.length - 1].connect(this.outputGainNode);

        // On connecte le noeud de sortie de la reverb au noeud de sortie de la mixtable
        // this.reverbOutputGainNode.connect(this.outputGainNode);
    }



    async createReverbAudioGraph() {
        // On crée une noeud gain d'entrée de reverb
        this.reverbInputGainNode = this.audioContext.createGain();

        // Si on veut faire une reverb, on va créer un convolverNode
        this.convolverNode = this.audioContext.createConvolver();
        // On va charger un fichier audio qui contient une reverb avec fetch
        const reverbFile = await fetch('./assets/impulse-responses/plate.wav');
        const reverbBuffer = await reverbFile.arrayBuffer();
        // On va décoder le fichier audio
        const reverbAudioBuffer = await this.audioContext.decodeAudioData(reverbBuffer);
        // On va mettre le fichier audio dans le convolverNode
        this.convolverNode.buffer = reverbAudioBuffer;

        // On cree une route wet pour la reverb
        this.wetGainNode = this.audioContext.createGain();
        // On cree une route dry pour le son original
        this.dryGainNode = this.audioContext.createGain();
        // on connecte le convolverNode à la route wet
        this.convolverNode.connect(this.wetGainNode);
        // on connecte le convolverNode à la route dry
        this.convolverNode.connect(this.dryGainNode);
        // on connecte les deux routes à un noeud gain unique de sortie
        this.reverbOutputGainNode = this.audioContext.createGain();
        this.wetGainNode.connect(this.reverbOutputGainNode)

        // on connecte le noeud d'entrée de reverb à la route dry
        this.reverbInputGainNode.connect(this.dryGainNode);
        // On connecte le noeud d'entrée de reverb à la route wet
        this.reverbInputGainNode.connect(this.wetGainNode);

        // La reverb a un noeud d'entrée : this.reverbInputGainNode
        // et un noeud de sortie : this.reverbOutputGainNode

    }


    changeGain(nbFilter, sliderVal) {
        this.filters[nbFilter].gain.value = parseFloat(sliderVal);

        const output = this.shadowRoot.getElementById("label_" + nbFilter);
        output.innerHTML = parseFloat(sliderVal).toFixed(2) + " dB";
    }

    createIds() {
        console.log("create id")
        this.ids = {
            FREQ_60: 'freq_60',
            FREQ_170: 'freq_170',
            FREQ_350: 'freq_350',
            FREQ_1000: 'freq_1000',
            FREQ_3500: 'freq_3500',
            FREQ_10000: 'freq_10000',
        };
    }

    getElements() {
        this.freq_60 = this.shadowRoot.getElementById(this.ids.FREQ_60);
        this.freq_170 = this.shadowRoot.getElementById(this.ids.FREQ_170);
        this.freq_350 = this.shadowRoot.getElementById(this.ids.FREQ_350);
        this.freq_1000 = this.shadowRoot.getElementById(this.ids.FREQ_1000);
        this.freq_3500 = this.shadowRoot.getElementById(this.ids.FREQ_3500);
        this.freq_10000 = this.shadowRoot.getElementById(this.ids.FREQ_10000);
    }


    setupEventListeners() {

        const freq = this.shadowRoot.getElementById('freq_60');

        freq.addEventListener('input', ({ target: { value } }) => {
            this.changeGain(0, value);
        });
        this.freq_170.addEventListener('input', ({ target: { value } }) => {
            this.changeGain(1, value);
        });
        this.freq_350.addEventListener('input', ({ target: { value } }) => {
            this.changeGain(2, value);
        });
        this.freq_1000.addEventListener('input', ({ target: { value } }) => {
            this.changeGain(3, value);
        });
        this.freq_3500.addEventListener('input', ({ target: { value } }) => {
            this.changeGain(4, value);
        });
        this.freq_10000.addEventListener('input', ({ target: { value } }) => {
            this.changeGain(5, value);
        });



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


        });

    }




}

customElements.define('mixtable-component', MixTable);
