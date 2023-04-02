import { define } from 'be-decorated/DE.js';
import { register } from "be-hive/register.js";
export class BeLinked extends EventTarget {
    async camelToCanonical(pp) {
        const { camelConfig, self } = pp;
        const { arr } = await import('be-decorated/cpu.js');
        const camelConfigArr = arr(camelConfig);
        const canonicalConfig = {
            links: []
        };
        const { links: downlinks } = canonicalConfig;
        for (const cc of camelConfigArr) {
            const { Link, Negate, Clone, Refer, Assign, On, When, links: cc_downlinks, Fire } = cc;
            if (Fire !== undefined) {
                const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
                cc.fire = Fire.map(s => camelToLisp(s));
            }
            if (cc_downlinks !== undefined) {
                cc_downlinks.forEach(link => downlinks.push(link));
            }
            if (Link || Negate || Clone || Refer !== undefined) {
                const { doLink } = await import('./doLink.js');
                await doLink(cc, downlinks);
            }
            if (On !== undefined) {
                const { doOn } = await import('./doOn.js');
                await doOn(cc, downlinks, pp);
            }
            if (When !== undefined) {
                const { doWhen } = await import('./doWhen.js');
                await doWhen(cc, downlinks, pp);
            }
        }
        return {
            canonicalConfig
        };
    }
    async onCanonical(pp, mold) {
        const { canonicalConfig } = pp;
        const { links } = canonicalConfig;
        if (links !== undefined) {
            const { pass } = await import('./pass.js');
            for (const link of links) {
                await pass(pp, link);
            }
        }
        return mold;
    }
}
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
export const toAdorned = String.raw `(?<!\\)ToAdornedElement`;
export const assResOf = String.raw `AssignResultOf(?<exportSymbol>\w+)`;
