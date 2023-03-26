import {CamelConfig, DownLink, UpstreamPropPath, UpstreamCamelQry, DownstreamPropPath, ConditionValue, NewValue, EventName} from './types';
import {Scope} from 'trans-render/lib/types';

export async function doOn(cc: CamelConfig, downlinks: DownLink[]){
    const {On, debug, nudge, skip} = cc;
    const {tryParse} = await import('be-decorated/cpu.js');
    for(const onString of On!){
        const test = tryParse(onString, reOnPassStatement) as OnPassStatement | null;
        if(test !== null){
            const {eventName, upstreamCamelQry, upstreamPropPath, downstreamPropPath} = test;
            downlinks.push({
                target: 'local',
                upstreamCamelQry,
                upstreamPropPath,
                on: eventName,
                downstreamPropPath,
                debug,
                nudge,
                skipInit: skip,
            })
        }
    }
}

interface OnPassStatement {
    eventName: EventName,
    upstreamCamelQry: Scope & string,
    upstreamPropPath: UpstreamPropPath,
    downstreamPropPath: DownstreamPropPath
}

const reOnPassStatement = 
/^(?<eventName>\w+)(?<!\\)EventOf(?<upstreamCamelQry>\w+)(?<!\\)Pass(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyTo(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;