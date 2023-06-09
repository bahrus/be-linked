import { toDownstreamGateway } from './reCommon.js';
import {CamelConfig, Link, LinkStatement, ParseOptions, MathOp, AllProps} from './types';
import {Scope} from 'trans-render/lib/types';
import {Enhancement, RegExpOrRegExpExt} from 'be-enhanced/types';

export async function prsLink(cc: CamelConfig, downlinks: Link[], ap: AllProps){
    const {Link, negate, debug, nudge, skip, Clone, Refer, Negate} = cc;
    const defaultDownlink = {
        localInstance: 'local',
        passDirection: 'towards',
        negate,
        debug,
        nudge,
        skipInit: skip,
    } as Link;
    if(Link !== undefined){
        await processLinkStatements(Link, defaultDownlink, downlinks, ap);
    }
    if(Clone !== undefined){
        await processLinkStatements(Clone, {...defaultDownlink, clone: true}, downlinks, ap);
    }
    if(Refer !== undefined){
        await processLinkStatements(Refer, {...defaultDownlink, refer: true}, downlinks, ap);
    }
    if(Negate !== undefined){
        await processLinkStatements(Negate, {...defaultDownlink, negate: true}, downlinks, ap);
    }

}

async function processLinkStatements(Link: LinkStatement[], defaultDownlink: Link, downlinks: Link[], ap: AllProps){
    const linkStatementGroups = await matchLSGs(Link, ap);
    for(const link of linkStatementGroups){
        const downloadLink = toDownLink(link, defaultDownlink);
        downlinks.push(downloadLink);
    }
    const simpleStatementGroups = await matchSSGs(Link);
    for(const link of simpleStatementGroups){
        const {props} = link;
        downlinks.push({
            ...defaultDownlink,
            upstreamPropPath: props,
            downstreamPropPath: props,
            upstreamCamelQry: 'host',
        } as Link)
    }
}

function toDownLink(lsg: LinkStatementGroup, defaultDownlink: Link): Link{
    const {
        downstreamPropPath, 
        upstreamCamelQry, 
        upstreamPropPath, 
        mathArg, 
        mathOp, 
        parseOption,
        enhancement,
    } = lsg;
    const downLink: Link = {
        ...defaultDownlink,
        downstreamPropPath,
        upstreamCamelQry,
        upstreamPropPath,
        enhancement,
        parseOption
    };
    let mathArgN = 0;
    if(mathOp && mathArg){
        mathArgN = Number(mathArg);
    }
    switch(mathOp){
        case '+':
            downLink.translate = mathArgN;
            break;
        case '-':
            downLink.translate = -1 * mathArgN;
            break;
    }
    return downLink;
}



async function matchLSGs(links: LinkStatement[], ap: AllProps){
    const {tryParse} = await import('be-enhanced/cpu.js');
    const {adjustLink} = await import('./adjustLink.js');
    const returnObj: LinkStatementGroup[] = []; 
    const {upstream, parseOption, mathOpArg, toDownstream} = await import('./reCommon.js');
    const reArr = [
        new RegExp(String.raw `${upstream}${parseOption}${mathOpArg}${toDownstream}`),
        new RegExp(String.raw `${upstream}${parseOption}${toDownstream}`),
        new RegExp(String.raw `${upstream}${mathOpArg}${toDownstream}`),
        new RegExp(String.raw `${upstream}${toDownstreamGateway}`),
        new RegExp(String.raw `${upstream}${toDownstream}`)
    ];
    for(const linkCamelString of links){
        const test = tryParse(linkCamelString, reArr);
        if(test !== null){
            await adjustLink(test as Link, ap);
            returnObj.push(test);
            continue;
        }
        
    }
    return returnObj;
}

async function matchSSGs(links: LinkStatement[]){
    const {tryParse} = await import('be-enhanced/cpu.js');
    const returnObj: SimplestStatementGroup[] = [];
    for(const linkCamelString of links){
        const test = tryParse(linkCamelString, reSimplest);
        if(test !== null){
            returnObj.push(test);
        }
    }
    return returnObj;
}

interface LinkStatementGroup {
    upstreamPropPath: string,
    enhancement: Enhancement,
    upstreamCamelQry: Scope & string,
    downstreamPropPath: string,
    mathOp?: MathOp,
    mathArg?: string,
    parseOption?: ParseOptions, 
}



interface LinkStatementWithSingleArgVerbGroup extends LinkStatementGroup{
    adjustmentVerb: 'subtracting' | 'adding' | 'parsingAs' | 'multiplyingBy' | 'dividingBy' | 'mod',
    argument: string,
}



interface SimplestStatementGroup {
    props: string;
}

const reSimplest = /^(?<props>\w+)Props/;






