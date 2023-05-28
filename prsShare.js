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
                regExp: new RegExp(String.raw `^(?<nameJoin>[\w\,]+)(?<!\\)From(?<source>Scope|ElementProps)`),
                defaultVals: {}
            }
        ];
    }
    for (const shareString of Share) {
        const test = tryParse(shareString, reShareStatements);
        if (test !== null) {
            const { nameJoin, source } = test;
            const names = nameJoin.split(',').map(s => s.trim());
            const link = {
                ...defaultLink,
                enhancement: source === 'ElementProps' ? 'bePropagating' : 'beScoped',
                upstreamPropName: source === 'ElementProps' ? 'propagator' : 'scope',
                share: {
                    scope: ['closestOrHost', '[itemscope]'],
                    attr: 'itemprop',
                    ...shareOverrides,
                    names,
                }
            };
            links.push(link);
        }
    }
}
