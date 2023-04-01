import {CamelConfig, DownLink, Link, LinkStatement, ParseOptions, MathOp} from './types';
import {Scope} from 'trans-render/lib/types';
import {upstream, parseOption, toDownstream, mathOpArg} from './be-linked.js';

export async function doLink(cc: CamelConfig, downlinks: DownLink[]){
    const {Link, negate, debug, nudge, skip, Clone, Refer} = cc;
    const defaultDownlink = {
        localInstance: 'local',
        passDirection: 'towards',
        negate,
        debug,
        nudge,
        skipInit: skip,
    } as DownLink;
    if(Link !== undefined){
        processLinkStatements(Link, defaultDownlink, downlinks);
    }
    if(Clone !== undefined){
        processLinkStatements(Clone, {...defaultDownlink, clone: true}, downlinks);
    }
    if(Refer !== undefined){
        processLinkStatements(Refer, {...defaultDownlink, refer: true}, downlinks);
    }

}

async function processLinkStatements(Link: LinkStatement[], defaultDownlink: DownLink, downlinks: DownLink[]){
    const linkStatementGroups = await matchLSGs(Link);
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
        } as DownLink)
    }
}

function toDownLink(lsg: LinkStatementGroup, defaultDownlink: DownLink): DownLink{
    const {downstreamPropPath, upstreamCamelQry, upstreamPropPath, mathArg, mathOp, parseOption} = lsg;
    const downLink: DownLink = {
        ...defaultDownlink,
        downstreamPropPath,
        upstreamCamelQry,
        upstreamPropPath,
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

async function matchLSGs(links: LinkStatement[]){
    const {tryParse} = await import('be-decorated/cpu.js');
    const returnObj: LinkStatementGroup[] = []; 
    for(const linkCamelString of links){
        const test = tryParse(linkCamelString, reArr);
        if(test !== null){
            test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
            returnObj.push(test);
            continue;
        }
        
    }
    return returnObj;
}

async function matchSSGs(links: LinkStatement[]){
    const {tryParse} = await import('be-decorated/cpu.js');
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

// interface ParseLinkStatement extends LinkStatementGroup {
//     parseOption: ParseOptions
// }

interface SimplestStatementGroup {
    props: string;
}

const reSimplest = /^(?<props>\w+)Props/;





const reArr = [
    new RegExp(String.raw `${upstream}${parseOption}${mathOpArg}${toDownstream}`),
    new RegExp(String.raw `${upstream}${parseOption}${toDownstream}`),
    new RegExp(String.raw `${upstream}${mathOpArg}${toDownstream}`),
    new RegExp(String.raw `${upstream}${toDownstream}`)
];
