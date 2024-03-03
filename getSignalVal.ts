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
        if('valueAsNumber' in obj){
            if(obj instanceof HTMLInputElement && obj.type === 'number'){
                return obj.valueAsNumber;
            }
        }
        if('valueAsDate' in obj){
            if(obj instanceof HTMLInputElement && obj.type === 'date'){
                return obj.valueAsDate;
            }
        }
        if('value' in obj){
            return obj.value;
        }
        const ariaValueNow = (obj as Element).ariaValueNow;
        if(ariaValueNow) return ariaValueNow; 
        //TODO:  hyperlinks
        return obj.textContent;
    }else{
        return obj.value;
    }
}