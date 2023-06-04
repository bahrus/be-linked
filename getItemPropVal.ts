export async function getItemPropVal(el: Element){
    switch(el.localName){
        case 'data':
        case 'output':
        case 'time':
            import('be-intl/be-intl.js');
            await (<any>el).beEnhanced.whenResolved('be-intl');
            return (<any>el).beEnhanced.beIntl.value;
        case 'link':
        case 'meta':
            import('be-it/be-it.js');
            await (<any>el).beEnhanced.whenResolved('be-it');
            return (<any>el).beEnhanced.beIt.value;
    }

}