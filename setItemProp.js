export async function setItemProp(el, val) {
    switch (el.localName) {
        case 'data':
        case 'output':
        case 'time':
            import('be-intl/be-intl.js');
            await el.beEnhanced.whenResolved('be-intl');
            break;
        case 'link':
            import('be-link-valued/be-link-valued.js');
            await el.beEnhanced.whenResolved('be-link-valued');
    }
    switch (el.localName) {
        case 'data':
        case 'output':
            el.value = val;
            break;
        case 'time':
            el.dateTime = val;
            break;
        case 'link':
            el.beEnhanced.beLinkValued.value = val;
            break;
        default:
            if (el.href !== undefined) {
                el.href = val;
            }
            else {
                el.textContent = val; //TODO, many more cases to consider
            }
    }
}
