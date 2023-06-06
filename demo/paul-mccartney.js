"use strict";
class LindaMcCartney {
    #birthPlace = "Scarsdale, NewYork";
    get birthPlace() {
        return this.#birthPlace;
    }
    set birthPlace(newVal) {
        this.#birthPlace = newVal;
    }
}
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
    #spouse = new LindaMcCartney();
    get spouse() {
        return this.#spouse;
    }
    set spouse(newVal) {
        this.#spouse = newVal;
    }
}
customElements.define('paul-mccartney', PaulMcCartney);
