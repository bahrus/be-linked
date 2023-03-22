import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {register} from "be-hive/register.js";
import {Actions, PP, PPP, PPPP, Proxy, CamelConfig, CanonicalConfig, DownLink, LinkStatement, ParseOptions} from './types';
import {ExportableScript} from 'be-exportable/types';
import {Scope} from 'trans-render/lib/types';

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
            const {Link, negate} = cc;
            if(Link !== undefined){
                const links = await this.#matchStd(Link);
                const {linkStatementsWithSingleArgs, shortDownLinkStatements, parseLinkStatements} = links;
                shortDownLinkStatements.forEach(link => {
                    downlinks.push({
                        target: 'local',
                        negate,
                        ...link
                    } as DownLink);
                });
                parseLinkStatements.forEach(link => {
                    downlinks.push({
                        target: 'local',
                        negate,
                        ...link
                    } as DownLink);
                });
                linkStatementsWithSingleArgs.forEach(link => {
                    const downlink = {
                        target: 'local',
                        ...link,
                    } as DownLink;
                    const {adjustmentVerb, argument} = link;
                    switch(adjustmentVerb){
                        case 'subtracting':
                            downlink.translate = -1 * Number(argument);
                            break;
                        case 'adding':
                            downlink.translate = Number(argument);
                            break;
                    }
                    downlinks.push(downlink);
                })
                
            }
            const {Negate, Clone, Refer} = cc;
            if(Negate !== undefined){
                await this.#merge(Negate, {
                    target: 'local',
                    negate: true
                } as Partial<DownLink>, downlinks);
            }
            if(Clone !== undefined){
                await this.#merge(Clone, {
                    target: 'local',
                    clone: true
                }, downlinks);
            }
            if(Refer !== undefined){
                await this.#merge(Refer,  {
                    target: 'local',
                    refer: true
                    
                }, downlinks);
            }
            const {Use} = cc;
            if(Use !== undefined){
                const prev = self.previousElementSibling as HTMLScriptElement;
                if(!(prev instanceof HTMLScriptElement)) throw 'bL.404';
                const {doBeHavings} = await import('trans-render/lib/doBeHavings.js');
                import('be-exportable/be-exportable.js');
                const prevScriptElement = self.previousElementSibling as ExportableScript;
                await doBeHavings(prevScriptElement!, [{
                    be: 'exportable',
                    waitForResolved: true,
                }]);
                const exports = prevScriptElement._modExport;
                const {tryParse} = await import('be-decorated/cpu.js');
                for(const useStatement of Use){
                    const test = tryParse(useStatement, reUseStatement) as UseLinkStatement;
                    console.log({useStatement, reUseStatement, test});
                    if(test !== null){
                        const {upstreamCamelQry, upstreamPropPath, exportSymbol} = test;
                        const downlink: DownLink = {
                            target: 'local',
                            upstreamPropPath,
                            upstreamCamelQry,
                            handler: exports[exportSymbol],
                        };
                        downlinks.push(downlink);
                    }
                }
            }
        }
        
        return {
            canonicalConfig
        };
    }

    async #merge(Links: LinkStatement[], mergeObj: Partial<DownLink>, downlinks: DownLink[]){
        const links = await this.#matchStd(Links);
        const {shortDownLinkStatements} = links;
        shortDownLinkStatements.forEach(link => {
            downlinks.push({
                ...mergeObj,
                ...link
            } as DownLink);
        });
    }


    async #matchStd(links: LinkStatement[]){
        const {tryParse} = await import('be-decorated/cpu.js');
        const shortDownLinkStatements: ShortDownLinkStatementGroup[] = [];
        const linkStatementsWithSingleArgs: LinkStatementWithSingleArgVerbGroup[] = [];
        const parseLinkStatements: ParseLinkStatement[] = [];
        for(const linkCamelString of links){
            let test = tryParse(linkCamelString, reLinkStatementWithSingleArgVerb);
            if(test !== null){
                test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
                linkStatementsWithSingleArgs.push(test);
                continue;
            }
            test = tryParse(linkCamelString, reParseLinkStatement);
            console.log({linkCamelString, reParseLinkStatement, test});
            if(test !== null){
                test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
                parseLinkStatements.push(test);
                continue;
            }
            test = tryParse(linkCamelString, reShortDownLinkStatement) as ShortDownLinkStatementGroup | null;
            if(test !== null) {
                test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
                shortDownLinkStatements.push(test);
                continue;
            }
        }
        return {
            shortDownLinkStatements,
            linkStatementsWithSingleArgs,
            parseLinkStatements,
        }
    }

    #parseVal(val: any, option?: ParseOptions){
        console.log({option, val});
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
            //console.log({targetObj, downstreamPropPath, val});
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


interface ShortDownLinkStatementGroup {
    upstreamPropPath: string,
    upstreamCamelQry: string,
    downstreamPropPath: string,
}

interface LinkStatementWithSingleArgVerbGroup extends ShortDownLinkStatementGroup{
    adjustmentVerb: 'subtracting' | 'adding' | 'parsingAs' | 'multiplyingBy' | 'dividingBy' | 'mod',
    argument: string,
}

interface ParseLinkStatement extends ShortDownLinkStatementGroup {
    parseOption: 'number' | 'date' | 'string' | 'object' | 'url' | 'regExp',
}


const reShortDownLinkStatement = /^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;
const reLinkStatementWithSingleArgVerb = 
/^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElementAfter(?<adjustmentVerb>Subtracting|Adding|ParsingAs|MultiplyingBy|DividingBy|Mod)(?<argument>\w+)/;
const reParseLinkStatement = 
/^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyAs(?<parseOption>Number|Date|String|Object|Url|RegExp)Of(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;

interface UseLinkStatement {
    upstreamPropPath: string,
    upstreamCamelQry: Scope,
    exportSymbol: string,
}
const reUseStatement = /^(?<exportSymbol>\w+)ImportToManage(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyChangesOf(?<upstreamCamelQry>\w+)/;

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
