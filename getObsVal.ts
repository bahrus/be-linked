import {SignalRefType} from './types';
import { ElO } from 'trans-render/lib/prs/types';

export async function getObsVal(remoteRef: SignalRefType, elO: ElO, enhancedElement: Element): any{
    let remoteVal: any;
    const {elType, prop} = elO;
    //TODO:  Generic code.  Share with be-bound/Bind.js/#reconcileValues
    switch(elType){
        case '|':
        case '#':
        case '@':{
            const {getSignalVal} = await import('./getSignalVal.js');
            remoteVal = getSignalVal(remoteRef);
        }
        break;
        case '-':
        case '/':
            remoteVal = (<any>remoteRef)[prop!];
            break;
        case '~':
            const { getSubProp } = await import('trans-render/lib/prs/prsElO.js');
            const dynSubProp = getSubProp(elO, enhancedElement as HTMLElement);
            if(dynSubProp){
                const head = dynSubProp[0];
                if(head === '.'){
                    throw 'NI';
                }else{
                    remoteVal = (<any>remoteRef)[dynSubProp];
                }
            
            }
            break;
        default:
            throw 'NI';
    }
    return remoteVal;
}