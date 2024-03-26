import { findRealm } from 'trans-render/lib/findRealm.js';
export class Seeker {
    elO;
    doCallback;
    constructor(elO, doCallback) {
        this.elO = elO;
        this.doCallback = doCallback;
    }
    val;
    async do(self, ctx, enhancedElement) {
        const { elO } = this;
        const { event, prop, elType, perimeter, marker, scope } = elO;
        let signal = undefined;
        let eventSuggestion = undefined;
        let signalRef = await findRealm(enhancedElement, scope);
        let propagator = undefined;
        switch (elType) {
            case '|':
                if (signalRef.hasAttribute('contenteditable')) {
                    signal = new WeakRef(signalRef);
                    eventSuggestion = 'input';
                }
                else {
                    [signalRef, signal, eventSuggestion] = await this.addValue(signalRef);
                }
                break;
            case '@':
            case '#': {
                if (!signalRef)
                    throw 404;
                signal = new WeakRef(signalRef);
                eventSuggestion = event || 'input';
                break;
            }
            case '~':
            case '-':
            case '/': {
                let propToSubscribeTo = prop;
                switch (elType) {
                    case '~': {
                        //TODO:  the line below is likely to appear elsewhere, share it
                        const { getSubProp } = await import('trans-render/lib/prs/prsElO.js');
                        const subPropToConsider = getSubProp(elO, enhancedElement);
                        const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
                        const localName = camelToLisp(prop);
                        const { substrBefore } = await import('trans-render/lib/substrBefore.js');
                        propToSubscribeTo = substrBefore(substrBefore(subPropToConsider, '.'), '|');
                    }
                }
                await customElements.whenDefined(signalRef.localName);
                import('be-propagating/be-propagating.js');
                const bePropagating = await signalRef.beEnhanced.whenResolved('be-propagating');
                const signal2 = await bePropagating.getSignal(prop);
                propagator = signal2.propagator;
                eventSuggestion = propToSubscribeTo;
                signal = new WeakRef(signalRef);
                break;
            }
        }
        if (this.doCallback && signalRef !== undefined && eventSuggestion !== undefined) {
            await this.callback(self, signalRef, eventSuggestion, ctx);
        }
        return {
            signal,
            eventSuggestion,
            propagator,
        };
    }
    async callback(self, signalRef, eventSuggestion, onOrOff) {
    }
    async addValue(signalRef) {
        import('be-value-added/be-value-added.js');
        const newSignalRef = await signalRef.beEnhanced.whenResolved('be-value-added');
        const signal = new WeakRef(newSignalRef);
        return [newSignalRef, signal, 'value'];
    }
}
