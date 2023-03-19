import { define } from 'be-decorated/DE.js';
import { register } from "be-hive/register.js";
export class BeLinked extends EventTarget {
    async camelToCanonical(pp) {
        const { camelConfig } = pp;
        const { arr } = await import('be-decorated/cpu.js');
        const camelConfigArr = arr(camelConfig);
        const canonicalConfig = {
            downlinks: []
        };
        const { downlinks } = canonicalConfig;
        for (const cc of camelConfigArr) {
            const { Link } = cc;
            if (Link !== undefined) {
                const links = await this.#matchStd(Link, reShortDownLinkStatement);
                links.forEach(link => {
                    downlinks.push({
                        target: 'local',
                        ...link
                    });
                });
            }
            const { Negate } = cc;
            if (Negate !== undefined) {
                const negates = await this.#matchStd(Negate, reShortDownLinkStatement);
                negates.forEach(link => {
                    downlinks.push({
                        target: 'local',
                        negate: true,
                        ...link
                    });
                });
            }
        }
        return {
            canonicalConfig
        };
    }
    async #matchStd(links, re) {
        const { tryParse } = await import('be-decorated/cpu.js');
        const returnObj = [];
        for (const linkCamelString of links) {
            const test = tryParse(linkCamelString, re);
            if (test !== null) {
                test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
                returnObj.push(test);
            }
        }
        return returnObj;
    }
    async onCanonical(pp, mold) {
        const { canonicalConfig, self, proxy } = pp;
        const { downlinks } = canonicalConfig;
        if (downlinks !== undefined) {
            const { findRealm } = await import('trans-render/lib/findRealm.js');
            const { getVal } = await import('trans-render/lib/getVal.js');
            const { setProp } = await import('trans-render/lib/setProp.js');
            for (const downlink of downlinks) {
                const { upstreamCamelQry, skipInit, upstreamPropPath, target, downstreamPropPath, negate } = downlink;
                const src = await findRealm(self, upstreamCamelQry);
                const targetObj = target === 'local' ? self : proxy;
                if (src === null)
                    throw 'bL.404';
                if (!skipInit) {
                    let val = await getVal({ host: src }, upstreamPropPath);
                    if (negate)
                        val = !val;
                    await setProp(targetObj, downstreamPropPath, val);
                }
                let upstreamPropName = downlink.upstreamPropName;
                if (upstreamPropName === undefined) {
                    upstreamPropName = upstreamPropPath.split('.')[0];
                    downlink.upstreamPropName = upstreamPropName;
                }
                let propagator = null;
                if (!src._isPropagating) {
                    const aSrc = src;
                    if (!aSrc?.beDecorated?.propagating) {
                        const { doBeHavings } = await import('trans-render/lib/doBeHavings.js');
                        import('be-propagating/be-propagating.js');
                        await doBeHavings(src, [{
                                be: 'propagating',
                                waitForResolved: true,
                            }]);
                    }
                    propagator = aSrc.beDecorated.propagating.propagators.get('self');
                    //await aSrc.beDecorated.propagating.proxy.controller.addPath('self');
                }
                else {
                    propagator = src;
                }
                propagator.addEventListener(upstreamPropName, async (e) => {
                    let val = await getVal({ host: src }, upstreamPropPath);
                    if (negate)
                        val = !val;
                    await setProp(targetObj, downstreamPropPath, val);
                });
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
