import {CamelConfig, DownLink, UpstreamPropPath, UpstreamCamelQry, DownstreamPropPath, ConditionValue, NewValue, EventName, ParseOptions, MathOp} from './types';
import {Scope} from 'trans-render/lib/types';
import {RegExpOrRegExpExt} from 'be-decorated/types';
import {downstream, toDownstream, parseOption, mathOpArg} from './be-linked.js';


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
        const onPassDownStatement = tryParse(onString, reOnPassTowardsStatements) as OnPassStatement | null;
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
            const {eventName, upstreamCamelQry, upstreamPropPath, downstreamPropPath, parseOption} = onPassUpStatement;
            downlinks.push({
                ...defaultDownlink,
                upstreamCamelQry,
                upstreamPropPath,
                on: eventName,
                downstreamPropPath,
                passDirection: 'away',
                parseOption,
            });
        }
        // const onIncrementStatement = tryParse(onString, reOnIncrementStatement) as OnIncrementStatement | null;
        // if(onIncrementStatement !== null){
        //     const {eventName, upstreamCamelQry, downstreamPropPath} = onIncrementStatement;
        //     downlinks.push({
        //         ...defaultDownlink,
        //         upstreamCamelQry,
        //         on: eventName,
        //         downstreamPropPath,
        //         increment: true,
        //     })
        // }
    }
}

interface OnPassStatement {
    eventName: EventName,
    upstreamCamelQry: Scope & string,
    upstreamPropPath: UpstreamPropPath,
    downstreamPropPath: DownstreamPropPath,
    parseOption?: ParseOptions,
    mathOp?: MathOp,
    increment?: boolean,
}

type POPS = Partial<OnPassStatement>


interface OnIncrementStatement {
    eventName: EventName,
    upstreamCamelQry: Scope & string,
    downstreamPropPath: DownstreamPropPath,
    
}

const upstreamEvent = String.raw `^(?<eventName>\w+)(?<!\\)EventOf(?<upstreamCamelQry>\w+)`;
const passProp = String.raw `(?<!\\)Pass(?<upstreamPropPath>[\w\:]+)(?<!\\)Property`;
//const reOnIncrementStatement = new RegExp(String.raw `${upstreamEvent}(?<!\\)Increment${downstream}`);

//const reOnPassTowardsStatement = new RegExp(String.raw `${upstreamEvent}${passProp}${toDownstream}`);
const reOnPassTowardsStatements : RegExpOrRegExpExt<POPS>[] = [
    new RegExp(String.raw `${upstreamEvent}${passProp}${parseOption}${mathOpArg}${toDownstream}`),
    new RegExp(String.raw `${upstreamEvent}${passProp}${parseOption}${toDownstream}`),
    new RegExp(String.raw `${upstreamEvent}${passProp}${mathOpArg}${toDownstream}`),
    new RegExp(String.raw `${upstreamEvent}${passProp}${toDownstream}`),
    {
        regExp: new RegExp(String.raw `${upstreamEvent}(?<!\\)Increment${downstream}`),
        defaultVals: {
            increment: true,
        }
    }
    
]

const reOnPassAwayStatement = 
/^(?<eventName>\w+)(?<!\\)EventOfAdornedElementPass(?<downstreamPropPath>[\w\\\:]+)Property(?<parseOption>AsNumber|AsDate|AsObject|AsString|AsRegExp|AsUrl|)To(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)/;


