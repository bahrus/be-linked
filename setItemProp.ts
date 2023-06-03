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
        case 'meta':
            import('be-it/be-it.js');
            const beIt = await (<any>el).beEnhanced.whenResolved('be-it');
            beIt.value = val;
            return;
    }
    if( 'href' in el){
        (<any>el).href = val;
    }else{
        el.textContent = val;//TODO, many more cases to consider
    }

    
}