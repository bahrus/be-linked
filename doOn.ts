import {
    CamelConfig, Link, UpstreamPropPath, UpstreamCamelQry, DownstreamPropPath, 
    ConditionValue, NewValue, EventName, ParseOptions, MathOp, PassDirection,
    LocalInstance,
    AP,
} from './types';
import {Scope} from 'trans-render/lib/types';
import {RegExpOrRegExpExt} from 'be-decorated/types';

let reOnPassStatements: RegExpOrRegExpExt<POPS>[] | undefined;

export async function doOn(cc: CamelConfig, links: Link[], pp: AP){
    const {On, debug, nudge, skip, fire, declare} = cc;
    const defaultLink = {
        debug,
        nudge,
        skipInit: skip,
        fire,
    } as Link;
    const {tryParse} = await import('be-enhanced/cpu.js');
    const {adjustLink} = await import('./adjustLink.js');
    const {upstreamEvent, passDownstreamProp, downstreamEvent, passUpstreamProp, toUpstreamCQ, toUpstreamProp, upstreamInvoke} = await import('./reOn.js');
    const {parseOption, mathOpArg, toDownstream, assResOf, downstream, toDownstreamGateway, toCatchAll} = await import('./reCommon.js');
    if(reOnPassStatements === undefined){
        reOnPassStatements = [
            {
                regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${toDownstreamGateway}`),
                defaultVals: {...defaultTowards}
            },
            {
                regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${parseOption}${mathOpArg}${toDownstream}`),
                defaultVals: {...defaultTowards}
            },
            {
                regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${parseOption}${toDownstream}`),
                defaultVals: {...defaultTowards}
            },
            {
                regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${mathOpArg}${toDownstream}`),
                defaultVals: {...defaultTowards}
            },
            {
                regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${toDownstream}`),
                defaultVals: {...defaultTowards}
            },
            {
                regExp: new RegExp(String.raw `${upstreamEvent}(?<!\\)Increment${downstream}`),
                defaultVals: {
                    ...defaultTowards,
                    increment: true,
                }
            },
            {
                regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${toCatchAll}`),
                defaultVals: {
                    ...defaultTowards
                }
            },
            {
                regExp: new RegExp(String.raw `${downstreamEvent}${passDownstreamProp}${parseOption}${toUpstreamProp}`),
                defaultVals: {
                    ...defaultTowards,
                    passDirection: 'away'
                }
            },
            {
                regExp: new RegExp(String.raw `${downstreamEvent}${passDownstreamProp}${toUpstreamProp}`),
                defaultVals: {
                    ...defaultTowards,
                    passDirection: 'away'
                }
            },
            {
                regExp: new RegExp(String.raw `${downstreamEvent}${assResOf}${toUpstreamCQ}`),
                defaultVals: {
                    ...defaultAway,
                    
                }
            },
            {
                regExp: new RegExp(String.raw `${downstream}${upstreamInvoke}`),
                defaultVals: {
                    ...defaultAway
                }
            },

            
        ]
    }

    for(const onString of On!){
        const test = tryParse(onString, reOnPassStatements, declare) as OnPassStatement | null;
        if(test !== null){
            await adjustLink(test as Link, pp);
            links.push({
                ...defaultLink,
                ...test,
            })
        }
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


const defaultTowards: POPS = {
    passDirection: 'towards',
    localInstance: 'local',
}

const defaultAway: POPS = {
    passDirection: 'away',
    localInstance: 'local'
}









