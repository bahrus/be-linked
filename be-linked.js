import { define } from 'be-decorated/DE.js';
import { register } from "be-hive/register.js";
export class BeLinked extends EventTarget {
    async camelToCanonical(pp) {
        const { camelConfig, self } = pp;
        const { arr } = await import('be-decorated/cpu.js');
        const camelConfigArr = arr(camelConfig);
        const canonicalConfig = {
            downlinks: []
        };
        const { downlinks } = canonicalConfig;
        for (const cc of camelConfigArr) {
            const { Link, Negate, Clone, Refer, Assign, On, When, links: cc_downlinks } = cc;
            if (cc_downlinks !== undefined) {
                cc_downlinks.forEach(link => downlinks.push(link));
            }
            if (Link || Negate || Clone || Refer !== undefined) {
                const { doLink } = await import('./doLink.js');
                await doLink(cc, downlinks);
            }
            if (Assign !== undefined) {
                //TODO:  async import
                const { doAssign } = await import('./doAssign.js');
                await doAssign(pp, cc, downlinks);
            }
            if (On !== undefined) {
                const { doOn } = await import('./doOn.js');
                await doOn(cc, downlinks);
            }
            if (When !== undefined) {
                const { doWhen } = await import('./doWhen.js');
                await doWhen(cc, downlinks);
            }
        }
        return {
            canonicalConfig
        };
    }
    async onCanonical(pp, mold) {
        const { canonicalConfig } = pp;
        const { downlinks } = canonicalConfig;
        if (downlinks !== undefined) {
            for (const downlink of downlinks) {
                await this.#doDownlink(pp, downlink);
            }
        }
        return mold;
    }
    async #doDownlink(pp, downlink) {
        const { canonicalConfig, self, proxy } = pp;
        const { findRealm } = await import('trans-render/lib/findRealm.js');
        const { getVal } = await import('trans-render/lib/getVal.js');
        const { setProp } = await import('trans-render/lib/setProp.js');
        const { upstreamCamelQry, skipInit, upstreamPropPath, localInstance, downstreamPropPath, negate, translate, parseOption, handler, conditionValue, newValue, on, debug, nudge, increment, passDirection } = downlink;
        let src = null;
        let dest;
        let srcPropPath;
        let destPropPath;
        const upstreamRealm = await findRealm(self, upstreamCamelQry);
        const downstreamInstance = localInstance === 'local' ? self : proxy;
        switch (passDirection) {
            case 'towards':
                src = upstreamRealm;
                dest = downstreamInstance;
                srcPropPath = upstreamPropPath;
                destPropPath = downstreamPropPath;
                break;
            case 'away':
                src = downstreamInstance;
                srcPropPath = downstreamPropPath;
                destPropPath = upstreamPropPath;
                dest = upstreamRealm;
                break;
        }
        if (src === null)
            throw 'bL.404';
        const doPass = async () => {
            if (debug)
                debugger;
            if (increment) {
                const val = await getVal({ host: dest }, destPropPath);
                await setProp(dest, destPropPath, val + 1);
            }
            else if (handler !== undefined) {
                const objToAssign = await handler({
                    remoteInstance: upstreamRealm,
                    adornedElement: self,
                });
                Object.assign(dest, objToAssign);
            }
            else {
                let val = this.#parseVal(await getVal({ host: src }, srcPropPath), parseOption);
                if (negate)
                    val = !val;
                if (translate)
                    val = Number(val) + translate;
                if (conditionValue !== undefined) {
                    if (val.toString() !== conditionValue.toString())
                        return;
                    if (newValue !== undefined)
                        val = newValue;
                }
                if (destPropPath !== undefined) {
                    await setProp(dest, destPropPath, val);
                }
            }
        };
        if (!skipInit) {
            await doPass();
        }
        let upstreamPropName = downlink.upstreamPropName;
        if (upstreamPropName === undefined && upstreamPropPath !== undefined) {
            upstreamPropName = upstreamPropPath.split('.')[0];
            downlink.upstreamPropName = upstreamPropName;
        }
        if (on !== undefined) {
            const eventTarget = passDirection === 'towards' ? src : self;
            eventTarget.addEventListener(on, async (e) => {
                await doPass();
            });
        }
        else {
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
                await doPass();
            });
        }
        if (nudge && src instanceof Element) {
            const { nudge } = await import('trans-render/lib/nudge.js');
            nudge(src);
        }
    }
    #parseVal(val, option) {
        if (option === undefined)
            return val;
        switch (option) {
            case 'date':
                return new Date(val);
            case 'number':
                return Number(val);
            case 'object':
                return JSON.parse(val);
            case 'string':
                return JSON.stringify(val);
            case 'regExp':
                return new RegExp(val);
            case 'url':
                return new URL(val);
        }
    }
}
//export type ShortDownLinkStatement = `${upstreamPropPath}Of${upstreamCamelQry}To${downstreamPropPath}Of${TargetStatement}`;
const reTraditional = /^(?<eventName>\w+)Of(?<upstreamCamelQry>\w+)DoPass(?<upstreamPropPath>)To(?<downstreamPropPath>[\w\\\:]+)PropertyOfAdornedElement/;
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
                booleans: ['Debug', 'Skip', 'Nudge']
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
export const upstream = String.raw `^(?<upstreamPropPath>[\w\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)`;
export const parseOption = String.raw `(?<!\\)As(?<parseOption>Number|Date|String|Object|Url|RegExp)`;
export const downstream = String.raw `(?<downstreamPropPath>[\w\:]+)(?<!\\)PropertyOfAdornedElement`;
export const toDownstream = String.raw `To${downstream}`;
export const mathOpArg = String.raw `(?<mathOp>[-+\%\*\/])(?<mathArg>[0-9][0-9,\.]+)`;
