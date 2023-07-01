let rePassStatements;
export async function prsPass(pcc, links) {
    const { Pass } = pcc;
    const defaultLink = {
        inferTriggerEvent: true,
        localInstance: 'local',
        passDirection: 'away',
        skipInit: true,
    };
    const { tryParse } = await import('be-enhanced/cpu.js');
    if (rePassStatements === undefined) {
        const { downstreamPropPath, to } = await import('./reCommon.js');
        rePassStatements = [
            {
                regExp: new RegExp(String.raw `${downstreamPropPath}${to}(?<upstreamMarker>\w+)(?<!\\)Marker`),
                defaultVals: {}
            }
        ];
    }
    for (const passString of Pass) {
        const test = tryParse(passString, rePassStatements);
        if (test !== null) {
            const { downstreamPropPath, upstreamMarker } = test;
            if (upstreamMarker !== undefined) {
                const link = {
                    ...defaultLink,
                    downstreamPropPath,
                    upstreamCamelQry: 'upSearchFor' + upstreamMarker + 'M',
                    upstreamPropPath: upstreamMarker,
                    inferTriggerEvent: true,
                };
                links.push(link);
            }
        }
    }
}
