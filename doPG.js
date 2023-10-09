import 'be-propagating/be-propagating.js';
export async function doPG(self, el, signalContainer, signalProp, prop, abortControllers, evalFn, triggerSrc) {
    const bePropagating = await el.beEnhanced.whenResolved('be-propagating');
    const signal = await bePropagating.getSignal(prop);
    signalContainer[signalProp] = new WeakRef(signal);
    const ab = new AbortController();
    abortControllers.push(ab);
    signal.addEventListener('value-changed', async () => {
        if (self.resolved) {
            evalFn(self, triggerSrc);
        }
        else {
            await self.whenResolved();
            evalFn(self, triggerSrc);
        }
    }, { signal: ab.signal });
}
