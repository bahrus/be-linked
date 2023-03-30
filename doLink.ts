import {CamelConfig, DownLink, LinkStatement} from './types';
import {Scope} from 'trans-render/lib/types';

export async function doLink(cc: CamelConfig, downlinks: DownLink[]){
    const {Link, negate, debug, nudge, skip} = cc;
    const defaultDownlink = {
        localInstance: 'local',
        passDirection: 'towards',
        negate,
        debug,
        nudge,
        skipInit: skip,
    } as DownLink;
    if(Link !== undefined){
        const links = await match(Link);
        for(const link of links){
            const downloadLink = toDownLink(link, defaultDownlink);
            downlinks.push(downloadLink);
        }
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

async function match(links: LinkStatement[]){
    const {tryParse} = await import('be-decorated/cpu.js');
    const returnObj: LinkStatementGroup[] = []; 
    for(const linkCamelString of links){
        let test = tryParse(linkCamelString, reArr);
        if(test !== null){
            test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
            returnObj.push(test);
            continue;
        }
    }
    return returnObj;
}

interface LinkStatementGroup {
    upstreamPropPath: string,
    upstreamCamelQry: Scope & string,
    downstreamPropPath: string,
    mathOp?: '+' | '-' | '*' | '/' | '%',
    mathArg?: string,
    parseOption?: 'number' | 'date' | 'string' | 'object' | 'url' | 'regExp'
}



interface LinkStatementWithSingleArgVerbGroup extends LinkStatementGroup{
    adjustmentVerb: 'subtracting' | 'adding' | 'parsingAs' | 'multiplyingBy' | 'dividingBy' | 'mod',
    argument: string,
}

interface ParseLinkStatement extends LinkStatementGroup {
    parseOption: 'number' | 'date' | 'string' | 'object' | 'url' | 'regExp'
}

interface SimplestStatementGroup {
    props: string;
}

const reSimplest = /^(?<props>\w+)Props/;

const upstream = String.raw `^(?<upstreamPropPath>[\w\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)`;
const parseOption = String.raw `(?<!\\)As(?<parseOption>Number|Date|String|Object|Url|RegExp)`;
const downstream = String.raw `To(?<downstreamPropPath>[\w\:]+)(?<!\\)PropertyOfAdornedElement`;
const mathOpArg = String.raw `(?<mathOp>[-+\%\*\/])(?<mathArg>[0-9][0-9,\.]+)`;

const reArr = [
    new RegExp(String.raw `${upstream}${parseOption}${mathOpArg}${downstream}`),
    new RegExp(String.raw `${upstream}${parseOption}${downstream}`),
    new RegExp(String.raw `${upstream}${mathOpArg}${downstream}`),
    new RegExp(String.raw `${upstream}${downstream}`)
];
