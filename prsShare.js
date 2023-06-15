let reShareStatements;
export async function prsShare(scc, links, pp) {
    const { Share, shareOverrides } = scc;
    const defaultLink = {
        localInstance: 'local',
        //upstreamCamelQry: ['upSearch', '[itemscope]']
    };
    const { tryParse } = await import('be-enhanced/cpu.js');
    //const { adjustLink } = await import('./adjustLink.js');
    if (reShareStatements === undefined) {
        reShareStatements = [
            {
                regExp: new RegExp(String.raw `^(?<nameJoin>[\w\,]+)(?<!\\)From(?<source>Scope|\$0|\$1|Host|Props)(?<!\\)By(?<attr>Id|Name|Itemprop)`),
                defaultVals: {}
            },
            {
                regExp: new RegExp(String.raw `^(?<!\\)\*From(?<source>Scope|\$0|\$1|Host|Props)`),
                defaultVals: {
                    allNames: true,
                }
            },
            {
                regExp: new RegExp(String.raw `^(?<nameJoin>[\w\,]+)(?<!\\)From(?<source>Scope|\$0|\$1|Host|Props)`),
                defaultVals: {}
            },
            // {
            //     regExp: new RegExp(String.raw `^(?<!\\)\*From(?<source>Scope|ElementProps)(?<!\\)By(?<attr>Id|Name|Itemprop)`),
            //     defaultVals: {
            //         allNames: true,
            //     }
            // },
        ];
    }
    const { lc } = await import('be-enhanced/cpu.js');
    for (const shareString of Share) {
        const test = tryParse(shareString, reShareStatements);
        if (test !== null) {
            const { nameJoin, source, allNames, attr } = test;
            const names = allNames ? undefined : nameJoin.split(',').map(s => lc(s.trim()));
            let upstreamCamelQry;
            switch (source) {
                case '$0':
                case '$1':
                case 'host':
                    import('be-propagating/be-propagating.js');
                    break;
            }
            switch (source) {
                case 'scope':
                    import('be-scoped/be-scoped.js');
                    upstreamCamelQry = ['c', '[itemscope]'];
                    break;
                case '$0':
                    upstreamCamelQry = 's';
                    break;
                case '$1':
                    upstreamCamelQry = 'poho';
                    break;
                case 'host':
                    upstreamCamelQry = 'h';
                    break;
                case 'props':
                    upstreamCamelQry = 's';
                    break;
            }
            const link = {
                ...defaultLink,
                upstreamCamelQry,
                enhancement: source === 'scope' ? 'beScoped' : 'bePropagating',
                upstreamPropName: source === 'scope' ? 'scope' : undefined,
                share: {
                    scope: ['corn', '[itemscope]'],
                    attr: attr || 'itemprop',
                    ...shareOverrides,
                    names,
                    allNames,
                    source,
                }
            };
            links.push(link);
        }
    }
}
