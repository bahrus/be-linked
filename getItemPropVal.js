export async function getItemPropVal(el) {
    switch (el.localName) {
        case 'data':
        case 'output':
        case 'time':
            import('be-intl/be-intl.js');
            await el.beEnhanced.whenResolved('be-intl');
            return el.beEnhanced.beIntl.value;
        case 'link':
        case 'meta':
            import('be-it/be-it.js');
            await el.beEnhanced.whenResolved('be-it');
            return el.beEnhanced.beIt.value;
    }
}
