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
            const { Link, negate } = cc;
            if (Link !== undefined) {
                const links = await this.#matchStd(Link);
                const { linkStatementsWithSingleArgs, shortDownLinkStatements, parseLinkStatements } = links;
                shortDownLinkStatements.forEach(link => {
                    downlinks.push({
                        target: 'local',
                        negate,
                        ...link
                    });
                });
                parseLinkStatements.forEach(link => {
                    downlinks.push({
                        target: 'local',
                        negate,
                        ...link
                    });
                });
                linkStatementsWithSingleArgs.forEach(link => {
                    const downlink = {
                        target: 'local',
                        ...link,
                    };
                    const { adjustmentVerb, argument } = link;
                    switch (adjustmentVerb) {
                        case 'subtracting':
                            downlink.translate = -1 * Number(argument);
                            break;
                        case 'adding':
                            downlink.translate = Number(argument);
                            break;
                    }
                    downlinks.push(downlink);
                });
            }
            const { Negate, Clone, Refer } = cc;
            if (Negate !== undefined) {
                await this.#merge(Negate, {
                    target: 'local',
                    negate: true
                }, downlinks);
            }
            if (Clone !== undefined) {
                await this.#merge(Clone, {
                    target: 'local',
                    clone: true
                }, downlinks);
            }
            if (Refer !== undefined) {
                await this.#merge(Refer, {
                    target: 'local',
                    refer: true
                }, downlinks);
            }
            const { Use } = cc;
            if (Use !== undefined) {
                const prev = self.previousElementSibling;
                if (!(prev instanceof HTMLScriptElement))
                    throw 'bL.404';
                const { doBeHavings } = await import('trans-render/lib/doBeHavings.js');
                import('be-exportable/be-exportable.js');
                const prevScriptElement = self.previousElementSibling;
                await doBeHavings(prevScriptElement, [{
                        be: 'exportable',
                        waitForResolved: true,
                    }]);
                const exports = prevScriptElement._modExport;
                const { tryParse } = await import('be-decorated/cpu.js');
                for (const useStatement of Use) {
                    const test = tryParse(useStatement, reUseStatement);
                    console.log({ useStatement, reUseStatement, test });
                    if (test !== null) {
                        const { upstreamCamelQry, upstreamPropPath, exportSymbol } = test;
                        const downlink = {
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
    async #merge(Links, mergeObj, downlinks) {
        const links = await this.#matchStd(Links);
        const { shortDownLinkStatements } = links;
        shortDownLinkStatements.forEach(link => {
            downlinks.push({
                ...mergeObj,
                ...link
            });
        });
    }
    async #matchStd(links) {
        const { tryParse } = await import('be-decorated/cpu.js');
        const shortDownLinkStatements = [];
        const linkStatementsWithSingleArgs = [];
        const parseLinkStatements = [];
        for (const linkCamelString of links) {
            let test = tryParse(linkCamelString, reLinkStatementWithSingleArgVerb);
            if (test !== null) {
                test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
                linkStatementsWithSingleArgs.push(test);
                continue;
            }
            test = tryParse(linkCamelString, reParseLinkStatement);
            console.log({ linkCamelString, reParseLinkStatement, test });
            if (test !== null) {
                test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
                parseLinkStatements.push(test);
                continue;
            }
            test = tryParse(linkCamelString, reShortDownLinkStatement);
            if (test !== null) {
                test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
                shortDownLinkStatements.push(test);
                continue;
            }
        }
        return {
            shortDownLinkStatements,
            linkStatementsWithSingleArgs,
            parseLinkStatements,
        };
    }
    #parseVal(val, option) {
        console.log({ option, val });
        if (option === undefined)
            return val;
        debugger;
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
    async onCanonical(pp, mold) {
        const { canonicalConfig, self, proxy } = pp;
        const { downlinks } = canonicalConfig;
        if (downlinks !== undefined) {
            const { findRealm } = await import('trans-render/lib/findRealm.js');
            const { getVal } = await import('trans-render/lib/getVal.js');
            const { setProp } = await import('trans-render/lib/setProp.js');
            for (const downlink of downlinks) {
                const { upstreamCamelQry, skipInit, upstreamPropPath, target, downstreamPropPath, negate, translate, parseOption, handler } = downlink;
                const src = await findRealm(self, upstreamCamelQry);
                const targetObj = target === 'local' ? self : proxy;
                if (src === null)
                    throw 'bL.404';
                if (!skipInit) {
                    let val = this.#parseVal(await getVal({ host: src }, upstreamPropPath), parseOption);
                    if (negate)
                        val = !val;
                    if (translate)
                        val = Number(val) + translate;
                    //console.log({targetObj, downstreamPropPath, val});
                    if (downstreamPropPath !== undefined) {
                        await setProp(targetObj, downstreamPropPath, val);
                    }
                    else if (handler !== undefined) {
                        const objToMerge = await handler({
                            remoteInstance: src
                        });
                        Object.assign(targetObj, objToMerge);
                    }
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
                    let val = this.#parseVal(await getVal({ host: src }, upstreamPropPath), parseOption);
                    if (negate)
                        val = !val;
                    if (translate)
                        val = Number(val) + translate;
                    await setProp(targetObj, downstreamPropPath, val);
                });
            }
        }
        return mold;
    }
}
const reShortDownLinkStatement = /^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;
const reLinkStatementWithSingleArgVerb = /^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElementAfter(?<adjustmentVerb>Subtracting|Adding|ParsingAs|MultiplyingBy|DividingBy|Mod)(?<argument>\w+)/;
const reParseLinkStatement = /^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyAs(?<parseOption>Number|Date|String|Object|Url|RegExp)Of(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;
const reUseStatement = /^(?<exportSymbol>\w+)ImportToManage(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyChangesOf(?<upstreamCamelQry>\w+)/;
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
