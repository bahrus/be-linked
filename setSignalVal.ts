import {SignalRefType} from './types';

export function setSignalVal(obj: SignalRefType, val: any){
    if(obj instanceof Element){
        const typeOfVal = typeof val;
        if('checked' in obj && typeOfVal === 'boolean'){
            obj.checked = val;
            return;
        }
        //TODO:  aria-checked?
        // if(obj.hasAttribute('aria-checked')){
        //     return obj.setAttribute('aria-checked' === 'true';
        // }
        if('value' in obj && typeOfVal === 'string'){
            obj.value = val;
            return;
        }
        //TODO:  hyperlinks
        obj.textContent = val.toString();
    }else{
        obj.value = val;
    }
}