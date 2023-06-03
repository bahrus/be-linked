let reShareStatements;
export async function prsShare(scc, links, pp) {
    const { Share, shareOverrides } = scc;
    const defaultLink = {
        localInstance: 'local',
        upstreamCamelQry: ['upSearch', '[itemscope]']
    };
    const { tryParse } = await import('be-enhanced/cpu.js');
    //const { adjustLink } = await import('./adjustLink.js');
    if (reShareStatements === undefined) {
        reShareStatements = [
            {
                regExp: new RegExp(String.raw `^(?<!\\)\*From(?<source>Scope|ElementProps)`),
                defaultVals: {
                    allNames: true,
                }
            },
            {
                regExp: new RegExp(String.raw `^(?<nameJoin>[\w\,]+)(?<!\\)From(?<source>Scope|ElementProps)`),
                defaultVals: {}
            }
        ];
    }
    const { lc } = await import('be-enhanced/cpu.js');
    for (const shareString of Share) {
        const test = tryParse(shareString, reShareStatements);
        if (test !== null) {
            const { nameJoin, source, allNames } = test;
            const names = allNames ? undefined : nameJoin.split(',').map(s => lc(s.trim()));
            const link = {
                ...defaultLink,
                enhancement: source === 'ElementProps' ? 'bePropagating' : 'beScoped',
                upstreamPropName: source === 'ElementProps' ? 'propagator' : 'scope',
                share: {
                    scope: ['closestOrHost', '[itemscope]'],
                    attr: 'itemprop',
                    ...shareOverrides,
                    names,
                    allNames
                }
            };
            links.push(link);
        }
    }
}
