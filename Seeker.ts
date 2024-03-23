import { SignalAndEvent, SignalRefType } from '../be-linked/types.js';
import { findRealm } from 'trans-render/lib/findRealm.js';

import {ElTypes, ElO} from 'trans-render/lib/prs/types';

export class Seeker<TSelf = any, TCtx = any>{
    constructor(
        public elO: ElO,
        public doCallback?: boolean,
    ){
    }
    val: any;
    async do<TSelf, TCtx>(
        self: TSelf,
        ctx: TCtx,
        enhancedElement: Element) : Promise<SignalAndEvent | undefined>
    {
        const {elO} = this;
        const {event, prop, elType, perimeter, marker} = elO;
        let signal: WeakRef<SignalRefType> | undefined = undefined;
        let eventSuggestion: string | undefined = undefined;
        let signalRef: HTMLInputElement | undefined = undefined;
        let propagator: EventTarget | undefined = undefined;
        switch(elType){
            case '|':
                signalRef = await findRealm(enhancedElement, ['wis', prop!])  as HTMLInputElement;
                if(signalRef.hasAttribute('contenteditable')){
                    signal = new WeakRef(signalRef);
                    eventSuggestion = 'input';
                }else{
                    [signalRef, signal, eventSuggestion] = await this.addValue(signalRef);
                }
                break;
            case '@':
            case '#':{
                switch(elType){
                    case '@':
                        if(perimeter !== undefined){
                            signalRef = await findRealm(enhancedElement, ['wi', perimeter, `[name="${prop}"]`]) as HTMLInputElement;
                        }else{
                            signalRef = await findRealm(enhancedElement, ['wf', prop!]) as HTMLInputElement;
                        }
                        
                        break;
                    case '#':
                        signalRef = await findRealm(enhancedElement, ['wrn', '#' + prop!]) as HTMLInputElement;
                        break;
                }
                if(!signalRef) throw 404;
                signal = new WeakRef(signalRef);

                eventSuggestion = event || 'input'

                break;
            }
            case '~':
            case '-':
            case '/':{
                let propToSubscribeTo = prop;
                switch(elType){
                    case '-':{
                        //signalRef = await findRealm(enhancedElement, ['us', `[${marker}]` ]) as HTMLInputElement;
                        signalRef = await findRealm(enhancedElement, ['wis', `[${marker}]`, true]) as HTMLInputElement;
                        break;
                    }
                    case '/':{
                        signalRef = await findRealm(enhancedElement, ['h', true]) as HTMLInputElement;
                        break;
                    }
                    case '~':{
                        //TODO:  the line below is likely to appear elsewhere, share it
                        const { getSubProp } = await import('trans-render/lib/prs/prsElO.js');
                        const subPropToConsider = getSubProp(elO, enhancedElement as HTMLElement);
                        const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
                        const localName = camelToLisp(prop!);
                        signalRef = await findRealm(enhancedElement, ['wis', localName, true]) as HTMLInputElement;
                        const {substrBefore} = await import('trans-render/lib/substrBefore.js');
                        propToSubscribeTo = substrBefore(substrBefore(subPropToConsider, '.'), '|');
                    }
                }
                await customElements.whenDefined(signalRef.localName);
                import('be-propagating/be-propagating.js');
                const bePropagating = await (<any>signalRef).beEnhanced.whenResolved('be-propagating');
                const signal2 = await bePropagating.getSignal(prop);
                propagator = signal2.propagator;
                eventSuggestion = propToSubscribeTo;
                signal = new WeakRef(signalRef);
                break;
            }
        }
        if(this.doCallback && signalRef !== undefined && eventSuggestion !== undefined){
            await this.callback(self, signalRef, eventSuggestion, ctx);
        }
        return {
            signal,
            eventSuggestion,
            propagator,
        };
    }

    async callback<TSelf, TCtx>(self: TSelf, signalRef: HTMLInputElement, eventSuggestion: string, onOrOff: TCtx){
    }

    async addValue(signalRef: HTMLInputElement) : Promise<[HTMLInputElement, WeakRef<SignalRefType>, string]>{
        import('be-value-added/be-value-added.js');
        const newSignalRef = await  (<any>signalRef).beEnhanced.whenResolved('be-value-added') as HTMLInputElement;
        const signal = new WeakRef(newSignalRef);
        return [newSignalRef, signal, 'value'];
    }



}




