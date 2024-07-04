import {LocalSignal} from './types';
import {BVAAllProps} from 'be-value-added/types';
export function getRemoteProp(enhancedElement: Element){
    if(enhancedElement.hasAttribute('itemprop')){
        return enhancedElement.getAttribute('itemprop')?.split(' ')[0];
    }
    return (enhancedElement as any).name || enhancedElement.id;
}

export async function getLocalSignal(enhancedElement: Element, beVigilant = false): Promise<LocalSignal>{
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
                default:
                    return {
                        prop: 'value',
                        signal,
                        type: localName
                    };
            }
            break;
        }
        case 'form':{
            return {
                prop: 'formData',
                signal: enhancedElement,
                type: 'input',
            };
        }
        case 'button': {
            return {
                prop: 'value',
                signal: enhancedElement,
                type: 'click'
            };
        }
    }
    if(enhancedElement.hasAttribute('contenteditable')){
        return {
            prop: 'textContent',
            signal: enhancedElement,
            type: 'input'
        }
    }
    if(localName.includes('-')) throw 'NI';
        
    const {emc} = await import('be-value-added/behivior.js');
    const signal = await  (<any>enhancedElement).beEnhanced.whenResolved(emc) as BVAAllProps & EventTarget;
    signal.beVigilant = beVigilant;
    return {
        prop: 'value',
        signal,
        type: 'value',
    };
            
        // default:
            // localProp = enhancedElement.getAttribute('itemprop');
            // if(localProp === null) throw 'itemprop not specified';
    
}