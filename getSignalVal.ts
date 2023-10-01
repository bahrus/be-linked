import {SignalRefType} from './types';

export function getSignalVal(obj: SignalRefType){
    if(obj instanceof Element){
        if('checked' in obj){
            if(obj instanceof HTMLInputElement && obj.type === 'checkbox'){
                return obj.checked;
            }
        }
        if(obj.hasAttribute('aria-checked')){
            return obj.getAttribute('aria-checked') === 'true';
        }
        if('value' in obj){
            return obj.value;
        }
        //TODO:  hyperlinks
        return obj.textContent;
    }else{
        return obj.value;
    }
}