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
        const { event, prop, elType, perimeter } = elO;
        let signal = undefined;
        let eventSuggestion = undefined;
        let signalRef = undefined;
        let propagator = undefined;
        switch (elType) {
            case '|':
                signalRef = await findRealm(enhancedElement, ['wis', prop]);
                if (signalRef.hasAttribute('contenteditable')) {
                    signal = new WeakRef(signalRef);
                    eventSuggestion = 'input';
                }
                else {
                    [signalRef, signal, eventSuggestion] = await this.addValue(signalRef);
                }
                break;
            case '~':
            case '@':
            case '#': {
                switch (elType) {
                    case '@':
                        if (perimeter !== undefined) {
                            signalRef = await findRealm(enhancedElement, ['wi', perimeter, `[name="${prop}"]`]);
                        }
                        else {
                            signalRef = await findRealm(enhancedElement, ['wf', prop]);
                        }
                        break;
                    case '#':
                        signalRef = await findRealm(enhancedElement, ['wrn', '#' + prop]);
                        break;
                    case '~':
                        const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
                        const localName = camelToLisp(prop);
                        signalRef = await findRealm(enhancedElement, ['wis', localName, true]);
                        break;
                }
                if (!signalRef)
                    throw 404;
                signal = new WeakRef(signalRef);
                eventSuggestion = event || 'input';
                break;
            }
            case '/':
                signalRef = await findRealm(enhancedElement, ['h', true]);
                await customElements.whenDefined(signalRef.localName);
                import('be-propagating/be-propagating.js');
                const bePropagating = await signalRef.beEnhanced.whenResolved('be-propagating');
                const signal2 = await bePropagating.getSignal(prop);
                propagator = signal2.propagator;
                eventSuggestion = prop;
                signal = new WeakRef(signalRef);
                break;
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
        const signal = new WeakRef(signalRef);
        return [newSignalRef, signal, 'value-changed'];
    }
}
