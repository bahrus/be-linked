import { findRealm } from 'trans-render/lib/findRealm.js';
import { applyEnh } from './applyEnh.js';
import { getIPsInScope, exclude, getRefs } from './getIPsInScope.js';
import { setItemProp } from './setItemProp.js';
const cache = new WeakMap();
const alreadyProcessed = new WeakMap();
export async function share(ibe, link, onlyDoNonCachedElements) {
    //const t0 = performance.now();
    //console.log('start share', t0);
    const { enhancement, share: sh, upstreamCamelQry, upstreamPropName } = link;
    const { enhancedElement } = ibe;
    //const {findRealm} = await import('trans-render/lib/findRealm.js');
    let eventTarget = await findRealm(enhancedElement, upstreamCamelQry);
    if (!(eventTarget instanceof Element))
        throw 404;
    let objectWithState = eventTarget;
    if (enhancement !== undefined) {
        //const {applyEnh} = await import('./applyEnh.js');
        eventTarget = await applyEnh(eventTarget, enhancement, true);
    }
    const t10 = performance.now();
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
    const { source, attr, names, allNames, scope } = sh;
    const affect = await findRealm(enhancedElement, scope);
    if (!(affect instanceof Element))
        throw 404;
    const t20 = performance.now();
    switch (enhancement) {
        case 'bePropagating':
            {
                switch (source) {
                    case '$0':
                    case '$1':
                    case 'host':
                        const base = await objectWithState.beEnhanced.whenResolved('be-propagating');
                        eventTarget = base.propagators.get('self');
                        break;
                    case 'props':
                        const itemprop = enhancedElement.getAttribute('itemprop');
                        if (itemprop === null)
                            throw 404;
                        const key = itemprop.split(' ')[0];
                        eventTarget = await (await objectWithState.beEnhanced.whenResolved('be-propagating')).getPropagator(key);
                        objectWithState = eventTarget.targetRef.deref();
                        break;
                }
            }
            break;
        case 'beScoped':
            const itemprop = enhancedElement.getAttribute('itemprop');
            if (itemprop === null)
                throw 'NI';
            const beScoped = objectWithState.beEnhanced.beScoped; //whenResolved('be-scoped');
            const localEventTarget = beScoped.scope;
            objectWithState = eventTarget[itemprop];
            localEventTarget?.addEventListener(itemprop, async (e) => {
                objectWithState = eventTarget[itemprop];
                if (objectWithState !== undefined)
                    await recShare(affect, cache, null, onlyDoNonCachedElements, names, allNames, ibe, link, objectWithState, attr);
            });
            //await recShare(affect, cache, null, onlyDoNonCachedElements, names, allNames, ibe, link, objectWithState, attr);
            //console.log({itemprop, eventTarget, objectWithState});
            break;
        default:
            objectWithState = eventTarget;
    }
    const t30 = performance.now();
    if (objectWithState !== undefined)
        await recShare(affect, cache, eventTarget, onlyDoNonCachedElements, names, allNames, ibe, link, objectWithState, attr);
    const t40 = performance.now();
    //console.log({t1020: t20-t10, t2030: t30 - t20, t3040: t40-t30});
}
async function recShare(affect, cache, eventTarget, onlyDoNonCachedElements, names, allNames, ibe, link, objectWithState, attr) {
    if (objectWithState === undefined)
        return;
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
        //const {getIPsInScope} = await import('./getIPsInScope.js');
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
        if (!onlyDoNonCachedElements && eventTarget) {
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
            //const {exclude} = await import('./getIPsInScope.js');
            targets = Array.from(affect.querySelectorAll(query));
            if (isScoped) {
                targets = targets.filter(t => exclude(t, affect));
                const itemref = affect.getAttribute('itemref');
                if (itemref !== null) {
                    //const {getRefs} = await import('./getIPsInScope.js');
                    targets = [...targets, ...getRefs(affect, itemref, query)];
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
            //const {setItemProp} = await import('./setItemProp.js');
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
