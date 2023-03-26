export async function doAssign(pp, cc, downlinks) {
    const { self } = pp;
    const { Assign, debug, nudge, skip } = cc;
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
    for (const assignStatement of Assign) {
        const test = tryParse(assignStatement, reDownstreamAssignStatement);
        if (test !== null) {
            const { upstreamCamelQry, upstreamPropPath, exportSymbol } = test;
            const downlink = {
                localInstance: 'local',
                nudge,
                debug,
                skipInit: skip,
                upstreamPropPath,
                upstreamCamelQry,
                handler: exports[exportSymbol],
                passDirection: 'towards'
            };
            downlinks.push(downlink);
        }
    }
}
const reDownstreamAssignStatement = /^resultOf(?<exportSymbol>\w+)(?<!\\)ToAdornedElementWhen(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)Changes/;
