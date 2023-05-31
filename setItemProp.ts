export async function setItemProp(el: Element, val: any){
    switch(el.localName){
        case 'data':
        case 'output':
        case 'time':
            import('be-intl/be-intl.js');
            await (<any>el).beEnhanced.whenResolved('be-intl');
            break;
        case 'link':
            import('be-link-valued/be-link-valued.js');
            await (<any>el).beEnhanced.whenResolved('be-link-valued');
    }
    switch(el.localName){
        case 'data':
        case 'output':
            (<HTMLDataElement>el).value = val;
            break;
        case 'time':
            (<HTMLTimeElement>el).dateTime = val;
            break;
        case 'link':
            (<any>el).beEnhanced.beLinkValued.value = val;
            break;
        default:
            if((<any>el).href !== undefined){
                (<any>el).href = val;
            }else{
                el.textContent = val;//TODO, many more cases to consider
            }
            
    }
    
}