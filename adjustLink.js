export async function adjustLink(link, ap) {
    const { downstreamPropPath, upstreamPropPath, exportSymbol, on, enhancement, catchAll } = link;
    if (downstreamPropPath !== undefined)
        link.downstreamPropPath = downstreamPropPath.replaceAll(':', '.');
    if (upstreamPropPath !== undefined)
        link.upstreamPropPath = upstreamPropPath.replaceAll(':', '.');
    if (on !== undefined) {
        const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
        link.on = await camelToLisp(on);
    }
    if (enhancement !== undefined) {
        const { lispToCamel } = await import('trans-render/lib/lispToCamel.js');
        link.enhancement = lispToCamel(enhancement);
    }
    if (catchAll !== undefined) {
        const { doSub } = await import('./doSub.js');
        await doSub(link, ap, catchAll);
    }
    if (exportSymbol !== undefined && ap !== undefined) {
        const { getExportSym } = await import('./getExportSym.js');
        link.handler = await getExportSym(ap, exportSymbol);
    }
}
