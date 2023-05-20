import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
export class BeLinked extends BE {
    static get beConfig() {
        return {
            parse: true,
            primaryProp: 'camelConfig',
            cache: new Map(),
            primaryPropReq: true,
            parseAndCamelize: true,
            camelizeOptions: {
                booleans: ['Debug', 'Skip', 'Nudge']
            },
        };
    }
    async camelToCanonical(self) {
        const { camelConfig, enhancedElement } = self;
        const { arr } = await import('be-decorated/cpu.js');
        const camelConfigArr = arr(camelConfig);
        const canonicalConfig = {
            links: []
        };
        const { links } = canonicalConfig;
        for (const cc of camelConfigArr) {
            const { Link, Negate, Clone, Refer, Assign, On, When, links: cc_downlinks, Fire } = cc;
            if (Fire !== undefined) {
                const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
                cc.fire = Fire.map(s => camelToLisp(s));
            }
            if (cc_downlinks !== undefined) {
                cc_downlinks.forEach(link => links.push(link));
            }
            if (Link || Negate || Clone || Refer !== undefined) {
                const { doLink } = await import('./doLink.js');
                await doLink(cc, links);
            }
            if (On !== undefined) {
                const { doOn } = await import('./doOn.js');
                await doOn(cc, links, self);
            }
            if (When !== undefined) {
                const { doWhen } = await import('./doWhen.js');
                await doWhen(cc, links, self);
            }
        }
        return {
            canonicalConfig
        };
    }
    async onCanonical(self) {
        const { canonicalConfig } = self;
        const { links } = canonicalConfig;
        if (links !== undefined) {
            const { pass } = await import('./pass.js');
            for (const link of links) {
                await pass(self, link);
            }
        }
        return {
            resolved: true
        };
    }
}
const tagName = 'be-linked';
const ifWantsToBe = 'linked';
const upgrade = '*';
const xe = new XE({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults
        },
        propInfo: {
            ...propInfo
        },
        actions: {
            camelToCanonical: 'camelConfig',
            onCanonical: {
                ifAllOf: ['canonicalConfig', 'camelConfig'],
            }
        }
    },
    superclass: BeLinked
});
register(ifWantsToBe, upgrade, tagName);
