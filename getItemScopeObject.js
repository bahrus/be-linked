import { getIPsInScope } from './getIPsInScope.js';
import { getItemPropVal } from './getItemPropVal.js';
export async function getItemScopeObject(el) {
    const derivedObject = {};
    //TODO:  use @scope selector
    const itempropElements = getIPsInScope(el);
    for (const itempropElement of itempropElements) {
        const { el, names } = itempropElement;
        for (const name of names) {
            derivedObject[name] = await getItemPropVal(el);
        }
    }
    return derivedObject;
}
