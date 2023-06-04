const cache = new WeakMap();
const alreadyProcessed = new WeakMap();
export async function share(ibe, link, onlyDoNonCachedElements) {
    const { enhancement, share: sh, upstreamCamelQry, upstreamPropName } = link;
    const { enhancedElement } = ibe;
    const { findRealm } = await import('trans-render/lib/findRealm.js');
    let eventTarget = await findRealm(enhancedElement, upstreamCamelQry);
    if (!(eventTarget instanceof Element))
        throw 404;
    let objectWithState = eventTarget;
    if (enhancement !== undefined) {
        const { applyEnh } = await import('./applyEnh.js');
        eventTarget = await applyEnh(eventTarget, enhancement, true);
    }
    if (upstreamPropName !== undefined) {
        if (upstreamPropName[0] === '.') {
            const { getVal } = await import('trans-render/lib/getVal.js');
            eventTarget = await getVal({ host: eventTarget }, upstreamPropName);
        }
        else {
            eventTarget = eventTarget[upstreamPropName];
        }
    }
    if (eventTarget === null)
        throw 404;
    if (enhancement === 'bePropagating') {
        //this is kind of a hack
        //TODO make this configuration
        eventTarget = objectWithState.beEnhanced.bePropagating.propagators.get('self');
    }
    else {
        objectWithState = eventTarget;
    }
    const { attr, names, allNames, scope } = sh;
    const affect = await findRealm(enhancedElement, scope);
    if (!(affect instanceof Element))
        throw 404;
    if (!cache.has(affect)) {
        cache.set(affect, {});
    }
    if (!alreadyProcessed.has(affect)) {
        alreadyProcessed.set(affect, new WeakSet());
        if (!onlyDoNonCachedElements) {
            affect.addEventListener('i-am-here', e => {
                share(ibe, link, true);
            });
        }
    }
    if (allNames) {
        if (!onlyDoNonCachedElements) {
            eventTarget.addEventListener('prop-changed', e => {
                const changeInfo = e.detail;
                setProp(affect, attr, changeInfo.prop, objectWithState, onlyDoNonCachedElements);
            });
        }
        for (const key in eventTarget) {
            await setProp(affect, attr, key, objectWithState, onlyDoNonCachedElements);
        }
    }
    else if (names !== undefined) {
        for (const name of names) {
            if (!onlyDoNonCachedElements) {
                eventTarget.addEventListener(name, e => {
                    setProp(affect, attr, name, objectWithState, onlyDoNonCachedElements);
                });
            }
            await setProp(affect, attr, name, objectWithState, onlyDoNonCachedElements);
        }
    }
}
export async function setProp(affect, attr, name, observeObj, onlyDoNonCachedElements) {
    const isScoped = affect.hasAttribute('itemscope');
    const query = `[${attr}="${name}"]`;
    const cacheMap = cache.get(affect);
    const alreadyProcessedLookup = alreadyProcessed.get(affect);
    let targets;
    const cached = cacheMap[query];
    if (cached !== undefined && !onlyDoNonCachedElements) {
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
        if (onlyDoNonCachedElements) {
            targets = targets.filter(t => !alreadyProcessedLookup.has(t));
        }
        else {
            targets.forEach(t => alreadyProcessedLookup.add(t));
        }
        const weakRefs = targets.map(target => new WeakRef(target));
        cacheMap[query] = weakRefs;
    }
    const val = observeObj[name];
    switch (attr) {
        case 'itemprop':
            const { setItemProp } = await import('./setItemProp.js');
            for (const target of targets) {
                await setItemProp(target, val);
            }
            break;
        case 'id':
        case 'name': {
            const { setNameVal } = await import('./setNameVal.js');
            for (const target of targets) {
                await setNameVal(target, val);
            }
        }
    }
    for (const target of targets) {
        if (attr === 'itemprop') {
            const { setItemProp } = await import('./setItemProp.js');
            await setItemProp(target, val);
        }
    }
}
