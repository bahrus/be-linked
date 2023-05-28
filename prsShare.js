let reShareStatements;
export async function prsShare(scc, links, pp) {
    const { Share, shareDefaults } = scc;
    const defaultLink = {
        localInstance: 'local',
        enhancement: 'beScoped',
        upstreamPropName: 'scope',
        upstreamCamelQry: ['closestOrHost', '[itemscope]']
    };
    for (const shareString of Share) {
        const names = shareString.split(',').map(s => s.trim());
        const link = {
            ...defaultLink,
            share: {
                scope: ['closestOrHost', '[itemscope]'],
                attr: 'itemprop',
                ...shareDefaults,
                names,
            }
        };
        links.push(link);
    }
}
