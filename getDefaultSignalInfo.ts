import {SignalInfo, RemoteRule} from './types';
export function getDefaultSignalInfo(enhancedElement: Element): SignalInfo{
    const {localName} = enhancedElement;
    switch(localName){
        case 'input':
            return {
                eventTarget: enhancedElement,
                signalRef: enhancedElement,
                type: 'input'
            }
    }
    throw 'NI';
}

export function getDefaultRemoteRule(downstreamEl: Element){
    return {
        remoteType: '/',
        //TODO:  move this evaluation to be-linked -- shared with be-bound
        remoteProp: downstreamEl.getAttribute('itemprop') || (downstreamEl as any).name || downstreamEl.id,
    } as RemoteRule
}