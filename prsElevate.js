let reElevateStatements;
export async function prsElevate(ecc, links) {
    const { Elevate } = ecc;
    const defaultLink = {
        inferTriggerEvent: true,
        localInstance: 'local',
        passDirection: 'away',
        skipInit: true,
    };
    const { tryParse } = await import('be-enhanced/cpu.js');
    if (reElevateStatements === undefined) {
        const { downstreamPropPath, to } = await import('./reCommon.js');
        reElevateStatements = [
            {
                regExp: new RegExp(String.raw `${downstreamPropPath}${to}(?<upstreamMarker>\w+)(?<!\\)Marker`),
                defaultVals: {}
            }
        ];
    }
    for (const passString of Elevate) {
        const test = tryParse(passString, reElevateStatements);
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
