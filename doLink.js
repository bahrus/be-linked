export async function doLink(cc, downlinks) {
    const { Link, negate } = cc;
    if (Link !== undefined) {
        const links = await matchStd(Link);
        const { linkStatementsWithSingleArgs, shortDownLinkStatements, parseLinkStatements, simplestLinkStatements } = links;
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
        simplestLinkStatements.forEach(link => {
            const downlink = {
                target: 'local',
                downstreamPropPath: link.props,
                upstreamCamelQry: 'host',
                upstreamPropPath: link.props
            };
            downlinks.push(downlink);
        });
        const { Negate, Clone, Refer } = cc;
        if (Negate !== undefined) {
            await merge(Negate, {
                target: 'local',
                negate: true
            }, downlinks);
        }
        if (Clone !== undefined) {
            await merge(Clone, {
                target: 'local',
                clone: true
            }, downlinks);
        }
        if (Refer !== undefined) {
            await merge(Refer, {
                target: 'local',
                refer: true
            }, downlinks);
        }
    }
}
async function matchStd(links) {
    const { tryParse } = await import('be-decorated/cpu.js');
    const shortDownLinkStatements = [];
    const linkStatementsWithSingleArgs = [];
    const parseLinkStatements = [];
    const simplestLinkStatements = [];
    for (const linkCamelString of links) {
        let test = tryParse(linkCamelString, reLinkStatementWithSingleArgVerb);
        if (test !== null) {
            test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
            linkStatementsWithSingleArgs.push(test);
            continue;
        }
        test = tryParse(linkCamelString, reParseLinkStatement);
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
        test = tryParse(linkCamelString, reSimplest);
        if (test !== null) {
            simplestLinkStatements.push(test);
        }
    }
    return {
        shortDownLinkStatements,
        linkStatementsWithSingleArgs,
        parseLinkStatements,
        simplestLinkStatements,
    };
}
async function merge(Links, mergeObj, downlinks) {
    const links = await matchStd(Links);
    const { shortDownLinkStatements } = links;
    shortDownLinkStatements.forEach(link => {
        downlinks.push({
            ...mergeObj,
            ...link
        });
    });
}
const reSimplest = /^(?<props>\w+)Props/;
const reShortDownLinkStatement = /^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;
const reLinkStatementWithSingleArgVerb = /^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)(?<!\\)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElementAfter(?<adjustmentVerb>Subtracting|Adding|ParsingAs|MultiplyingBy|DividingBy|Mod)(?<argument>\w+)/;
const reParseLinkStatement = /^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)(?<!\\)As(?<parseOption>Number|Date|String|Object|Url|RegExp)To(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;
