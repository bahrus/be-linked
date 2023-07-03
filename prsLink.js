import { toDownstreamGateway } from './reCommon.js';
export async function prsLink(cc, downlinks, ap) {
    const { Link, negate, debug, nudge, skip, Clone, Refer, Negate } = cc;
    const defaultDownlink = {
        localInstance: 'local',
        passDirection: 'towards',
        negate,
        debug,
        nudge,
        skipInit: skip,
    };
    if (Link !== undefined) {
        await processLinkStatements(Link, defaultDownlink, downlinks, ap);
    }
    if (Clone !== undefined) {
        await processLinkStatements(Clone, { ...defaultDownlink, clone: true }, downlinks, ap);
    }
    if (Refer !== undefined) {
        await processLinkStatements(Refer, { ...defaultDownlink, refer: true }, downlinks, ap);
    }
    if (Negate !== undefined) {
        await processLinkStatements(Negate, { ...defaultDownlink, negate: true }, downlinks, ap);
    }
}
async function processLinkStatements(Link, defaultDownlink, downlinks, ap) {
    const linkStatementGroups = await matchLSGs(Link, ap);
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
    const { downstreamPropPath, upstreamCamelQry, upstreamPropPath, mathArg, mathOp, parseOption, enhancement, } = lsg;
    const downLink = {
        ...defaultDownlink,
        downstreamPropPath,
        upstreamCamelQry,
        upstreamPropPath,
        enhancement,
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
async function matchLSGs(links, ap) {
    const { tryParse } = await import('be-enhanced/cpu.js');
    const { adjustLink } = await import('./adjustLink.js');
    const returnObj = [];
    const { upstream, parseOption, mathOpArg, toDownstream } = await import('./reCommon.js');
    const reArr = [
        new RegExp(String.raw `${upstream}${parseOption}${mathOpArg}${toDownstream}`),
        new RegExp(String.raw `${upstream}${parseOption}${toDownstream}`),
        new RegExp(String.raw `${upstream}${mathOpArg}${toDownstream}`),
        new RegExp(String.raw `${upstream}${toDownstreamGateway}`),
        new RegExp(String.raw `${upstream}${toDownstream}`)
    ];
    for (const linkCamelString of links) {
        const test = tryParse(linkCamelString, reArr);
        if (test !== null) {
            await adjustLink(test, ap);
            returnObj.push(test);
            continue;
        }
    }
    return returnObj;
}
async function matchSSGs(links) {
    const { tryParse } = await import('be-enhanced/cpu.js');
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
