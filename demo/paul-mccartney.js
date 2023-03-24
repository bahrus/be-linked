"use strict";
class PaulMcCartney extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    #age = 80;
    get age() {
        return this.#age;
    }
    set age(v) {
        this.#age = v;
    }
    connectedCallback() {
        const innerTemplate = this.querySelector('template');
        if (innerTemplate !== null) {
            this.shadowRoot?.appendChild(innerTemplate.content.cloneNode(true));
        }
    }
}
customElements.define('paul-mccartney', PaulMcCartney);
