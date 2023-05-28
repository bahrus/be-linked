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
        const { camelConfig, enhancedElement, parsedFrom } = self;
        if (parsedFrom !== undefined) {
            const canonicalConfig = cachedCanonicals[parsedFrom];
            if (canonicalConfig !== undefined) {
                return {
                    canonicalConfig
                };
            }
        }
        const { arr } = await import('be-enhanced/cpu.js');
        const camelConfigArr = arr(camelConfig);
        let mergedSettings;
        const canonicalConfig = {
            links: [],
            settings: mergedSettings,
        };
        const { links } = canonicalConfig;
        for (const cc of camelConfigArr) {
            const { Link, Negate, Clone, Refer, Assign, On, When, links: cc_downlinks, Fire, settings, Observe, Share, } = cc;
            if (Fire !== undefined) {
                const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
                cc.fire = Fire.map(s => camelToLisp(s));
            }
            if (cc_downlinks !== undefined) {
                cc_downlinks.forEach(link => links.push(link));
            }
            if (Link || Negate || Clone || Refer !== undefined) {
                const { prsLink } = await import('./prsLink.js');
                await prsLink(cc, links, self);
            }
            if (On !== undefined) {
                const { prsOn } = await import('./prsOn.js');
                await prsOn(cc, links, self);
            }
            if (When !== undefined) {
                const { prsWhen } = await import('./prsWhen.js');
                await prsWhen(cc, links, self);
            }
            if (Observe !== undefined) {
                const { prsObj } = await import('./prsObs.js');
                await prsObj(cc, links, self);
            }
            if (Share !== undefined) {
                const { prsShare } = await import('./prsShare.js');
                await prsShare(cc, links, self);
            }
            if (settings !== undefined) {
                const { enh } = settings;
                if (enh !== undefined) {
                    if (mergedSettings === undefined)
                        mergedSettings = {};
                    if (mergedSettings.enh === undefined)
                        mergedSettings.enh = {};
                    Object.assign(mergedSettings.enh, enh);
                }
            }
        }
        canonicalConfig.settings = mergedSettings;
        if (parsedFrom !== undefined) {
            cachedCanonicals[parsedFrom] = canonicalConfig;
        }
        return {
            canonicalConfig
        };
    }
    async onCanonical(self) {
        const { canonicalConfig } = self;
        const { links, settings } = canonicalConfig;
        if (links !== undefined) {
            const passableLinks = links.filter(link => link.observe === undefined && link.share === undefined);
            if (passableLinks.length > 0) {
                const { pass } = await import('./pass.js');
                for (const link of links) {
                    //await pass(self, link);
                    pass(self, link); // avoid render blocking
                }
            }
            const observableLinks = links.filter(link => link.observe !== undefined);
            if (observableLinks.length > 0) {
                const { observe } = await import('./observe.js');
                for (const observableLink of observableLinks) {
                    observe(self, observableLink);
                }
            }
            const shareableLinks = links.filter(link => link.share !== undefined);
            if (shareableLinks.length > 0) {
                const { share } = await import('./share.js');
                for (const shareableLink of shareableLinks) {
                    share(self, shareableLink);
                }
            }
        }
        if (settings !== undefined) {
            const { doSettings } = await import('./doSettings.js');
            doSettings(settings, this.enhancedElement);
        }
        return {
            resolved: true
        };
    }
}
const cachedCanonicals = {};
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
            ...propInfo,
            propertyBag: {
                parse: false,
            }
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
