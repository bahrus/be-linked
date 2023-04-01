export async function getExportSym(pp, exportSymbol) {
    const { self } = pp;
    const { doBeHavings } = await import('trans-render/lib/doBeHavings.js');
    import('be-exportable/be-exportable.js');
    const prevScriptElement = self.previousElementSibling;
    if (prevScriptElement._modExport !== undefined)
        return prevScriptElement._modExport[exportSymbol];
    await doBeHavings(prevScriptElement, [{
            be: 'exportable',
            waitForResolved: true,
        }]);
    return prevScriptElement._modExport[exportSymbol];
}
