export function setSignalVal(obj, val) {
    if (obj instanceof Element) {
        const typeOfVal = typeof val;
        if ('checked' in obj && typeOfVal === 'boolean') {
            obj.checked = val;
            return;
        }
        //TODO:  aria-checked?
        // if(obj.hasAttribute('aria-checked')){
        //     return obj.setAttribute('aria-checked' === 'true';
        // }
        //previously had code to check if val is string, but we need to be abe to pass boolean to be-value-added, for example.
        if ('value' in obj) {
            obj.value = val;
            return;
        }
        //TODO:  hyperlinks
        obj.textContent = val.toString();
    }
    else {
        obj.value = val;
    }
}
