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
    const { lispToCamel } = await import('trans-render/lib/lispToCamel.js');
    if (reElevateStatements === undefined) {
        const { downstreamPropPath, PropertyTo } = await import('./reCommon.js');
        reElevateStatements = [
            {
                regExp: new RegExp(String.raw `${downstreamPropPath}${PropertyTo}(?<upstreamMarker>[\w\-\\]+)(?<!\\)Marker`),
                defaultVals: {}
            }
        ];
    }
    for (const passString of Elevate) {
        const test = tryParse(passString, reElevateStatements);
        if (test !== null) {
            const { downstreamPropPath, upstreamMarker } = test;
            if (upstreamMarker !== undefined) {
                const clUpstreamMarker = lispToCamel(upstreamMarker.replace('\\', ''));
                const link = {
                    ...defaultLink,
                    downstreamPropPath,
                    upstreamCamelQry: 'upSearchFor' + clUpstreamMarker + 'M',
                    upstreamPropPath: clUpstreamMarker,
                    inferTriggerEvent: true,
                };
                links.push(link);
            }
        }
    }
}
