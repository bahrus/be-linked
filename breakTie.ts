import {SpecificityResult, TriggerSource} from './types';
const typeComp: Map<string, TriggerSource> = new Map([
    ['string.undefined', 'local'],
    ['string.string', 'tie'],
    ['boolean.undefined', 'local'],
    ['string.object', 'remote'],
    ['string.null', 'local']
]);
export function breakTie(localVal: any, remoteVal: any) : SpecificityResult  {
    const localType = typeof localVal;
    const remoteType = remoteVal === null ? 'null' : typeof remoteVal;
    const sameType = localType === remoteType;
    let winner = typeComp.get(`${localType}.${remoteType}`)!;
    let val = localVal;
    switch(winner){
        case 'tie':
            switch(localType){
                case 'string':
                    if(localVal.length > remoteVal.length){
                        winner = 'local';
                        val = localVal;
                    }else{
                        winner = 'remote';
                        val = remoteVal;
                    }
            }
            break;
        case 'remote':
            val = remoteVal;
            break;
    }
    return {
        winner,
        val
    };
}