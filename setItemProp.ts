import {AllProps} from 'be-intl/types';
export async function setItemProp(el: Element, val: any){
    let intl: AllProps;
    switch(el.localName){
        case 'data':
        case 'output':
        case 'time':
            import('be-intl/be-intl.js');
            intl = await (<any>el).beEnhanced.whenResolved('be-intl');
            intl.value = val;
            return;
        case 'link':
            import('be-link-valued/be-link-valued.js');
            await (<any>el).beEnhanced.whenResolved('be-link-valued');
    }
    if((<any>el).href !== undefined){
        (<any>el).href = val;
    }else{
        el.textContent = val;//TODO, many more cases to consider
    }

    
}