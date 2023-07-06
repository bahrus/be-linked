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
        this.computeProps();
    }
    #age = 80;
    get age() {
        return this.#age;
    }
    set age(v) {
        this.#age = v;
        this.computeProps();
    }
    computeProps() {
        this.props = {
            ariaLabel: 'test-' + this.age,
            title: 'test-' + this.age,
        };
    }
    connectedCallback() {
        const innerTemplate = this.querySelector('template');
        if (innerTemplate !== null) {
            this.shadowRoot?.appendChild(innerTemplate.content.cloneNode(true));
        }
    }
    #props = {};
    get props() {
        return this.#props;
    }
    set props(nv) {
        this.#props = nv;
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
    get songs() {
        return this.#songs;
    }
    set songs(newVal) {
        this.#songs = newVal;
    }
    #albums = [
        {
            name: 'Live and Let Live'
        },
        {
            name: 'Ram'
        }
    ];
    get albums() {
        return this.#albums;
    }
    set albums(newVal) {
        this.#albums = newVal;
    }
}
customElements.define('paul-mccartney', PaulMcCartney);
