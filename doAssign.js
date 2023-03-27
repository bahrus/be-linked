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
    const defltLink = {
        localInstance: 'local',
        nudge,
        debug,
        skipInit: skip
    };
    for (const assignStatement of Assign) {
        const towardScriptWhenStatement = tryParse(assignStatement, reTowardsScriptResult);
        if (towardScriptWhenStatement !== null) {
            const { upstreamCamelQry, upstreamPropPath, exportSymbol } = towardScriptWhenStatement;
            const downlink = {
                ...defltLink,
                upstreamPropPath,
                upstreamCamelQry,
                handler: exports[exportSymbol],
                passDirection: 'towards'
            };
            downlinks.push(downlink);
            continue;
        }
        const awayScriptOnStatement = tryParse(assignStatement, reAwayScriptOnResult);
        if (awayScriptOnStatement !== null) {
            const { eventName, exportSymbol, upstreamCamelQry } = awayScriptOnStatement;
            const downlink = {
                ...defltLink,
                passDirection: 'away',
                upstreamCamelQry,
                handler: exports[exportSymbol],
                on: eventName,
            };
            downlinks.push(downlink);
        }
    }
}
const reTowardsScriptResult = /^resultOf(?<exportSymbol>\w+)(?<!\\)ToAdornedElementWhen(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)Changes/;
const reAwayScriptOnResult = /^resultOf(?<exportSymbol>\w+)(?<!\\)To(?<upstreamCamelQry>\w+)(?<!\\)On(?<eventName>\w+)(?<!\\)Event(?<!\\)OfAdornedElement/;
