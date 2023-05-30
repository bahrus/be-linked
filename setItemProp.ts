export async function setItemProp(el: Element, val: any){
    //TODO:  load this conditionally
    switch(el.localName){
        case 'data':
        case 'output':
        case 'time':
            import('be-intl/be-intl.js');
            await (<any>el).beEnhanced.whenResolved('be-intl');
            break;
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
            switch(typeof val){
                case 'boolean':
                    (<HTMLLinkElement>el).href = `https://schema.org/${val ? 'True' : 'False'}`;
                    break;
            }
            break;
        default:
            el.textContent = val;//TODO, many more cases to consider
    }
    
}