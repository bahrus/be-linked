import { upstream } from './be-linked.js';
export async function doIf(cc, downlinks) {
    const { If, debug, nudge, skip } = cc;
    const { tryParse } = await import('be-decorated/cpu.js');
    for (const ifString of If) {
        const test = tryParse(ifString, reIfStatement);
        if (test !== null) {
            const { upstreamCamelQry, upstreamPropPath, downstreamPropPath, conditionValue, newValue } = test;
            downlinks.push({
                localInstance: 'local',
                passDirection: 'towards',
                debug,
                nudge,
                skipInit: skip,
                upstreamCamelQry,
                upstreamPropPath,
                downstreamPropPath: downstreamPropPath.replaceAll(':', '.'),
                conditionValue,
                newValue,
            });
        }
    }
}
const reIfStatement = new RegExp(String.raw `${upstream}(?<!\\)Equals(?<conditionValue>\w+)(?<!\\)ThenSet(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElementTo(?<newValue>\w+)`);
