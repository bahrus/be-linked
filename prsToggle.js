let reToggleStatements;
export async function prsToggle(tcc, links, pp) {
    const { Toggle, toggleOverrides } = tcc;
    const defaultLink = {
        on: 'click',
        localInstance: 'local',
        upstreamCamelQry: 'hostish',
        toggle: true,
        passDirection: 'away',
    };
    const { tryParse } = await import('be-enhanced/cpu.js');
    if (reToggleStatements === undefined) {
        const { upstreamProperty } = await import('./reCommon.js');
        reToggleStatements = [
            {
                regExp: new RegExp(upstreamProperty),
                defaultVals: {}
            }
        ];
    }
    for (const toggleString of Toggle) {
        const test = tryParse(toggleString, reToggleStatements);
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
