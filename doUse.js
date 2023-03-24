export async function doUse(pp, cc, downlinks) {
    const { self } = pp;
    const { Use } = cc;
    const prev = self.previousElementSibling;
    if (!(prev instanceof HTMLScriptElement))
        throw 'bL.404';
    const { doBeHavings } = await import('trans-render/lib/doBeHavings.js');
    import('be-exportable/be-exportable.js');
    const prevScriptElement = self.previousElementSibling;
    await doBeHavings(prevScriptElement, [{
            be: 'exportable',
            waitForResolved: true,
        }]);
    const exports = prevScriptElement._modExport;
    const { tryParse } = await import('be-decorated/cpu.js');
    for (const useStatement of Use) {
        const test = tryParse(useStatement, reUseStatement);
        if (test !== null) {
            const { upstreamCamelQry, upstreamPropPath, exportSymbol } = test;
            const downlink = {
                target: 'local',
                upstreamPropPath,
                upstreamCamelQry,
                handler: exports[exportSymbol],
            };
            downlinks.push(downlink);
        }
    }
}
const reUseStatement = /^(?<exportSymbol>\w+)ImportToManage(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyChangesOf(?<upstreamCamelQry>\w+)/;
