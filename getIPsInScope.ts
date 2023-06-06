import {IP} from './types';

export function getIPsInScope(el: Element) : IP[]{
    if(!el.hasAttribute('itemscope')) throw {el, msg: 'itemscope missing.'};
    //TODO: use @scope selector when available.
    //TODO:  follow itemref
    return Array.from(el.querySelectorAll('[itemprop]'))
        .filter(x => exclude(x, el))
        .map(x => ({
            el: x,
            names: x.getAttribute('itemprop')!.split(' '),
        }));
}

export function exclude(x: Element, el: Element){
    if(x.hasAttribute('itemscope')){
        const {parentElement} = x;
        if(parentElement === null) return false;
        return parentElement.closest('[itemscope]') === el;
    }else{
        return x.closest('[itemscope]') === el;
    }
}