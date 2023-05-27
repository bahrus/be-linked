import {AP, IObserve, Link} from './types';
import {IBE} from 'be-enhanced/types';
export async function observe(ibe: IBE, link: Link): Promise<EventTarget>{
    const {enhancement, observe, downstreamPropName} = link;
    const {enhancedElement} = ibe;
    let affectedObj = enhancedElement as any;
    if(enhancement !== undefined){
        const {applyEnh} = await import('./applyEnh.js');
        affectedObj = await applyEnh(enhancedElement, enhancement);
    }
    if(downstreamPropName !== undefined){
        if(affectedObj[downstreamPropName] === undefined){
            const {PropertyBag} = await import('trans-render/lib/PropertyBag.js');
            const pb = new PropertyBag();
            affectedObj[downstreamPropName!] = pb.proxy;
        }
        affectedObj = affectedObj[downstreamPropName]
    }

    const {scope, attr, names, isFormElement, on} = observe!;
    const {findRealm} = await import('trans-render/lib/findRealm.js');
    const realm = await findRealm(enhancedElement, scope) as DocumentFragment;
    for(const name of names){
        const elToObserve = realm.querySelector(`[${attr}="${name}"]`) as HTMLInputElement;
        if(elToObserve === null) throw 404;
        if(isFormElement){
            const input = elToObserve as HTMLInputElement;
            affectedObj[name] = input.valueAsNumber || input.valueAsDate || input.value;
            if(isFormElement){
                elToObserve.addEventListener(on!, e =>  {
                    affectedObj[name] = input.valueAsNumber || input.valueAsDate || input.value;
                });
            }
        }

    }
    return affectedObj as EventTarget;

}