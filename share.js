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
        const { source } = sh;
        switch (source) {
            case '$0':
            case '$1':
            case 'host':
                eventTarget = objectWithState.beEnhanced.bePropagating.propagators.get('self');
                break;
            case 'props':
                const itemprop = enhancedElement.getAttribute('itemprop');
                if (itemprop === null)
                    throw 404;
                const key = itemprop.split(' ')[0];
                eventTarget = await objectWithState.beEnhanced.bePropagating.getPropagator(key);
                objectWithState = eventTarget.targetRef.deref();
                break;
        }
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
            const subscriber = affect.hasAttribute('itemref') ? affect.getRootNode() : affect;
            subscriber.addEventListener('i-am-here', e => {
                share(ibe, link, true);
            });
        }
    }
    let propNames = names;
    let ips;
    if (propNames === undefined || allNames) {
        const { getIPsInScope } = await import('./getIPsInScope.js');
        const s = new Set();
        ips = getIPsInScope(affect);
        for (const ip of ips) {
            for (const name of ip.names) {
                s.add(name);
            }
        }
        propNames = Array.from(s);
    }
    for (const name of propNames) {
        if (!onlyDoNonCachedElements) {
            eventTarget.addEventListener(name, e => {
                setProp(affect, attr, name, objectWithState, onlyDoNonCachedElements, ips);
            });
        }
        await setProp(affect, attr, name, objectWithState, onlyDoNonCachedElements, ips);
    }
}
export async function setProp(affect, attr, name, observeObj, onlyDoNonCachedElements, ips) {
    const isScoped = affect.hasAttribute('itemscope');
    const sq = attr === 'itemprop' ? '~' : '';
    const query = `[${attr}${sq}="${name}"]`;
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
        if (isScoped && ips !== undefined) {
            targets = [];
            for (const ip of ips) {
                const { names, el } = ip;
                if (names.includes(name)) {
                    targets.push(el);
                }
            }
        }
        else {
            const { exclude } = await import('./getIPsInScope.js');
            targets = Array.from(affect.querySelectorAll(query));
            if (isScoped) {
                targets = targets.filter(t => exclude(t, affect));
                const itemref = affect.getAttribute('itemref');
                if (itemref !== null) {
                    const { getRefs } = await import('./getIPsInScope.js');
                    targets = [...targets, ...getRefs(affect, itemref)];
                }
            }
            if (onlyDoNonCachedElements) {
                targets = targets.filter(t => !alreadyProcessedLookup.has(t));
            }
            else {
                targets.forEach(t => alreadyProcessedLookup.add(t));
            }
        }
        const weakRefs = targets.map(target => new WeakRef(target));
        cacheMap[query] = weakRefs;
    }
    const val = observeObj[name];
    switch (attr) {
        case 'itemprop':
            const { setItemProp } = await import('./setItemProp.js');
            for (const target of targets) {
                await setItemProp(target, val, name);
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
    // for(const target of targets){
    //     if(attr === 'itemprop'){
    //         const {setItemProp} = await import('./setItemProp.js');
    //         await setItemProp(target, val);
    //     }
    // }
}
