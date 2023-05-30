import {AP, Share, Link} from './types';
import {IBE} from 'be-enhanced/types';

const cache = new WeakMap<EventTarget, {[key: string]: WeakRef<Element>[]}>();

export async function share(ibe: IBE, link: Link): Promise<void>{
     const {
        enhancement, share, upstreamCamelQry, upstreamPropName
    } = link;
    const {enhancedElement} = ibe;
    const {findRealm} = await import('trans-render/lib/findRealm.js');
    let observeObj = await findRealm(enhancedElement, upstreamCamelQry);
    if(!(observeObj instanceof Element)) throw 404;
    if(enhancement !== undefined){
        const {applyEnh} = await import('./applyEnh.js');
        observeObj = await applyEnh(observeObj, enhancement, true);
    }
    if(upstreamPropName !== undefined){
        observeObj = (<any>observeObj)[upstreamPropName];
    }
    if(observeObj === null) throw 404;
    const {attr, names, scope} = share!;
    const affect = await findRealm(enhancedElement, scope);
    if(affect === null || !(<any>affect).querySelectorAll) throw 404;
    //TODO, cache query results in weak references
    if(!cache.has(affect)){
        cache.set(affect, {});
    }
    
    for(const name of names){
        observeObj.addEventListener(name, e => {
            setProp(affect as DocumentFragment, attr, name, observeObj);
        });
        await setProp(affect as DocumentFragment, attr, name, observeObj);
    }
}

export async function setProp(affect: DocumentFragment, attr: string, name: string, observeObj: any){
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
        targets = Array.from(affect.querySelectorAll(query));
        const weakRefs = targets.map(target => new WeakRef<Element>(target));
        cacheMap[query] = weakRefs;
    }
    const val = observeObj[name];
    for(const target of targets){
        if(attr === 'itemprop'){
            await setItemProp(target, val);
        }
    }
}

export async function setItemProp(el: Element, val: any){
    switch(el.localName){
        case 'data':
        case 'output':
        case 'time':
            import('be-intl/be-intl.js');
            await (<any>el).beEnhanced.whenResolved('be-intl');
            break;
    }
    switch(el.localName){
        case 'data':
        case 'output':
            (<HTMLDataElement>el).value = val;
            break;
        case 'time':
            (<HTMLTimeElement>el).dateTime = val;
            break;
        case 'link':
            switch(typeof val){
                case 'boolean':
                    (<HTMLLinkElement>el).href = `https://schema.org/${val ? 'True' : 'False'}`;
                    break;
            }
            break;
        default:
            el.textContent = val;//TODO, many more cases to consider
    }
    
}