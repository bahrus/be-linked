"use strict";
class PaulMcCartney extends HTMLElement {
    #age = 80;
    get age() {
        return this.#age;
    }
    set age(v) {
        this.#age = v;
    }
}
customElements.define('paul-mccartney', PaulMcCartney);
