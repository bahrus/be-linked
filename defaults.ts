import {LocalSignal} from './types';
import {BVAAllProps} from 'be-value-added/types';
export function getRemoteProp(enhancedElement: Element){
    if(enhancedElement.hasAttribute('itemprop')){
        return enhancedElement.getAttribute('itemprop')?.split(' ')[0];
    }
    return (enhancedElement as any).name || enhancedElement.id;
}

export async function getLocalSignal(enhancedElement: Element): Promise<LocalSignal>{
    const {localName} = enhancedElement;
    switch(localName){
        case 'input':{
            const {type} = enhancedElement as HTMLInputElement;
            const signal = enhancedElement;
            switch(type){
                case 'number':
                    return {
                       prop: 'valueAsNumber',
                       signal,
                       type: localName
                    };
                case 'checkbox':
                    return {
                        prop: 'checked',
                        signal,
                        type: localName
                    };
                    break;
                default:
                    return {
                        prop: 'value',
                        signal,
                        type: localName
                    };
            }
        }

        case 'meta':{
            import('be-value-added/be-value-added.js');
            const signal = await  (<any>enhancedElement).beEnhanced.whenResolved('be-value-added') as BVAAllProps & EventTarget;
            return {
                prop: 'value',
                signal,
                type: 'value-changed',
            };
        }
            
        // default:
        //     localProp = enhancedElement.getAttribute('itemprop');
        //     if(localProp === null) throw 'itemprop not specified';
    }
    return {
        prop: 'textContent',
        signal: enhancedElement,
    }
}