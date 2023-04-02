import {
    CamelConfig, Link, UpstreamPropPath, UpstreamCamelQry, DownstreamPropPath, 
    ConditionValue, NewValue, EventName, ParseOptions, MathOp, PassDirection,
    LocalInstance,
    PP,
} from './types';
import {Scope} from 'trans-render/lib/types';
import {RegExpOrRegExpExt} from 'be-decorated/types';
import {downstream, toDownstream, parseOption, mathOpArg, adjustLink} from './be-linked.js';


export async function doOn(cc: CamelConfig, links: Link[], pp: PP){
    const {On, debug, nudge, skip} = cc;
    const defaultDownlink = {
        //localInstance: 'local',
        debug,
        nudge,
        skipInit: skip,
    } as Link;
    const {tryParse} = await import('be-decorated/cpu.js');
    for(const onString of On!){
        const test = tryParse(onString, reOnPassStatements) as OnPassStatement | null;
        if(test !== null){
            await adjustLink(test as Link, pp);
            links.push({
                ...test,
            })
            // const {eventName, upstreamCamelQry, upstreamPropPath, downstreamPropPath} = onPassDownStatement;
            // downlinks.push({
            //     ...defaultDownlink,
            //     upstreamCamelQry,
            //     upstreamPropPath,
            //     on: eventName,
            //     downstreamPropPath,
            //     passDirection: 'towards'
            // });
            //continue;
        }
        // const onPassUpStatement = tryParse(onString, reOnPassAwayStatement) as OnPassStatement | null;
        // if(onPassUpStatement !== null){
        //     const {eventName, upstreamCamelQry, upstreamPropPath, downstreamPropPath, parseOption} = onPassUpStatement;
        //     downlinks.push({
        //         ...defaultDownlink,
        //         upstreamCamelQry,
        //         upstreamPropPath,
        //         on: eventName,
        //         downstreamPropPath,
        //         passDirection: 'away',
        //         parseOption,
        //     });
        // }

    }
}

interface OnPassStatement {
    on: EventName,
    upstreamCamelQry: Scope & string,
    upstreamPropPath: UpstreamPropPath,
    downstreamPropPath: DownstreamPropPath,
    parseOption?: ParseOptions,
    mathOp?: MathOp,
    increment?: boolean,
    passDirection: PassDirection,
    localInstance: LocalInstance,
}

type POPS = Partial<OnPassStatement>


// interface OnIncrementStatement {
//     eventName: EventName,
//     upstreamCamelQry: Scope & string,
//     downstreamPropPath: DownstreamPropPath,
    
// }

const defaultVal1: POPS = {
    passDirection: 'towards',
    localInstance: 'local',
}

const upstreamEvent = String.raw `^(?<on>\w+)(?<!\\)EventOf(?<upstreamCamelQry>\w+)`;
const downstreamEvent = String.raw `^(?<on>\w+)(?<!\\)EventOfAdornedElement`;
const passUpstreamProp = String.raw `(?<!\\)Pass(?<upstreamPropPath>[\w\:]+)(?<!\\)Property`;
const passDownstreamProp = String.raw `Pass(?<downstreamPropPath>[\w\\\:]+)Property`;
const toUpstreamProp = String.raw `To(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)`;
//const reOnIncrementStatement = new RegExp(String.raw `${upstreamEvent}(?<!\\)Increment${downstream}`);

//const reOnPassTowardsStatement = new RegExp(String.raw `${upstreamEvent}${passProp}${toDownstream}`);
const reOnPassStatements : RegExpOrRegExpExt<POPS>[] = [
    {
        regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${parseOption}${mathOpArg}${toDownstream}`),
        defaultVals: {...defaultVal1}
    },
    {
        regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${parseOption}${toDownstream}`),
        defaultVals: {...defaultVal1}
    },
    {
        regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${mathOpArg}${toDownstream}`),
        defaultVals: {...defaultVal1}
    },
    {
        regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${toDownstream}`),
        defaultVals: {...defaultVal1}
    },
    {
        regExp: new RegExp(String.raw `${upstreamEvent}(?<!\\)Increment${downstream}`),
        defaultVals: {
            ...defaultVal1,
            increment: true,
        }
    },
    {
        regExp: new RegExp(String.raw `${downstreamEvent}${passDownstreamProp}${parseOption}${toUpstreamProp}`),
        defaultVals: {
            ...defaultVal1,
            passDirection: 'away'
        }
    },
    {
        regExp: new RegExp(String.raw `${downstreamEvent}${passDownstreamProp}${toUpstreamProp}`),
        defaultVals: {
            ...defaultVal1,
            passDirection: 'away'
        }
    }
    
]





