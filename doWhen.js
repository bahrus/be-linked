let reWhens;
export async function doWhen(cc, downlinks, pp) {
    const { When, declare } = cc;
    const { tryParse } = await import('be-enhanced/cpu.js');
    const { adjustLink } = await import('./adjustLink.js');
    const { upstream, downstream, assResOf, toAdorned, toDownstream } = await import('./reCommon.js');
    if (reWhens === undefined) {
        reWhens = [
            {
                regExp: new RegExp(String.raw `${upstream}${changes}Increment${downstream}`),
                defaultVals: {
                    increment: true,
                    skipInit: true,
                    ...defaultVal1
                }
            },
            {
                regExp: new RegExp(String.raw `${upstream}${changes}${assResOf}${toAdorned}`),
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
    }
    for (const whenStatement of When) {
        const test = tryParse(whenStatement, reWhens, declare);
        if (test !== null) {
            await adjustLink(test, pp);
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
