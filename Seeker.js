import { find, getSubProp } from 'trans-render/dss/find.js';
export class Seeker {
    specifier;
    doCallback;
    constructor(specifier, doCallback) {
        this.specifier = specifier;
        this.doCallback = doCallback;
    }
    val;
    async do(self, ctx, enhancedElement) {
        const { specifier } = this;
        const { evt, prop, s, scopeS, ms } = specifier;
        let signal = undefined;
        let eventSuggestion = undefined;
        let signalRef = await find(enhancedElement, specifier);
        let propagator = undefined;
        switch (s) {
            case '|':
                if (signalRef.hasAttribute('contenteditable')) {
                    signal = new WeakRef(signalRef);
                    eventSuggestion = 'input';
                }
                else {
                    [signalRef, signal, eventSuggestion] = await this.addValue(signalRef);
                }
                break;
            case '%':
            case '@':
            case '#': {
                if (!signalRef)
                    throw 404;
                signal = new WeakRef(signalRef);
                eventSuggestion = evt || 'input';
                break;
            }
            case '~':
            case '-':
            case '/': {
                let propToSubscribeTo = prop;
                switch (s) {
                    case '~': {
                        //TODO:  the line below is likely to appear elsewhere, share it
                        const subPropToConsider = getSubProp(specifier, enhancedElement);
                        const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
                        const localName = camelToLisp(prop);
                        const { substrBefore } = await import('trans-render/lib/substrBefore.js');
                        propToSubscribeTo = substrBefore(substrBefore(subPropToConsider, '.'), '|');
                    }
                }
                await customElements.whenDefined(signalRef.localName);
                const { emc } = await import('be-propagating/behivior.js');
                const bePropagating = await signalRef.beEnhanced.whenResolved(emc);
                const signal2 = await bePropagating.getGate(prop);
                propagator = signal2.propagator;
                eventSuggestion = propToSubscribeTo;
                signal = new WeakRef(signalRef);
                break;
            }
        }
        if (this.doCallback && signalRef !== undefined && eventSuggestion !== undefined) {
            await this.callback(self, signalRef, eventSuggestion, propagator, ctx);
        }
        return {
            signal,
            eventSuggestion,
            propagator,
        };
    }
    async callback(self, signalRef, eventSuggestion, propagator, ctx) {
    }
    async addValue(signalRef) {
        const { emc } = await import('be-value-added/behivior.js');
        const newSignalRef = await signalRef.beEnhanced.whenResolved(emc);
        const signal = new WeakRef(newSignalRef);
        return [newSignalRef, signal, 'value'];
    }
}
