export function getRemoteProp(enhancedElement) {
    if (enhancedElement.hasAttribute('itemprop')) {
        return enhancedElement.getAttribute('itemprop')?.split(' ')[0];
    }
    return enhancedElement.name || enhancedElement.id;
}
export async function getLocalSignal(enhancedElement, beVigilant = false) {
    const { localName } = enhancedElement;
    switch (localName) {
        case 'input': {
            const { type } = enhancedElement;
            const signal = enhancedElement;
            switch (type) {
                case 'number':
                    return {
                        prop: 'valueAsNumber',
                        signal,
                        type: localName
                    };
                case 'checkbox':
                    return {
                        prop: 'checked',
                        signal,
                        type: localName
                    };
                default:
                    return {
                        prop: 'value',
                        signal,
                        type: localName
                    };
            }
            break;
        }
        case 'form': {
            return {
                prop: 'formData',
                signal: enhancedElement,
                type: 'input',
            };
        }
    }
    if (enhancedElement.hasAttribute('contenteditable')) {
        return {
            prop: 'textContent',
            signal: enhancedElement,
            type: 'input'
        };
    }
    if (localName.includes('-'))
        throw 'NI';
    import('be-value-added/be-value-added.js');
    const signal = await enhancedElement.beEnhanced.whenResolved('be-value-added');
    signal.beVigilant = beVigilant;
    return {
        prop: 'value',
        signal,
        type: 'value',
    };
    // default:
    // localProp = enhancedElement.getAttribute('itemprop');
    // if(localProp === null) throw 'itemprop not specified';
}
