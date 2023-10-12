export function getDefaultSignalInfo(enhancedElement: Element): SignalInfo{
    const {localName} = enhancedElement;
    switch(localName){
        case 'input':
            return {
                eventTarget: enhancedElement,
                type: 'input'
            }
    }
    throw 'NI';
}