export async function adjustLink(link, ap) {
    const { downstreamPropPath, upstreamPropPath, exportSymbol, on, enhancement } = link;
    if (downstreamPropPath !== undefined)
        link.downstreamPropPath = downstreamPropPath.replaceAll(':', '.');
    if (upstreamPropPath !== undefined)
        link.upstreamPropPath = upstreamPropPath.replaceAll(':', '.');
    if (on !== undefined) {
        const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
        link.on = await camelToLisp(on);
    }
    if (enhancement !== undefined) {
        const iPosOfColon = enhancement.indexOf(':');
        if (iPosOfColon > -1) {
            link.enhancement = enhancement.substring(0, iPosOfColon);
            link.downstreamPropPath = enhancement.substring(iPosOfColon + 1).replaceAll(':', '.');
        }
        // const {lispToCamel} = await import('trans-render/lib/lispToCamel.js');
        // link.enhancement = lispToCamel(enhancement);
    }
    // if(catchAll !== undefined){
    //     const {doSub} = await import('./doSub.js');
    //     await doSub(link, ap, catchAll);
    // }
    if (exportSymbol !== undefined && ap !== undefined) {
        const { getExportSym } = await import('./getExportSym.js');
        link.handler = await getExportSym(ap, exportSymbol);
    }
}
