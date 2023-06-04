import { JSONObject } from 'trans-render/lib/types';

export async function getItemScopeObject(el: Element){
    if(!el.hasAttribute('itemscope')) throw {el, msg: 'itemscope missing.'};
    const derivedObject: JSONObject = {};
    //TODO:  use @scope selector
    let itempropElements = Array.from(el.querySelectorAll('[itemprop]'));
    itempropElements = itempropElements.filter(x => x.closest('[itemscope]') === el);
    const {getItemPropVal} = await import('./getItemPropVal.js');
    for(const itempropElement of itempropElements){
        derivedObject[itempropElement.getAttribute('itemprop')!] = await getItemPropVal(itempropElement);
    }
    return derivedObject;
}