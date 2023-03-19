import { define } from 'be-decorated/DE.js';
import { register } from "be-hive/register.js";
export class BeLinked extends EventTarget {
    async camelToCanonical(pp) {
        const { camelConfig } = pp;
        const { arr } = await import('be-decorated/cpu.js');
        const camelConfigArr = arr(camelConfig);
        for (const cc of camelConfigArr) {
            const { Link } = cc;
            console.log({ Link });
            if (Link !== undefined) {
                for (const linkCamelString of Link) {
                    const test = reShortDownLinkStatement.exec(linkCamelString);
                    console.log({ test });
                }
            }
        }
        return {};
    }
    async onCanonical(pp, mold) {
        return mold;
    }
}
const reShortDownLinkStatement = /^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)Of(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)Of(?<downstreamCamelQry>\w+)/;
const tagName = 'be-linked';
const ifWantsToBe = 'linked';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: ['camelConfig', 'canonicalConfig'],
            primaryProp: 'camelConfig',
            parseAndCamelize: true,
            camelizeOptions: {
            //TODO
            },
            primaryPropReq: true,
        },
        actions: {
            camelToCanonical: 'camelConfig',
            onCanonical: {
                ifAllOf: ['canonicalConfig', 'camelConfig'],
                returnObjMold: {
                    resolved: true,
                }
            }
        }
    },
    complexPropDefaults: {
        controller: BeLinked
    }
});
register(ifWantsToBe, upgrade, tagName);
