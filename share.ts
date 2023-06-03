import {AP, Share, Link} from './types';
import {IBE} from 'be-enhanced/types';
import {ProxyPropChangeInfo} from 'trans-render/lib/types';

const cache = new WeakMap<EventTarget, {[key: string]: WeakRef<Element>[]}>();

export async function share(ibe: IBE, link: Link): Promise<void>{
     const {
        enhancement, share, upstreamCamelQry, upstreamPropName
    } = link;
    const {enhancedElement} = ibe;
    const {findRealm} = await import('trans-render/lib/findRealm.js');
    let observeObj = await findRealm(enhancedElement, upstreamCamelQry);
    if(!(observeObj instanceof Element)) throw 404;
    const affect = observeObj;
    if(enhancement !== undefined){
        const {applyEnh} = await import('./applyEnh.js');
        observeObj = await applyEnh(observeObj, enhancement, true);
    }
    if(upstreamPropName !== undefined){
        observeObj = (<any>observeObj)[upstreamPropName];
    }
    if(observeObj === null) throw 404;
    const {attr, names, scope, allNames} = share!;
    // const affect = await findRealm(enhancedElement, scope);
    // if(affect === null || !(<any>affect).querySelectorAll) throw 404;
    
    //TODO, cache query results in weak references
    if(!cache.has(affect)){
        cache.set(affect, {});
    }
    if(allNames){
        observeObj.addEventListener('prop-changed', e=> {
            const changeInfo = (e as CustomEvent).detail as ProxyPropChangeInfo;
            setProp(affect, attr, changeInfo.prop, observeObj);
        });
        for(const key in observeObj){
            await setProp(affect, attr, key, observeObj);
        }
    }else if(names !== undefined){
        for(const name of names){
            observeObj.addEventListener(name, e => {
                setProp(affect, attr, name, observeObj);
            });
            await setProp(affect, attr, name, observeObj);
        }
    }

}

export async function setProp(affect: Element, attr: string, name: string, observeObj: any){
    const isScoped = affect.hasAttribute('itemscope');
    const query = `[${attr}="${name}"]`;
    const cacheMap = cache.get(affect)!;
    let targets: Element[] | undefined;
    const cached = cacheMap[query] ;
    if(cached !== undefined){
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

