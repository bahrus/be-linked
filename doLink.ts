import {CamelConfig, DownLink, LinkStatement} from './types';

export async function doLink(cc: CamelConfig, downlinks: DownLink[]){
    const {Link, negate, debug, nudge, skip} = cc;
    const defaultDownlink = {
        target: 'local',
        passDirection: 'down',
        negate,
        debug,
        nudge,
        skipInit: skip,
    } as DownLink;
    if(Link !== undefined){
        const links = await matchStd(Link);
        const {linkStatementsWithSingleArgs, shortDownLinkStatements, parseLinkStatements, simplestLinkStatements} = links;
        shortDownLinkStatements.forEach(link => {
            downlinks.push({
                ...defaultDownlink,
                ...link
            } as DownLink);
        });
        parseLinkStatements.forEach(link => {
            downlinks.push({
                ...defaultDownlink,
                ...link
            } as DownLink);
        });
        linkStatementsWithSingleArgs.forEach(link => {
            const downlink = {
                ...defaultDownlink,
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
        });
        simplestLinkStatements.forEach(link => {
            const downlink = {
                target: 'local',
                downstreamPropPath: link.props,
                upstreamCamelQry: 'host',
                upstreamPropPath: link.props
            } as DownLink;
            downlinks.push(downlink);
        });
        const {Negate, Clone, Refer} = cc;
        if(Negate !== undefined){
            await merge(Negate, {
                target: 'local',
                negate: true
            } as Partial<DownLink>, downlinks);
        }
        if(Clone !== undefined){
            await merge(Clone, {
                target: 'local',
                clone: true
            }, downlinks);
        }
        if(Refer !== undefined){
            await merge(Refer,  {
                target: 'local',
                refer: true
                
            }, downlinks);
        }
    }

}

async function matchStd(links: LinkStatement[]){
    const {tryParse} = await import('be-decorated/cpu.js');
    const shortDownLinkStatements: ShortDownLinkStatementGroup[] = [];
    const linkStatementsWithSingleArgs: LinkStatementWithSingleArgVerbGroup[] = [];
    const parseLinkStatements: ParseLinkStatement[] = [];
    const simplestLinkStatements: SimplestStatementGroup[] = [];
    for(const linkCamelString of links){
        let test = tryParse(linkCamelString, reLinkStatementWithSingleArgVerb);
        if(test !== null){
            test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
            linkStatementsWithSingleArgs.push(test);
            continue;
        }
        test = tryParse(linkCamelString, reParseLinkStatement);
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
        test = tryParse(linkCamelString, reSimplest) as SimplestStatementGroup | null;
        if(test !== null){
            simplestLinkStatements.push(test);
        }
    }
    return {
        shortDownLinkStatements,
        linkStatementsWithSingleArgs,
        parseLinkStatements,
        simplestLinkStatements,
    }
}

async function merge(Links: LinkStatement[], mergeObj: Partial<DownLink>, downlinks: DownLink[]){
    const links = await matchStd(Links);
    const {shortDownLinkStatements} = links;
    shortDownLinkStatements.forEach(link => {
        downlinks.push({
            ...mergeObj,
            ...link
        } as DownLink);
    });
}

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

interface SimplestStatementGroup {
    props: string;
}

const reSimplest = /^(?<props>\w+)Props/;
const reShortDownLinkStatement = /^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;
const reLinkStatementWithSingleArgVerb = 
/^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElementAfter(?<adjustmentVerb>Subtracting|Adding|ParsingAs|MultiplyingBy|DividingBy|Mod)(?<argument>\w+)/;
const reParseLinkStatement = 
/^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)(?<!\\)As(?<parseOption>Number|Date|String|Object|Url|RegExp)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;