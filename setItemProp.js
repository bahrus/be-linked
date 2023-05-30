export async function setItemProp(el, val) {
    //TODO:  load this conditionally
    switch (el.localName) {
        case 'data':
        case 'output':
        case 'time':
            import('be-intl/be-intl.js');
            await el.beEnhanced.whenResolved('be-intl');
            break;
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
            switch (typeof val) {
                case 'boolean':
                    el.href = `https://schema.org/${val ? 'True' : 'False'}`;
                    break;
            }
            break;
        default:
            el.textContent = val; //TODO, many more cases to consider
    }
}
