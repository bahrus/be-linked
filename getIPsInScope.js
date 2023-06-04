export function getIPsInScope(el) {
    if (!el.hasAttribute('itemscope'))
        throw { el, msg: 'itemscope missing.' };
    //TODO: use @scope selector when available.
    //TODO:  follow itemref
    return Array.from(el.querySelectorAll('[itemprop]'))
        .filter(x => x.closest('[itemscope]') === el)
        .map(x => ({
        el: x,
        name: x.getAttribute('itemprop')
    }));
}
