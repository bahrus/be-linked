const cache = new WeakMap();
export async function share(ibe, link) {
    const { enhancement, share, upstreamCamelQry, upstreamPropName } = link;
    const { enhancedElement } = ibe;
    const { findRealm } = await import('trans-render/lib/findRealm.js');
    let observeObj = await findRealm(enhancedElement, upstreamCamelQry);
    if (!(observeObj instanceof Element))
        throw 404;
    const affect = observeObj;
    if (enhancement !== undefined) {
        const { applyEnh } = await import('./applyEnh.js');
        observeObj = await applyEnh(observeObj, enhancement, true);
    }
    if (upstreamPropName !== undefined) {
        observeObj = observeObj[upstreamPropName];
    }
    if (observeObj === null)
        throw 404;
    const { attr, names, scope } = share;
    // const affect = await findRealm(enhancedElement, scope);
    // if(affect === null || !(<any>affect).querySelectorAll) throw 404;
    //TODO, cache query results in weak references
    if (!cache.has(affect)) {
        cache.set(affect, {});
    }
    for (const name of names) {
        observeObj.addEventListener(name, e => {
            setProp(affect, attr, name, observeObj);
        });
        await setProp(affect, attr, name, observeObj);
    }
}
export async function setProp(affect, attr, name, observeObj) {
    const isScoped = affect.hasAttribute('itemscope');
    const query = `[${attr}="${name}"]`;
    const cacheMap = cache.get(affect);
    let targets;
    const cached = cacheMap[query];
    if (cached !== undefined) {
        targets = [];
        for (const cachedTarget of cached) {
            const deref = cachedTarget.deref();
            //TODO:  if deref is undefined, maybe repopulate?
            if (deref === undefined)
                continue;
            targets.push(deref);
        }
    }
    else {
        //TODO:  use @scope in css query when all browsers support it.
        targets = Array.from(affect.querySelectorAll(query));
        if (isScoped)
            targets = targets.filter(t => t.closest('[itemscope]') === affect);
        const weakRefs = targets.map(target => new WeakRef(target));
        cacheMap[query] = weakRefs;
    }
    const val = observeObj[name];
    for (const target of targets) {
        if (attr === 'itemprop') {
            const { setItemProp } = await import('./setItemProp.js');
            await setItemProp(target, val);
        }
    }
}
