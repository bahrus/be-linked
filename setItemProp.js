export async function setItemProp(el, val, name) {
    if (val === undefined)
        return;
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
        case 'meta':
            import('be-value-added/be-value-added.js');
            const bva = await el.beEnhanced.whenResolved('be-value-added');
            bva.value = val;
            return;
    }
    switch (typeof val) {
        case 'string':
            if ('href' in el) {
                el.href = val;
            }
            else {
                el.textContent = val; //TODO, many more cases to consider
            }
            break;
        case 'number':
        case 'bigint':
        case 'boolean':
        case 'function':
        case 'symbol':
            el.textContent = val.toString();
            break;
        case 'object':
            const aSrc = el;
            if (el.hasAttribute('itemscope')) {
                if (Array.isArray(val)) {
                    //loop scenario
                    import('be-repeated/be-repeated.js');
                    const beRepeated = await aSrc.beEnhanced.whenResolved('be-repeated');
                    beRepeated.rowHandler = async (row) => {
                        await handleRow(row, val);
                    };
                    Object.assign(beRepeated, {
                        startIdx: 1,
                        endIdx: val.length,
                        templIdx: 0
                    });
                }
                else {
                    if (val.constructor.toString().startsWith('class ')) {
                        //use propagator
                        import('be-propagating/be-propagating.js');
                        const bePropagating = await aSrc.beEnhanced.whenResolved('be-propagating');
                        bePropagating.setKeyVal(name, val);
                    }
                    else {
                        //assign into scope
                        import('be-scoped/be-scoped.js');
                        const beScoped = await aSrc.beEnhanced.whenResolved('be-scoped');
                        beScoped.scope[name] = val;
                        //beScoped.setKeyVal(name, val);
                    }
                }
            }
            else {
                el.textContent = toString(val, 40); // JSON.stringify(val, null, 2);
            }
            break;
        default:
            throw 'NI';
    }
}
function toString(obj, max) {
    let ret = JSON.stringify(obj, null, 2);
    if (ret.length > max * 2) {
        ret = ret.substring(0, max) + '...' + ret.substring(ret.length - max);
    }
    return ret;
}
async function handleRow(row, val) {
    const { idx, children, condition } = row;
    //TODO:  support defer rendering based on condition === existing
    const item = val[idx - 1];
    for (const child of children) {
        const itemProp = child.getAttribute('itemprop');
        if (itemProp === 'itemListElement') {
            await setItemProp(child, item, itemProp);
        }
    }
}
