export async function setItemProp(el, val, name) {
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
            import('be-it/be-it.js');
            const beIt = await el.beEnhanced.whenResolved('be-it');
            beIt.value = val;
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
            if (Array.isArray(val)) {
                console.log('loop scenario');
                import('be-repeated/be-repeated.js');
                const beRepeated = await aSrc.beEnhanced.whenResolved('be-repeated');
                beRepeated.addEventListener('newRows', (e) => {
                    console.log({ e });
                    const newRows = e.detail.newRows;
                    for (const newRow of newRows) {
                        const { idx, nodes } = newRow;
                        const item = val[idx - 1];
                        for (const node of nodes) {
                            if (node instanceof Element) {
                                const itemProp = node.getAttribute('itemprop');
                                if (itemProp === 'itemListElement') {
                                    setItemProp(node, item, itemProp);
                                }
                            }
                        }
                    }
                });
                Object.assign(beRepeated, {
                    startIdx: 1,
                    endIdx: val.length,
                    templIdx: 0
                });
                //loop scenario
            }
            else {
                if (el.hasAttribute('itemscope')) {
                    if (val.constructor.toString().startsWith('class ')) {
                        import('be-propagating/be-propagating.js');
                        const bePropagating = await aSrc.beEnhanced.whenResolved('be-propagating');
                        bePropagating.setKeyVal(name, val);
                        //use propagator
                    }
                    else {
                        //assign into scope
                        import('be-scoped/be-scoped.js');
                        const beSpoked = await aSrc.beEnhanced.whenResolved('be-propagating');
                        beSpoked.setKeyVal(name, val);
                    }
                }
                else {
                    el.textContent = JSON.stringify(val, null, 2);
                }
            }
            break;
        default:
            throw 'NI';
    }
}
