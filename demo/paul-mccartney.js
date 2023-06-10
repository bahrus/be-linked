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
class Song {
    constructor(data) {
        Object.assign(this, data);
    }
    #name;
    get name() {
        return this.#name;
    }
    set name(nv) {
        this.#name = nv;
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
    #songs = [
        new Song({ name: 'Your mother should know' }),
        new Song({ name: "Yesterday" })
    ];
}
customElements.define('paul-mccartney', PaulMcCartney);
