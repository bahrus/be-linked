export async function setItemProp(el, val) {
    let intl;
    switch (el.localName) {
        case 'data':
        case 'output':
        case 'time':
            import('be-intl/be-intl.js');
            intl = await el.beEnhanced.whenResolved('be-intl');
            intl.value = val;
            return;
        case 'link':
            import('be-link-valued/be-link-valued.js');
            await el.beEnhanced.whenResolved('be-link-valued');
    }
    if (el.href !== undefined) {
        el.href = val;
    }
    else {
        el.textContent = val; //TODO, many more cases to consider
    }
}
