export async function doLink(cc, downlinks) {
    const { Link, negate, debug, nudge, skip } = cc;
    const defaultDownlink = {
        localInstance: 'local',
        passDirection: 'towards',
        negate,
        debug,
        nudge,
        skipInit: skip,
    };
    if (Link !== undefined) {
        const links = await match(Link);
        for (const link of links) {
            const downloadLink = await toDownLink(link, defaultDownlink);
            downlinks.push(downloadLink);
        }
        // const {linkStatementsWithSingleArgs, parseLinkStatements, simplestLinkStatements} = links;
        // // shortDownLinkStatements.forEach(link => {
        // //     downlinks.push({
        // //         ...defaultDownlink,
        // //         ...link
        // //     } as DownLink);
        // // });
        // parseLinkStatements.forEach(link => {
        //     const {asParseOption} = link;
        //     if(asParseOption){
        //         debugger;
        //     }
        //     downlinks.push({
        //         ...defaultDownlink,
        //         ...link
        //     } as DownLink);
        // });
        // linkStatementsWithSingleArgs.forEach(link => {
        //     const downlink = {
        //         ...defaultDownlink,
        //         ...link,
        //     } as DownLink;
        //     const {adjustmentVerb, argument} = link;
        //     switch(adjustmentVerb){
        //         case 'subtracting':
        //             downlink.translate = -1 * Number(argument);
        //             break;
        //         case 'adding':
        //             downlink.translate = Number(argument);
        //             break;
        //     }
        //     downlinks.push(downlink);
        // });
        // simplestLinkStatements.forEach(link => {
        //     const downlink = {
        //         localInstance: 'local',
        //         downstreamPropPath: link.props,
        //         upstreamCamelQry: 'host',
        //         upstreamPropPath: link.props
        //     } as DownLink;
        //     downlinks.push(downlink);
        // });
        // const {Negate, Clone, Refer} = cc;
        // if(Negate !== undefined){
        //     await merge(Negate, {
        //         localInstance: 'local',
        //         negate: true
        //     } as Partial<DownLink>, downlinks);
        // }
        // if(Clone !== undefined){
        //     await merge(Clone, {
        //         localInstance: 'local',
        //         clone: true
        //     }, downlinks);
        // }
        // if(Refer !== undefined){
        //     await merge(Refer,  {
        //         localInstance: 'local',
        //         refer: true
        //     }, downlinks);
        // }
    }
}
async function toDownLink(lsg, defaultDownlink) {
    const { downstreamPropPath, upstreamCamelQry, upstreamPropPath, mathArg, mathOp, parseOption } = lsg;
    const downLink = {
        ...defaultDownlink,
        downstreamPropPath,
        upstreamCamelQry,
        upstreamPropPath,
        parseOption
    };
    let mathArgN = 0;
    if (mathOp && mathArg) {
        mathArgN = Number(mathArg);
    }
    switch (mathOp) {
        case '+':
            downLink.translate = mathArgN;
            break;
        case '-':
            downLink.translate = -1 * mathArgN;
            break;
    }
    return downLink;
}
async function match(links) {
    const { tryParse } = await import('be-decorated/cpu.js');
    //const shortDownLinkStatements: ShortDownLinkStatementGroup[] = [];
    // const linkStatementsWithSingleArgs: LinkStatementWithSingleArgVerbGroup[] = [];
    // const parseLinkStatements: ParseLinkStatement[] = [];
    // const simplestLinkStatements: SimplestStatementGroup[] = [];
    const returnObj = [];
    for (const linkCamelString of links) {
        let test = tryParse(linkCamelString, reArr);
        if (test !== null) {
            test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
            returnObj.push(test);
            continue;
        }
    }
    return returnObj;
}
const reSimplest = /^(?<props>\w+)Props/;
// const reShortDownLinkStatement = 
// /^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;
// const reLinkStatementWithSingleArgVerb = 
// /^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElementAfter(?<adjustmentVerb>Subtracting|Adding|ParsingAs|MultiplyingBy|DividingBy|Mod)(?<argument>\w+)/;
const upstream = String.raw `^(?<upstreamPropPath>[\w\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)`;
const parseOption = String.raw `(?<!\\)As(?<parseOption>Number|Date|String|Object|Url|RegExp)`;
const downstream = String.raw `To(?<downstreamPropPath>[\w\:]+)(?<!\\)PropertyOfAdornedElement`;
const mathOpArg = String.raw `(?<mathOp>[-+\%\*\/])(?<mathArg>[0-9][0-9,\.]+)`;
//const reParseLinkStatement = new RegExp(String.raw `${upstream}${parseOption}${downstream}`);
const reArr = [
    new RegExp(String.raw `${upstream}${parseOption}${downstream}`),
    new RegExp(String.raw `${upstream}${mathOpArg}${downstream}`),
    new RegExp(String.raw `${upstream}${parseOption}${mathOpArg}${downstream}`),
    new RegExp(String.raw `${upstream}${downstream}`)
];
