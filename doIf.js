export async function doIf(cc, downlinks) {
    const { If } = cc;
    const { tryParse } = await import('be-decorated/cpu.js');
    for (const ifString of If) {
        const test = tryParse(ifString, reIfStatement);
        if (test !== null) {
            const { upstreamCamelQry, upstreamPropPath, downstreamPropPath, conditionValue, newValue } = test;
            downlinks.push({
                target: 'local',
                upstreamCamelQry,
                upstreamPropPath,
                downstreamPropPath: downstreamPropPath.replaceAll(':', '.'),
                conditionValue,
                newValue,
            });
        }
    }
}
const reIfStatement = /^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)Of(?<upstreamCamelQry>\w+)(?<!\\)Equals(?<conditionValue>\w+)(?<!\\)ThenSet(?<downstreamPropPath>[\w\\\:]+)(?<!\\)OfAdornedElementTo(?<newValue>\w+)/;
