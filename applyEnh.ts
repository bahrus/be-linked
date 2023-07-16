import {camelToLisp} from 'trans-render/lib/camelToLisp.js';
export async function applyEnh(instance: Element, enhancement: string, wait?: boolean){
    //const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
    const enh = camelToLisp(enhancement);
    if(wait){
        return await (<any>instance).beEnhanced.whenResolved(enh);
    }else{
        return await (<any>instance).beEnhanced.whenDefined(enh);
    }
    
}