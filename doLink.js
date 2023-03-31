import { upstream, parseOption, downstream } from './be-linked.js';
export async function doLink(cc, downlinks) {
    const { Link, negate, debug, nudge, skip, Clone, Refer } = cc;
    const defaultDownlink = {
        localInstance: 'local',
        passDirection: 'towards',
        negate,
        debug,
        nudge,
        skipInit: skip,
    };
    if (Link !== undefined) {
        processLinkStatements(Link, defaultDownlink, downlinks);
    }
    if (Clone !== undefined) {
        processLinkStatements(Clone, { ...defaultDownlink, clone: true }, downlinks);
    }
    if (Refer !== undefined) {
        processLinkStatements(Refer, { ...defaultDownlink, refer: true }, downlinks);
    }
}
async function processLinkStatements(Link, defaultDownlink, downlinks) {
    const linkStatementGroups = await matchLSGs(Link);
    for (const link of linkStatementGroups) {
        const downloadLink = toDownLink(link, defaultDownlink);
        downlinks.push(downloadLink);
    }
    const simpleStatementGroups = await matchSSGs(Link);
    for (const link of simpleStatementGroups) {
        const { props } = link;
        downlinks.push({
            ...defaultDownlink,
            upstreamPropPath: props,
            downstreamPropPath: props,
            upstreamCamelQry: 'host',
        });
    }
}
function toDownLink(lsg, defaultDownlink) {
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
async function matchLSGs(links) {
    const { tryParse } = await import('be-decorated/cpu.js');
    const returnObj = [];
    for (const linkCamelString of links) {
        const test = tryParse(linkCamelString, reArr);
        if (test !== null) {
            test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
            returnObj.push(test);
            continue;
        }
    }
    return returnObj;
}
async function matchSSGs(links) {
    const { tryParse } = await import('be-decorated/cpu.js');
    const returnObj = [];
    for (const linkCamelString of links) {
        const test = tryParse(linkCamelString, reSimplest);
        if (test !== null) {
            returnObj.push(test);
        }
    }
    return returnObj;
}
const reSimplest = /^(?<props>\w+)Props/;
const mathOpArg = String.raw `(?<mathOp>[-+\%\*\/])(?<mathArg>[0-9][0-9,\.]+)`;
const reArr = [
    new RegExp(String.raw `${upstream}${parseOption}${mathOpArg}${downstream}`),
    new RegExp(String.raw `${upstream}${parseOption}${downstream}`),
    new RegExp(String.raw `${upstream}${mathOpArg}${downstream}`),
    new RegExp(String.raw `${upstream}${downstream}`)
];
