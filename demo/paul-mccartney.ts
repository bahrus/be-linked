
class LindaMcCartney{
    #birthPlace = "Scarsdale, NewYork";
    get birthPlace(){
        return this.#birthPlace;
    }
    set birthPlace(newVal){
        this.#birthPlace = newVal;
    }
}

interface ISong {
    name: string
}

class Song {
    constructor(data: ISong){
        Object.assign(this, data);
    }
    #name: string | undefined;
    get name(){
        return this.#name;
    }
    set name(nv: string | undefined){
        this.#name = nv;
    }
    
}

class PaulMcCartney extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    #age = 80;
    get age(){
        return this.#age;
    }
    set age(v: number){
        this.#age = v;
    }
    connectedCallback(){
        const innerTemplate = this.querySelector('template');
        if(innerTemplate !== null){
            this.shadowRoot?.appendChild(innerTemplate.content.cloneNode(true));
        }
    }

    #spouse = new LindaMcCartney();
    get spouse(){
        return this.#spouse;
    }
    set spouse(newVal){
        this.#spouse = newVal;
    }
    
    #songs: Song[] = [
        new Song({name: 'Your mother should know'}),
        new Song({name: "Yesterday"})
    ]
    get songs(){
        return this.#songs;
    }
    set songs(newVal){
        this.#songs = newVal;
    }

}

customElements.define('paul-mccartney', PaulMcCartney);
