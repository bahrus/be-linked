import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {JSONValue} from 'trans-render/lib/types';
import {Actions, AllProps, AP, PAP, ProPAP, POA, CamelConfig} from './types';
import {register} from 'be-hive/register.js';

export class BeLinked extends BE<AP, Actions> implements Actions{
    static override get beConfig(){
        return {
            parse: true,
            primaryProp: 'camelConfig',
            cache: new Map<string, JSONValue>(),
            primaryPropReq: true,
            parseAndCamelize: true,
            // camelizeOptions: {
            //     doSets: true,
            //     simpleSets: ['Affect', 'Survey', 'Target'],
            //     booleans: ['Itemize'],
            // }
        } as BEConfig<CamelConfig>
    }

    async camelToCanonical(self: this): ProPAP {
    }

    async onCanonical(self: this): ProPAP {
    }
}

export interface BeLinked extends AllProps{}

const tagName = 'be-linked';
const ifWantsToBe = 'linked';
const upgrade = '*';

const xe = new XE<AP, Actions>({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults
        },
        propInfo: {
            ...propInfo
        },
        actions: {

        }
    },
    superclass: BeLinked
});

register(ifWantsToBe, upgrade, tagName);