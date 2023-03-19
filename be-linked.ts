import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {register} from "be-hive/register.js";
import {Actions, PP, PPP, PPPP, Proxy, CamelConfig, CanonicalConfig, DownLink, LinkStatement} from './types';

export class BeLinked extends EventTarget implements Actions{
    async camelToCanonical(pp: PP): PPPP {
        const {camelConfig} = pp;
        const {arr} = await import('be-decorated/cpu.js');
        const camelConfigArr = arr(camelConfig);
        const canonicalConfig: CanonicalConfig = {
            downlinks: []
        };
        const {downlinks} = canonicalConfig;
        for(const cc of camelConfigArr){
            const {Link} = cc;
            if(Link !== undefined){
                const links = await this.#matchStd(Link, reShortDownLinkStatement);
                links.forEach(link => {
                    downlinks.push({
                        target: 'local',
                        ...link
                    } as DownLink);
                });
                
            }
            const {Negate} = cc;
            if(Negate !== undefined){
                const negates = await this.#matchStd(Negate, reShortDownLinkStatement);
                negates.forEach(link => {
                    downlinks.push({
                        target: 'local',
                        negate: true,
                        ...link
                    } as DownLink);
                });
            }
        }
        
        return {
            canonicalConfig
        };
    }

    async #matchStd(links: LinkStatement[], re: RegExp){
        const {tryParse} = await import('be-decorated/cpu.js');
        const returnObj: ShortDownLinkStatementGroup[] = [];
        for(const linkCamelString of links){
            const test = tryParse(linkCamelString, re) as ShortDownLinkStatementGroup | null;
            if(test !== null) {
                test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
                returnObj.push(test);
            }
        }
        return returnObj;
    }

    async onCanonical(pp: PP, mold: PPP): PPPP {
        const {canonicalConfig, self, proxy} = pp;
        const {downlinks} = canonicalConfig!;
        if(downlinks !== undefined){
            const {findRealm} = await import('trans-render/lib/findRealm.js');
            const {getVal} = await import('trans-render/lib/getVal.js');
            const {setProp} = await import('trans-render/lib/setProp.js');
            for(const downlink of downlinks){
                const {upstreamCamelQry, skipInit, upstreamPropPath, target, downstreamPropPath, negate} = downlink;
                const src = await findRealm(self, upstreamCamelQry);
                const targetObj = target === 'local' ? self : proxy;
                if(src === null) throw 'bL.404';
                if(!skipInit){
                    let val = await getVal({host: src}, upstreamPropPath);
                    if(negate) val = !val;
                    await setProp(targetObj, downstreamPropPath, val);
                }

                let upstreamPropName = downlink.upstreamPropName;
                if(upstreamPropName === undefined){
                    upstreamPropName = upstreamPropPath.split('.')[0];
                    downlink.upstreamPropName = upstreamPropName;
                }
                let propagator: EventTarget | null = null;
                if(!(<any>src)._isPropagating){
                    const aSrc = src as any;
                    if(!aSrc?.beDecorated?.propagating){
                        const {doBeHavings} = await import('trans-render/lib/doBeHavings.js');
                        import('be-propagating/be-propagating.js');
                        await doBeHavings(src as any as Element, [{
                            be: 'propagating',
                            waitForResolved: true,
                        }]);
                    }
                    propagator = aSrc.beDecorated.propagating.propagators.get('self') as EventTarget;
                    
                    //await aSrc.beDecorated.propagating.proxy.controller.addPath('self');
                }else{
                    propagator = src;
                }
                propagator.addEventListener(upstreamPropName, async e => {
                    let val = await getVal({host: src}, upstreamPropPath);
                    if(negate) val = !val;
                    await setProp(targetObj, downstreamPropPath, val);
                });
                
            }

        }
        return mold;
    }
}

//export type ShortDownLinkStatement = `${upstreamPropPath}Of${upstreamCamelQry}To${downstreamPropPath}Of${TargetStatement}`;


interface ShortDownLinkStatementGroup {
    upstreamPropPath: string,
    upstreamCamelQry: string,
    downstreamPropPath: string,
    //downstreamCamelQry: string,
}
const reShortDownLinkStatement = /^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;

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
