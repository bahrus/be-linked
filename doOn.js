export async function doOn(cc, downlinks) {
    const { On, debug, nudge, skip } = cc;
    const defaultDownlink = {
        localInstance: 'local',
        debug,
        nudge,
        skipInit: skip,
        //passDirection: 'down',
    };
    const { tryParse } = await import('be-decorated/cpu.js');
    for (const onString of On) {
        const onPassDownStatement = tryParse(onString, reOnPassTowardsStatement);
        if (onPassDownStatement !== null) {
            const { eventName, upstreamCamelQry, upstreamPropPath, downstreamPropPath } = onPassDownStatement;
            downlinks.push({
                ...defaultDownlink,
                upstreamCamelQry,
                upstreamPropPath,
                on: eventName,
                downstreamPropPath,
                passDirection: 'towards'
            });
            continue;
        }
        const onPassUpStatement = tryParse(onString, reOnPassAwayStatement);
        if (onPassUpStatement !== null) {
            const { eventName, upstreamCamelQry, upstreamPropPath, downstreamPropPath } = onPassUpStatement;
            downlinks.push({
                ...defaultDownlink,
                upstreamCamelQry,
                upstreamPropPath,
                on: eventName,
                downstreamPropPath,
                passDirection: 'away'
            });
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
const reOnIncrementStatement = /^(?<eventName>\w+)(?<!\\)EventOf(?<upstreamCamelQry>\w+)(?<!\\)Increment(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;
const reOnPassTowardsStatement = /^(?<eventName>\w+)(?<!\\)EventOf(?<upstreamCamelQry>\w+)(?<!\\)Pass(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyTo(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;
const reOnPassAwayStatement = /^(?<eventName>\w+)(?<!\\)EventOfAdornedElementPass(?<downstreamPropPath>[\w\\\:]+)PropertyTo(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)/;
