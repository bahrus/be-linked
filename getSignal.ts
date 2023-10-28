import {ElTypes, SignalRefs} from './types';
import {findRealm} from 'trans-render/lib/findRealm.js';
import {BVAAllProps} from 'be-value-added/types';
import {Actions as BPActions} from 'be-propagating/types';

export async function getSignal(
    enhancedElement: Element, 
    type: ElTypes, 
    prop: string, 
    attr?: string,
    
    ): Promise<SignalRefs>{
    switch(type){
        case '$':{
            const el = await findRealm(enhancedElement, ['wis', prop!]) as HTMLElement;
            if(!el) throw 404;
            if(el.hasAttribute('contenteditable')){
                throw 'NI'
            }else{
                import('be-value-added/be-value-added.js');
                const signal = await  (<any>el).beEnhanced.whenResolved('be-value-added') as BVAAllProps & EventTarget;
                return {
                    el,
                    signal,
                    ref: new WeakRef<BVAAllProps>(signal),
                    eventType: 'value'
                };
            }
        }
        case '@':{
            const el = await findRealm(enhancedElement, ['wf', prop!]) as HTMLInputElement;
            if(!el) throw 404;
            return {
                el,
                signal: el,
                ref: new WeakRef(el),
                eventType: 'input',
            }
        }
        case '#':{
            const el = await findRealm(enhancedElement, ['wrn', '#' + prop!]) as HTMLInputElement;
            if(!el) throw 404;
            return {
                el,
                signal: el,
                ref: new WeakRef(el),
                eventType: 'input'
            }
        }
        case '/':{
            const el = await findRealm(enhancedElement, 'hostish') as Element;
            if(!el) throw 404;
            import('be-propagating/be-propagating.js');
            //console.log('enhance with be-propagating');
            const bePropagating = await (<any>el).beEnhanced.whenResolved('be-propagating') as BPActions;
            //console.log('attached be-propagating');
            const signal = await bePropagating.getSignal(prop!);
            return {
                el,
                signal,
                ref: new WeakRef(signal),
                eventType: 'value-changed'
            };
        }
        case '-':{
            const el = await findRealm(enhancedElement, ['upSearch', `[${attr!}]`]) as Element;
            if(!el) throw 404;
            import('be-propagating/be-propagating.js');
            const bePropagating = await (<any>el).beEnhanced.whenResolved('be-propagating') as BPActions;
            const signal = await bePropagating.getSignal(prop!);
            return {
                el,
                signal,
                ref: new WeakRef(signal),
                eventType: 'value-changed'
            };
        }
            
    }
}