export function getSignalVal(obj) {
    if (obj instanceof HTMLElement) {
        if ('checked' in obj) {
            return obj.checked;
        }
        if (obj.hasAttribute('aria-checked')) {
            return obj.getAttribute('aria-checked') === 'true';
        }
        if ('value' in obj) {
            return obj.value;
        }
        //TODO:  hyperlinks
        return obj.textContent;
    }
    else {
        return obj.value;
    }
}