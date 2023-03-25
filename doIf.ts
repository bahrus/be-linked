import {CamelConfig, DownLink, UpstreamPropPath, UpstreamCamelQry, DownstreamPropPath, ConditionValue, NewValue} from './types';
import {Scope} from 'trans-render/lib/types';

export async function doIf(cc: CamelConfig, downlinks: DownLink[]){
    const {If} = cc;
    const {tryParse} = await import('be-decorated/cpu.js');
    for(const ifString of If!){
        const test = tryParse(ifString, reIfStatement) as IfStatement | null;
        if(test !== null){
            const {
                upstreamCamelQry, upstreamPropPath, 
                downstreamPropPath, conditionValue, newValue}
            = test;
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

interface IfStatement {
    upstreamPropPath: UpstreamPropPath,
    upstreamCamelQry: Scope & string,
    conditionValue: ConditionValue,
    downstreamPropPath: DownstreamPropPath,
    newValue: NewValue,
}
const reIfStatement = 
/^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)Of(?<upstreamCamelQry>\w+)(?<!\\)Equals(?<conditionValue>\w+)(?<!\\)ThenSet(?<downstreamPropPath>[\w\\\:]+)(?<!\\)OfAdornedElementTo(?<newValue>\w+)/;