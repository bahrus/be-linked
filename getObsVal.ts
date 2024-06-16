import { Specifier } from 'trans-render/dss/types';
import {SignalRefType} from './types';

export async function getObsVal(remoteRef: SignalRefType, specifier: Specifier, enhancedElement: Element): Promise<any>{
    let remoteVal: any;
    const {s, prop} = specifier;
    switch(s){
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
            if(prop !== undefined){
                remoteVal = (<any>remoteRef)[prop];
            }else{
                const { getSubProp } = await import('trans-render/dss/find.js');
                const dynSubProp = getSubProp(specifier, enhancedElement as HTMLElement);
                if(dynSubProp){
                    const head = dynSubProp[0];
                    if(head === '.'){
                        throw 'NI';
                    }else{
                        remoteVal = (<any>remoteRef)[dynSubProp];
                    }
                
                }
            }

            break;
        default:
            throw 'NI';
    }
    return remoteVal;
}