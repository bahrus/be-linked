import { upstream, downstream, toDownstream } from './be-linked.js';
export async function doWhen(cc, downlinks) {
    const { When } = cc;
    const { tryParse } = await import('be-decorated/cpu.js');
    for (const whenStatement of When) {
        const test = tryParse(whenStatement, reWhens);
        test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
        if (test !== null) {
            downlinks.push({
                ...test,
            });
        }
    }
}
//const reWhen = new RegExp(String.raw `${upstream}(?<!\\)ChangesIncrement${downstream}`);
const changes = String.raw `(?<!\\)Changes`;
const defaultVal1 = {
    passDirection: 'towards',
    localInstance: 'local',
};
const reWhens = [
    {
        regExp: new RegExp(String.raw `${upstream}${changes}Increment${downstream}`),
        defaultVals: {
            increment: true,
            ...defaultVal1
        }
    },
    {
        regExp: new RegExp(String.raw `${upstream}${changes}AssignResultOf(?<exportSymbol>\w+)${toDownstream}`),
        defaultVals: {
            ...defaultVal1
        }
    },
    {
        regExp: new RegExp(String.raw `${upstream}(?<!\\)Equals(?<conditionValue>\w+)(?<!\\)Assign(?<newValue>\w+)${toDownstream}`),
        defaultVals: {
            ...defaultVal1
        }
    }
];
