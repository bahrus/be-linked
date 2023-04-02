import { downstream, toDownstream, parseOption, mathOpArg, adjustLink } from './be-linked.js';
export async function doOn(cc, links, pp) {
    const { On, debug, nudge, skip } = cc;
    const defaultDownlink = {
        //localInstance: 'local',
        debug,
        nudge,
        skipInit: skip,
    };
    const { tryParse } = await import('be-decorated/cpu.js');
    for (const onString of On) {
        const test = tryParse(onString, reOnPassStatements);
        if (test !== null) {
            await adjustLink(test, pp);
            links.push({
                ...test,
            });
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
// interface OnIncrementStatement {
//     eventName: EventName,
//     upstreamCamelQry: Scope & string,
//     downstreamPropPath: DownstreamPropPath,
// }
const defaultVal1 = {
    passDirection: 'towards',
    localInstance: 'local',
};
const upstreamEvent = String.raw `^(?<on>\w+)(?<!\\)EventOf(?<upstreamCamelQry>\w+)`;
const downstreamEvent = String.raw `^(?<on>\w+)(?<!\\)EventOfAdornedElement`;
const passUpstreamProp = String.raw `(?<!\\)Pass(?<upstreamPropPath>[\w\:]+)(?<!\\)Property`;
const passDownstreamProp = String.raw `Pass(?<downstreamPropPath>[\w\\\:]+)Property`;
const toUpstreamProp = String.raw `To(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)`;
//const reOnIncrementStatement = new RegExp(String.raw `${upstreamEvent}(?<!\\)Increment${downstream}`);
//const reOnPassTowardsStatement = new RegExp(String.raw `${upstreamEvent}${passProp}${toDownstream}`);
const reOnPassStatements = [
    {
        regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${parseOption}${mathOpArg}${toDownstream}`),
        defaultVals: { ...defaultVal1 }
    },
    {
        regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${parseOption}${toDownstream}`),
        defaultVals: { ...defaultVal1 }
    },
    {
        regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${mathOpArg}${toDownstream}`),
        defaultVals: { ...defaultVal1 }
    },
    {
        regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${toDownstream}`),
        defaultVals: { ...defaultVal1 }
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
];
