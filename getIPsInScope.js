export function getIPsInScope(el) {
    if (!el.hasAttribute('itemscope'))
        throw { el, msg: 'itemscope missing.' };
    //TODO: use @scope selector when available.
    //TODO:  follow itemref
    return Array.from(el.querySelectorAll('[itemprop]'))
        .filter(x => exclude(x, el))
        .map(x => ({
        el: x,
        names: x.getAttribute('itemprop').split(' '),
    }));
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
