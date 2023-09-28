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
            import('be-value-added/be-value-added.js');
            await (<any>el).beEnhanced.whenResolved('be-value-added');
            return (<any>el).beEnhanced.beValueAdded.value;
    }

}