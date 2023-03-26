export async function doOn(cc, downlinks) {
    const { On, debug, nudge, skip } = cc;
    const defaultDownlink = {
        target: 'local',
        debug,
        nudge,
        skipInit: skip,
        passDirection: 'down',
    };
    const { tryParse } = await import('be-decorated/cpu.js');
    for (const onString of On) {
        const onPassStatement = tryParse(onString, reOnPassStatement);
        if (onPassStatement !== null) {
            const { eventName, upstreamCamelQry, upstreamPropPath, downstreamPropPath } = onPassStatement;
            downlinks.push({
                ...defaultDownlink,
                upstreamCamelQry,
                upstreamPropPath,
                on: eventName,
                downstreamPropPath,
            });
            continue;
        }
        const onIncrementStatement = tryParse(onString, reOnIncrementStatement);
        if (onIncrementStatement !== null) {
            const { eventName, upstreamCamelQry, downstreamPropPath } = onIncrementStatement;
            downlinks.push({
                ...defaultDownlink,
                upstreamCamelQry,
                on: eventName,
                downstreamPropPath,
                increment: true,
            });
        }
    }
}
const reOnPassStatement = /^(?<eventName>\w+)(?<!\\)EventOf(?<upstreamCamelQry>\w+)(?<!\\)Pass(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyTo(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;
const reOnIncrementStatement = /^(?<eventName>\w+)(?<!\\)EventOf(?<upstreamCamelQry>\w+)(?<!\\)Increment(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;
