import { BE, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
const cache = new Map();
export class BeLinked extends BE {
    static get beConfig() {
        return {
            parse: true,
            primaryProp: 'camelConfig',
            cache,
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
            const { Link, Negate, Clone, Refer, Assign, On, When, links: cc_downlinks, Fire, settings, Observe, Share, Toggle, Elevate, } = cc;
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
            if (Toggle !== undefined) {
                const { prsToggle } = await import('./prsToggle.js');
                await prsToggle(cc, links, self);
            }
            if (Assign !== undefined) {
                const { prsAssign } = await import('./prsAssign.js');
                await prsAssign(cc, links);
            }
            if (Elevate !== undefined) {
                const { prsElevate } = await import('./prsElevate.js');
                await prsElevate(cc, links);
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
        //console.log('start onCanonical', performance.now() );
        const { canonicalConfig } = self;
        const { links, settings } = canonicalConfig;
        if (links !== undefined) {
            const passableLinks = links.filter(link => link.observe === undefined && link.share === undefined);
            if (passableLinks.length > 0) {
                const { pass } = await import('./pass.js');
                for (const link of passableLinks) {
                    pass(self, link); // avoid render blocking
                }
            }
            const observableLinks = links.filter(link => link.observe !== undefined);
            if (observableLinks.length > 0) {
                const { observe } = await import('./observe.js');
                for (const observableLink of observableLinks) {
                    await observe(self, observableLink);
                }
            }
            const shareableLinks = links.filter(link => link.share !== undefined);
            if (shareableLinks.length > 0) {
                const { share } = await import('./share.js');
                for (const shareableLink of shareableLinks) {
                    await share(self, shareableLink, false);
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
export const tagName = 'be-linked';
const xe = new XE({
    config: {
        tagName,
        isEnh: true,
        propDefaults: {
        //...propDefaults
        },
        propInfo: {
            ...propInfo,
            propertyBag: {
                parse: false,
            }
        },
        actions: {
            camelToCanonical: 'camelConfig',
            onCanonical: 'canonicalConfig'
        }
    },
    superclass: BeLinked
});
