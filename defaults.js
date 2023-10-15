export function getRemoteProp(enhancedElement) {
    if (enhancedElement.hasAttribute('itemprop')) {
        return enhancedElement.getAttribute('itemprop')?.split(' ')[0];
    }
    return enhancedElement.name || enhancedElement.id;
}
export async function getLocalSignal(enhancedElement) {
    const { localName } = enhancedElement;
    switch (localName) {
        case 'input': {
            const { type } = enhancedElement;
            const signal = enhancedElement;
            switch (type) {
                case 'number':
                    return {
                        prop: 'valueAsNumber',
                        signal
                    };
                case 'checkbox':
                    return {
                        prop: 'checked',
                        signal
                    };
                    break;
                default:
                    return {
                        prop: 'value',
                        signal
                    };
            }
        }
        case 'meta': {
            import('be-value-added/be-value-added.js');
            const signal = await enhancedElement.beEnhanced.whenResolved('be-value-added');
            return {
                prop: 'value',
                signal,
            };
        }
        // default:
        //     localProp = enhancedElement.getAttribute('itemprop');
        //     if(localProp === null) throw 'itemprop not specified';
    }
    return {
        prop: 'textContent',
        signal: enhancedElement,
    };
}
