import {AllProps} from 'be-intl/types';
import {Actions as bePropagatingActions} from 'be-propagating/types';
import {Actions as beScopedActions} from 'be-scoped/types';
import {AllProps as BeRepeatedAllProps, EndUserProps as BeRepeatedEndUserProps, Row} from 'be-repeated/types';
export async function setItemProp(el: Element, val: any, name: string){
    if(val === undefined) return;
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
            if(el.classList.contains('ignore')) {
                //console.log('iah');
                //return;
            }
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
            if(el.hasAttribute('itemscope')){
                if(Array.isArray(val)){
                    //loop scenario
                    import('be-repeated/be-repeated.js');
                    const beRepeated = await aSrc.beEnhanced.whenResolved('be-repeated') as BeRepeatedAllProps;
                    beRepeated.rowHandler = async (row: Row) => {
                        await handleRow(row, val);
                    }
                    Object.assign(beRepeated, {
                        startIdx: 1,
                        endIdx: val.length,
                        templIdx: 0
                    } as BeRepeatedEndUserProps);
                }else{
                    
                    if(val.constructor.toString().startsWith('class ')){
                        //use propagator
                        import('be-propagating/be-propagating.js');
                        const bePropagating = await aSrc.beEnhanced.whenResolved('be-propagating') as bePropagatingActions;
                        bePropagating.setKeyVal(name, val);
                    }else{
                        //assign into scope
                        import('be-scoped/be-scoped.js');
                        const beScoped = await aSrc.beEnhanced.whenResolved('be-scoped') as beScopedActions;
                        beScoped.setKeyVal(name, val);
                    }
                }
            }else{
                el.textContent = toString(val, 40);// JSON.stringify(val, null, 2);
            }


            break;
        default:
            throw 'NI';
    }

}

function toString(obj: any, max: number){
    let ret = JSON.stringify(obj, null, 2);
    if(ret.length > max * 2){
        ret = ret.substring(0, max) + '...' + ret.substring(ret.length - max);
    }
    return ret;
}

async function handleRow(row: Row, val: any){
    const {idx, children, condition} = row;
    //TODO:  support defer rendering based on condition === existing
    const item = val[idx - 1];
    for(const child of children){
        const itemProp = child.getAttribute('itemprop');
        if(itemProp === 'itemListElement'){
            await setItemProp(child, item, itemProp);
        }
    }
}