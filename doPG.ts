import {SignalContainer} from './types';
import {IBE} from 'be-enhanced/types';
import 'be-propagating/be-propagating.js';
export async function doPG<TSelf extends IBE = IBE>(
    self:  TSelf,
    el: Element,
    signalContainer: SignalContainer,
    signalProp: string,
    prop: string, 
    abortControllers: Array<AbortController>,
    evalFn: (self: TSelf, triggerSrc?: string) => void,
    triggerSrc: string
){
    const bePropagating = await (<any>el).beEnhanced.whenResolved('be-propagating');
    const signal = await bePropagating.getSignal(prop);
    signalContainer[signalProp] = new WeakRef(signal);
    const ab = new AbortController();
    abortControllers?.push(ab);
    signal.addEventListener('value-changed', async () => {
        if(self.resolved){
            evalFn(self, triggerSrc);
        }else{
            await self.whenResolved();
            evalFn(self, triggerSrc);
        }
        
    }, {signal: ab.signal});
}