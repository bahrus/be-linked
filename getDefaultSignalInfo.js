export function getDefaultSignalInfo(enhancedElement) {
    const { localName } = enhancedElement;
    switch (localName) {
        case 'input':
            return {
                eventTarget: enhancedElement,
                signalRef: enhancedElement,
                type: 'input'
            };
    }
    throw 'NI';
}
export function getDefaultRemoteRule(downstreamEl) {
    return {
        remoteType: '/',
        //TODO:  move this evaluation to be-linked -- shared with be-bound
        remoteProp: downstreamEl.getAttribute('itemprop') || downstreamEl.name || downstreamEl.id,
    };
}
