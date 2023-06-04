export async function getItemScopeObject(el) {
    if (!el.hasAttribute('itemscope'))
        throw { el, msg: 'itemscope missing.' };
    const derivedObject = {};
    //TODO:  use @scope selector
    let itempropElements = Array.from(el.querySelectorAll('[itemprop]'));
    itempropElements = itempropElements.filter(x => x.closest('[itemscope]') === el);
    const { getItemPropVal } = await import('./getItemPropVal.js');
    for (const itempropElement of itempropElements) {
        derivedObject[itempropElement.getAttribute('itemprop')] = await getItemPropVal(itempropElement);
    }
    return derivedObject;
}
