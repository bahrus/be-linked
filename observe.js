export async function observe(ibe, link) {
    console.log({ ibe, link });
    const { enhancement, observe, downstreamPropName } = link;
    const { enhancedElement } = ibe;
    let affectedObj = enhancedElement;
    if (enhancement !== undefined) {
        const { applyEnh } = await import('./applyEnh.js');
        affectedObj = await applyEnh(enhancedElement, enhancement);
    }
    if (downstreamPropName !== undefined) {
        if (affectedObj[downstreamPropName] === undefined) {
            const { PropertyBag } = await import('trans-render/lib/PropertyBag.js');
            const pb = new PropertyBag();
            affectedObj[downstreamPropName] = pb.proxy;
        }
        affectedObj = affectedObj[downstreamPropName];
    }
    const { scope, attr, names, isFormElement, on } = observe;
    const { findRealm } = await import('trans-render/lib/findRealm.js');
    const realm = await findRealm(enhancedElement, scope);
    for (const name of names) {
        const elToObserve = realm.querySelector(`[${attr}="${name}"]`);
        if (elToObserve === null)
            throw 404;
        if (isFormElement) {
            const input = elToObserve;
            affectedObj[name] = input.valueAsNumber || input.valueAsDate || input.value;
            if (isFormElement) {
                elToObserve.addEventListener(on, e => {
                    affectedObj[name] = input.valueAsNumber || input.valueAsDate || input.value;
                });
            }
        }
    }
}
