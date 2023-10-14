export function getRemoteProp(enhancedElement) {
    if (enhancedElement.hasAttribute('itemprop')) {
        return enhancedElement.getAttribute('itemprop')?.split(' ')[0];
    }
    return enhancedElement.name || enhancedElement.id;
}
export function getLocalProp(enhancedElement) {
    const { localName } = enhancedElement;
    let localProp = 'textContent';
    switch (localName) {
        case 'input':
            const { type } = enhancedElement;
            switch (type) {
                case 'number':
                    return 'valueAsNumber';
                case 'checkbox':
                    return 'checked';
                    break;
                default:
                    return 'value';
            }
            break;
        case 'meta':
            return 'value';
        // default:
        //     localProp = enhancedElement.getAttribute('itemprop');
        //     if(localProp === null) throw 'itemprop not specified';
    }
    return 'textContent';
}
