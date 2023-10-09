import {SignalContainer} from './types';
import {BVAAllProps} from 'be-value-added/types';
import {BE} from 'be-enhanced/BE.js';

export async function doVA<TSelf extends BE = BE>(
    self:  TSelf,
    el: Element,
    signalContainer: SignalContainer,
    signalProp: string, 
    abortControllers: Array<AbortController>,
    evalFn: (self: TSelf, triggerSrc?: string) => void,
    triggerSrc: string
    ){
    import('be-value-added/be-value-added.js');
    //const {enhancedElement} = self;
    const beValueAdded = await  (<any>el).beEnhanced.whenResolved('be-value-added') as BVAAllProps & EventTarget;
    signalContainer[signalProp] = new WeakRef<BVAAllProps>(beValueAdded);
    const ab = new AbortController();
    abortControllers.push(ab);
    beValueAdded.addEventListener('value-changed', async e => {
        if(self.resolved){
            evalFn(self, triggerSrc);
        }else{
            await self.whenResolved();
            evalFn(self, triggerSrc);
        }
    }, {signal: ab.signal});
}