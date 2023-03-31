import {CamelConfig, DownLink, UpstreamPropPath, UpstreamCamelQry, DownstreamPropPath, ConditionValue, NewValue} from './types';
import {Scope} from 'trans-render/lib/types';
import {upstream, parseOption, toDownstream} from './be-linked.js';

export async function doIf(cc: CamelConfig, downlinks: DownLink[]){
    const {If, debug, nudge, skip} = cc;
    const {tryParse} = await import('be-decorated/cpu.js');
    for(const ifString of If!){
        const test = tryParse(ifString, reIfStatement) as IfStatement | null;
        if(test !== null){
            const {
                upstreamCamelQry, upstreamPropPath, 
                downstreamPropPath, conditionValue, newValue}
            = test;
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

interface IfStatement {
    upstreamPropPath: UpstreamPropPath,
    upstreamCamelQry: Scope & string,
    conditionValue: ConditionValue,
    downstreamPropPath: DownstreamPropPath,
    newValue: NewValue,
}
const reIfStatement = new RegExp(String.raw
    `${upstream}(?<!\\)Equals(?<conditionValue>\w+)(?<!\\)ThenSet(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElementTo(?<newValue>\w+)`
);
