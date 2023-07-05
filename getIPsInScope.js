export function getIPsInScope(el) {
    if (!el.hasAttribute('itemscope'))
        throw { el, msg: 'itemscope missing.' };
    //TODO: use @scope selector when available.
    //TODO:  follow itemref
    const nested = Array.from(el.querySelectorAll('[itemprop]'))
        .filter(x => exclude(x, el))
        .map(x => ({
        el: x,
        names: x.getAttribute('itemprop').split(' '),
    }));
    const itemref = el.getAttribute('itemref');
    if (itemref === null)
        return nested;
    const referenced = getRefs(el, itemref, '*')
        .map(x => ({
        el: x,
        names: x.getAttribute('itemprop').split(' '),
    }));
    return [...nested, ...referenced];
}
export function getRefs(el, itemref, query) {
    return Array.from(el.getRootNode()
        .querySelectorAll(itemref.split(' ').map(s => '#' + s.trim()).join(',')))
        .filter(x => x.matches(query));
}
export function exclude(x, el) {
    if (x.hasAttribute('itemscope')) {
        const { parentElement } = x;
        if (parentElement === null)
            return false;
        return parentElement.closest('[itemscope]') === el;
    }
    else {
        return x.closest('[itemscope]') === el;
    }
}
