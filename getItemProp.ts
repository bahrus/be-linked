export async function getItemPropVal(el: Element){
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
        case 'time':
            return (<any>el).beEnhanced.beIntl.value;
        case 'link':
            return (<any>el).beEnhanced.beLinkValued.value;
    }
}