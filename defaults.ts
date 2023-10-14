export function getRemoteProp(enhancedElement: Element){
    if(enhancedElement.hasAttribute('itemprop')){
        return enhancedElement.getAttribute('itemprop')?.split(' ')[0];
    }
    return (enhancedElement as any).name || enhancedElement.id;
}

export function getLocalProp(enhancedElement: Element){
    const {localName} = enhancedElement;
    let localProp: string | null = 'textContent';
    switch(localName){
        case 'input':
            const {type} = enhancedElement as HTMLInputElement;
            switch(type){
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