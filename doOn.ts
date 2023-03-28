import {CamelConfig, DownLink, UpstreamPropPath, UpstreamCamelQry, DownstreamPropPath, ConditionValue, NewValue, EventName} from './types';
import {Scope} from 'trans-render/lib/types';


export async function doOn(cc: CamelConfig, downlinks: DownLink[]){
    const {On, debug, nudge, skip} = cc;
    const defaultDownlink = {
        localInstance: 'local',
        debug,
        nudge,
        skipInit: skip,
    } as DownLink;
    const {tryParse} = await import('be-decorated/cpu.js');
    for(const onString of On!){
        const onPassDownStatement = tryParse(onString, reOnPassTowardsStatement) as OnPassStatement | null;
        if(onPassDownStatement !== null){
            const {eventName, upstreamCamelQry, upstreamPropPath, downstreamPropPath} = onPassDownStatement;
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
        const onPassUpStatement = tryParse(onString, reOnPassAwayStatement) as OnPassStatement | null;
        if(onPassUpStatement !== null){
            const {eventName, upstreamCamelQry, upstreamPropPath, downstreamPropPath, optionalAs} = onPassUpStatement;
            downlinks.push({
                ...defaultDownlink,
                upstreamCamelQry,
                upstreamPropPath,
                on: eventName,
                downstreamPropPath,
                passDirection: 'away'
            });
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
    downstreamPropPath: DownstreamPropPath,
    optionalAs: string,
}


interface OnIncrementStatement {
    eventName: EventName,
    upstreamCamelQry: Scope & string,
    downstreamPropPath: DownstreamPropPath
}
const reOnIncrementStatement = 
/^(?<eventName>\w+)(?<!\\)EventOf(?<upstreamCamelQry>\w+)(?<!\\)Increment(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;

const reOnPassTowardsStatement = 
/^(?<eventName>\w+)(?<!\\)EventOf(?<upstreamCamelQry>\w+)(?<!\\)Pass(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyTo(?<downstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOfAdornedElement/;

const reOnPassAwayStatement = 
/^(?<eventName>\w+)(?<!\\)EventOfAdornedElementPass(?<downstreamPropPath>[\w\\\:]+)Property(?<optionalAs>AsNumber|)To(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)/;


