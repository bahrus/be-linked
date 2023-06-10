import {AllProps} from 'be-intl/types';
import {Actions as bePropagatingActions} from 'be-propagating/types';
import {Actions as beScopedActions} from 'be-scoped/types';
import {AllProps as BeRepeatedAllProps, EndUserProps as BeRepeatedEndUserProps} from 'be-repeated/types';
export async function setItemProp(el: Element, val: any, name: string){
    let intl: AllProps;
    switch(el.localName){
        case 'data':
        case 'output':
        case 'time':
            import('be-intl/be-intl.js');
            intl = await (<any>el).beEnhanced.whenResolved('be-intl');
            intl.value = val;
            return;
        case 'link':
        case 'meta':
            import('be-it/be-it.js');
            const beIt = await (<any>el).beEnhanced.whenResolved('be-it');
            beIt.value = val;
            return;
    }
    switch(typeof val){
        case 'string':
            if( 'href' in el){
                (<any>el).href = val;
            }else{
                el.textContent = val;//TODO, many more cases to consider
            }
            break;
        case 'number':
        case 'bigint':
        case 'boolean':
        case 'function':
        case 'symbol':
            el.textContent = val.toString();
            break;
        case 'object':
            const aSrc = el as any;
            if(Array.isArray(val)){
                console.log('loop scenario');
                import('be-repeated/be-repeated.js');
                const beRepeated = await aSrc.beEnhanced.whenResolved('be-repeated') as BeRepeatedAllProps;
                beRepeated.addEventListener('newRows', (e: Event) => {
                    console.log({e});
                });
                Object.assign(beRepeated, {
                    startIdx: 1,
                    endIdx: val.length,
                    templIdx: 0
                } as BeRepeatedEndUserProps)
                //loop scenario
            }else{
                
                if(el.hasAttribute('itemscope')){
                    if(val.constructor.toString().startsWith('class ')){
                        import('be-propagating/be-propagating.js');
                        const bePropagating = await aSrc.beEnhanced.whenResolved('be-propagating') as bePropagatingActions;
                        bePropagating.setKeyVal(name, val);
                        //use propagator
                    }else{
                        //assign into scope
                        import('be-scoped/be-scoped.js');
                        const beSpoked = await aSrc.beEnhanced.whenResolved('be-propagating') as beScopedActions;
                        beSpoked.setKeyVal(name, val);
                    }
                }else{
                    el.textContent = JSON.stringify(val, null, 2);
                }

            }

            break;
        default:
            throw 'NI';
    }


    
}