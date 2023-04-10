import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {register} from "be-hive/register.js";
import {Actions, PP, PPP, PPPP, Proxy, CamelConfig, CanonicalConfig, Link, LinkStatement, ParseOptions} from './types';


export class BeLinked extends EventTarget implements Actions{
    async camelToCanonical(pp: PP): PPPP {
        const {camelConfig, self} = pp;
        
        const {arr} = await import('be-decorated/cpu.js');
        const camelConfigArr = arr(camelConfig);
        const canonicalConfig: CanonicalConfig = {
            links: []
        };
        const {links} = canonicalConfig;
        for(const cc of camelConfigArr){
            const {Link, Negate, Clone, Refer, Assign, On, When, links: cc_downlinks, Fire} = cc;
            if(Fire !== undefined){
                const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
                cc.fire = Fire.map(s => camelToLisp(s));
            }
            if(cc_downlinks !== undefined){
                cc_downlinks.forEach(link => links.push(link))
            }
            if(Link || Negate || Clone || Refer !== undefined){
                const {doLink} = await import('./doLink.js');
                await doLink(cc, links);
            }
            if(On !== undefined){
                const {doOn} = await import('./doOn.js');
                await doOn(cc, links, pp);
            }
            if(When !== undefined){
                const {doWhen} = await import('./doWhen.js');
                await doWhen(cc, links, pp);
            }
        }
        
        return {
            canonicalConfig
        };
    }

    async onCanonical(pp: PP, mold: PPP): PPPP {
        const {canonicalConfig} = pp;
        const {links} = canonicalConfig!;
        if(links !== undefined){
            const {pass} = await import('./pass.js');
            for(const link of links){
                await pass(pp, link);
            }

        }
        return mold;
    }

}



// const reTraditional = 
// /^(?<eventName>\w+)Of(?<upstreamCamelQry>\w+)DoPass(?<upstreamPropPath>)To(?<downstreamPropPath>[\w\\\:]+)PropertyOfAdornedElement/;

const tagName = 'be-linked';
const ifWantsToBe = 'linked';
const upgrade = '*';

define<Proxy & BeDecoratedProps<Proxy, Actions, CamelConfig>, Actions>({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: ['camelConfig', 'canonicalConfig'],
            primaryProp: 'camelConfig',
            parseAndCamelize: true,
            camelizeOptions: {
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


