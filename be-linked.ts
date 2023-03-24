import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {register} from "be-hive/register.js";
import {Actions, PP, PPP, PPPP, Proxy, CamelConfig, CanonicalConfig, DownLink, LinkStatement, ParseOptions} from './types';


export class BeLinked extends EventTarget implements Actions{
    async camelToCanonical(pp: PP): PPPP {
        const {camelConfig, self} = pp;
        const {arr} = await import('be-decorated/cpu.js');
        const camelConfigArr = arr(camelConfig);
        const canonicalConfig: CanonicalConfig = {
            downlinks: []
        };
        const {downlinks} = canonicalConfig;
        for(const cc of camelConfigArr){
            const {Link, Negate, Clone, Refer, downlinks: cc_downlinks} = cc;
            if(cc_downlinks !== undefined){
                downlinks.concat(...cc_downlinks);
            }
            if(Link || Negate || Clone || Refer !== undefined){
                const {doLink} = await import('./doLink.js');
                await doLink(cc, downlinks);
            }

            const {Use} = cc;
            if(Use !== undefined){
                //TODO:  async import
                const {doUse} = await import('./doUse.js');
                await doUse(pp, cc, downlinks);
            }
        }
        
        return {
            canonicalConfig
        };
    }







    #parseVal(val: any, option?: ParseOptions){
        if(option === undefined) return val;
        debugger;
        switch(option){
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


    async #doDownlink(pp: PP, downlink: DownLink, ){
        const {canonicalConfig, self, proxy} = pp;
        const {findRealm} = await import('trans-render/lib/findRealm.js');
        const {getVal} = await import('trans-render/lib/getVal.js');
        const {setProp} = await import('trans-render/lib/setProp.js');
        const {
            upstreamCamelQry, skipInit, upstreamPropPath, target, 
            downstreamPropPath, negate, translate, parseOption, handler
        } = downlink;
        const src = await findRealm(self, upstreamCamelQry);
        const targetObj = target === 'local' ? self : proxy;
        if(src === null) throw 'bL.404';
        const doPass = async () => {
            let val = this.#parseVal( await getVal({host: src}, upstreamPropPath), parseOption);
            if(negate) val = !val;
            if(translate) val = Number(val) + translate;
            if(downstreamPropPath !== undefined){
                await setProp(targetObj, downstreamPropPath, val);
            }else if(handler !== undefined){
                const objToMerge = await handler({
                    remoteInstance: src
                });
                Object.assign(targetObj, objToMerge);
            }
        }
        if(!skipInit){
            await doPass();
            
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
            await doPass();
        });
    }
    async onCanonical(pp: PP, mold: PPP): PPPP {
        const {canonicalConfig} = pp;
        const {downlinks} = canonicalConfig!;
        if(downlinks !== undefined){
            for(const downlink of downlinks){
                await this.#doDownlink(pp, downlink);
            }

        }
        return mold;
    }
}

//export type ShortDownLinkStatement = `${upstreamPropPath}Of${upstreamCamelQry}To${downstreamPropPath}Of${TargetStatement}`;




const reTraditional = 
/^(?<eventName>\w+)Of(?<upstreamCamelQry>\w+)DoPass(?<upstreamPropPath>)To(?<downstreamPropPath>[\w\\\:]+)PropertyOfAdornedElement/;

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
                booleans: ['Negate', 'Clone']
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
