import { define } from 'be-decorated/DE.js';
import { register } from "be-hive/register.js";
export class BeLinked extends EventTarget {
    async camelToCanonical(pp) {
        const { camelConfig } = pp;
        const { arr, tryParse } = await import('be-decorated/cpu.js');
        const camelConfigArr = arr(camelConfig);
        const canonicalConfig = {
            downlinks: []
        };
        const { downlinks } = canonicalConfig;
        for (const cc of camelConfigArr) {
            const { Link } = cc;
            console.log({ Link });
            if (Link !== undefined) {
                for (const linkCamelString of Link) {
                    const test = tryParse(linkCamelString, reShortDownLinkStatement);
                    if (test !== null) {
                        const downLink = {
                            target: 'local',
                            ...test
                        };
                        downlinks.push(downLink);
                    }
                }
            }
        }
        return {
            canonicalConfig
        };
    }
    async onCanonical(pp, mold) {
        const { canonicalConfig, self, proxy } = pp;
        console.log({ canonicalConfig });
        const { downlinks } = canonicalConfig;
        if (downlinks !== undefined) {
            const { findRealm } = await import('trans-render/lib/findRealm.js');
            for (const downlink of downlinks) {
                const { upstreamCamelQry, skipInit, upstreamPropPath, target, downstreamPropPath } = downlink;
                const src = await findRealm(self, upstreamCamelQry);
                const targetObj = target === 'local' ? self : proxy;
                if (src === null)
                    throw 'bL.404';
                if (!skipInit) {
                    const { getVal } = await import('trans-render/lib/getVal.js');
                    const val = await getVal({ host: src }, upstreamPropPath);
                    const { setProp } = await import('trans-render/lib/setProp.js');
                    await setProp(targetObj, downstreamPropPath, val);
                }
            }
        }
        return mold;
    }
}
const reShortDownLinkStatement = /^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;
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
