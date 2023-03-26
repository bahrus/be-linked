export async function doOn(cc, downlinks) {
    const { On, debug, nudge, skip } = cc;
    const { tryParse } = await import('be-decorated/cpu.js');
    for (const onString of On) {
        const test = tryParse(onString, reOnPassStatement);
        if (test !== null) {
            const { eventName, upstreamCamelQry, upstreamPropPath, downstreamPropPath } = test;
            downlinks.push({
                target: 'local',
                upstreamCamelQry,
                upstreamPropPath,
                on: eventName,
                downstreamPropPath,
                debug,
                nudge,
                skipInit: skip,
            });
        }
    }
}
const reOnPassStatement = /^(?<eventName>\w+)(?<!\\)EventOf(?<upstreamCamelQry>\w+)(?<!\\)Pass(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyTo(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;