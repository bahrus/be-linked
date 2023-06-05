import {AP, Share, Link} from './types';
import {IBE} from 'be-enhanced/types';
import {ProxyPropChangeInfo} from 'trans-render/lib/types';

type AffectedElement = Element;

const cache = new WeakMap<AffectedElement, {[key: string]: WeakRef<Element>[]}>();

const alreadyProcessed = new WeakMap<AffectedElement, WeakSet<Element>>();

export async function share(ibe: IBE, link: Link, onlyDoNonCachedElements: boolean): Promise<void>{
     const {
        enhancement, share: sh, upstreamCamelQry, upstreamPropName
    } = link;
    const {enhancedElement} = ibe;
    const {findRealm} = await import('trans-render/lib/findRealm.js');
    let eventTarget = await findRealm(enhancedElement, upstreamCamelQry);
    if(!(eventTarget instanceof Element)) throw 404;
    let objectWithState = eventTarget as any;
    if(enhancement !== undefined){
        const {applyEnh} = await import('./applyEnh.js');
        eventTarget = await applyEnh(eventTarget, enhancement, true);
    }
    if(upstreamPropName !== undefined){
        if(upstreamPropName[0] === '.'){
            const {getVal} = await import('trans-render/lib/getVal.js');
            eventTarget = await getVal({host: eventTarget}, upstreamPropName);
        }else{
            eventTarget = (<any>eventTarget)[upstreamPropName];
        }
        
    }
    if(eventTarget === null) throw 404;
    if(enhancement === 'bePropagating'){
        //this is kind of a hack
        //TODO make this configuration
        eventTarget = (<any>objectWithState).beEnhanced.bePropagating.propagators.get('self') as EventTarget;
    }else{
        objectWithState = eventTarget;
    }
    const {attr, names,  allNames, scope} = sh!;
    const affect = await findRealm(enhancedElement, scope);
    if(!(affect instanceof Element)) throw 404;
    
    if(!cache.has(affect)){
        cache.set(affect, {});
    }
    if(!alreadyProcessed.has(affect)){
        alreadyProcessed.set(affect, new WeakSet<Element>());
        if(!onlyDoNonCachedElements){
            affect.addEventListener('i-am-here', e => {
                share(ibe, link, true);
            });
        }
    }
    let propNames = names;
    if(propNames === undefined || allNames){
        const {getIPsInScope} = await import('./getIPsInScope.js');
        const s = new Set<string>();
        const ips = getIPsInScope(affect);
        for(const ip of ips){
            for(const name of ip.names){
                s.add(name);
            }
        }
        propNames = Array.from(s);
    }
    for(const name of propNames){
        if(!onlyDoNonCachedElements){
            eventTarget.addEventListener(name, e => {
                setProp(affect, attr, name, objectWithState, onlyDoNonCachedElements);
            });
        }

        await setProp(affect, attr, name, objectWithState, onlyDoNonCachedElements);
    }


}

export async function setProp(affect: Element, attr: string, name: string, observeObj: any, onlyDoNonCachedElements: boolean){
    const isScoped = affect.hasAttribute('itemscope');
    const sq = attr === 'itemprop' ? '~' : '';
    const query = `[${attr}${sq}="${name}"]`;
    const cacheMap = cache.get(affect)!;
    const alreadyProcessedLookup = alreadyProcessed.get(affect)!;
    let targets: Element[] | undefined;
    const cached = cacheMap[query] ;
    if(cached !== undefined && !onlyDoNonCachedElements){
        targets = [];
        for(const cachedTarget of cached){
            const deref = cachedTarget.deref();
            //TODO:  if deref is undefined, maybe repopulate?
            if(deref === undefined) continue;
            targets.push(deref);
        }
    }else{
        //TODO:  use @scope in css query when all browsers support it.
        targets = Array.from(affect.querySelectorAll(query));
        if(isScoped) targets = targets.filter(t => t.closest('[itemscope]') === affect);
        if(onlyDoNonCachedElements) {
            targets = targets.filter(t => !alreadyProcessedLookup.has(t))
        }else{
            targets.forEach(t => alreadyProcessedLookup.add(t));
        }
        const weakRefs = targets.map(target => new WeakRef<Element>(target));
        cacheMap[query] = weakRefs;
    }
    const val = observeObj[name];
    switch(attr){
        case 'itemprop':
            const {setItemProp} = await import('./setItemProp.js');
            for(const target of targets){
                await setItemProp(target, val);
            }
            break;
        case 'id':
        case 'name':{
            const {setNameVal} = await import('./setNameVal.js');
            for(const target of targets){
                await setNameVal(target, val);
            }
        }
    }
    for(const target of targets){
        if(attr === 'itemprop'){
            const {setItemProp} = await import('./setItemProp.js');
            await setItemProp(target, val);
        }
    }
}

