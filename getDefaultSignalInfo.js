//this seems to be a duplicate of defaults.ts
export function getDefaultSignalInfo(enhancedElement) {
    const { localName } = enhancedElement;
    switch (localName) {
        case 'input':
            return {
                eventTarget: enhancedElement,
                signalRef: enhancedElement,
                type: 'input'
            };
        default:
            if (enhancedElement.hasAttribute('contenteditable')) {
                throw 'NI';
            }
            throw 'NI';
    }
}
// export function getDefaultRemoteRule(downstreamEl: Element){
//     return {
//         remoteType: '/',
//         //TODO:  move this evaluation to be-linked -- shared with be-bound
//         remoteProp: downstreamEl.getAttribute('itemprop') || (downstreamEl as any).name || downstreamEl.id,
//     } as RemoteRule
// }
