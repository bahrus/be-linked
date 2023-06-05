export function getIPsInScope(el: Element){
    if(!el.hasAttribute('itemscope')) throw {el, msg: 'itemscope missing.'};
    //TODO: use @scope selector when available.
    //TODO:  follow itemref
    return Array.from(el.querySelectorAll('[itemprop]'))
        .filter(x => x.closest('[itemscope]') === el)
        .map(x => ({
            el: x,
            names: x.getAttribute('itemprop')!.split(' '),
        }));
}