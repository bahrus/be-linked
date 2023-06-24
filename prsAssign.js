let reAssignStatements;
export async function prsAssign(acc, links) {
    const { Assign } = acc;
    const defaultLink = {
        localInstance: 'local',
        upstreamCamelQry: 'hostish',
        passDirection: 'towards',
        assign: true,
    };
    const { tryParse } = await import('be-enhanced/cpu.js');
    if (reAssignStatements === undefined) {
        const { upstreamProperty } = await import('./reCommon.js');
        reAssignStatements = [
            {
                regExp: new RegExp(upstreamProperty),
                defaultVals: {}
            }
        ];
    }
    for (const assigmentString of Assign) {
        const test = tryParse(assigmentString, reAssignStatements);
        if (test !== null) {
            const { upstreamPropPath } = test;
            const link = {
                ...defaultLink,
                upstreamPropPath,
            };
            links.push(link);
        }
    }
}
