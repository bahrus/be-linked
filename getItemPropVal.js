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
            import('be-value-added/be-value-added.js');
            await el.beEnhanced.whenResolved('be-value-added');
            return el.beEnhanced.beValueAdded.value;
    }
}
