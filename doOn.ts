import {CamelConfig, DownLink, UpstreamPropPath, UpstreamCamelQry, DownstreamPropPath, ConditionValue, NewValue, EventName} from './types';
import {Scope} from 'trans-render/lib/types';

export async function doOn(cc: CamelConfig, downlinks: DownLink[]){
    const {On, debug, nudge, skip} = cc;
    const defaultDownlink = {
        target: 'local',
        debug,
        nudge,
        skipInit: skip,
        passDirection: 'down',
    } as DownLink;
    const {tryParse} = await import('be-decorated/cpu.js');
    for(const onString of On!){
        const onPassStatement = tryParse(onString, reOnPassStatement) as OnPassStatement | null;
        if(onPassStatement !== null){
            const {eventName, upstreamCamelQry, upstreamPropPath, downstreamPropPath} = onPassStatement;
            downlinks.push({
                ...defaultDownlink,
                upstreamCamelQry,
                upstreamPropPath,
                on: eventName,
                downstreamPropPath,
            });
            continue;
        }
        const onIncrementStatement = tryParse(onString, reOnIncrementStatement) as OnIncrementStatement | null;
        if(onIncrementStatement !== null){
            const {eventName, upstreamCamelQry, downstreamPropPath} = onIncrementStatement;
            downlinks.push({
                ...defaultDownlink,
                upstreamCamelQry,
                on: eventName,
                downstreamPropPath,
                increment: true,
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

interface OnIncrementStatement {
    eventName: EventName,
    upstreamCamelQry: Scope & string,
    downstreamPropPath: DownstreamPropPath
}
const reOnIncrementStatement = 
/^(?<eventName>\w+)(?<!\\)EventOf(?<upstreamCamelQry>\w+)(?<!\\)Increment(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;