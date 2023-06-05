import { JSONObject } from 'trans-render/lib/types';
import {getIPsInScope} from './getIPsInScope.js';
import {getItemPropVal} from './getItemPropVal.js';
export async function getItemScopeObject(el: Element){
    
    const derivedObject: JSONObject = {};
    //TODO:  use @scope selector
    const itempropElements = getIPsInScope(el);
    for(const itempropElement of itempropElements){
        const {el, names} = itempropElement;
        for(const name of names){
            derivedObject[name] = await getItemPropVal(el);
        }
        
    }
    return derivedObject;
}