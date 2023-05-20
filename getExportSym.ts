import { AP } from './types';

export async function getExportSym(pp: AP, exportSymbol: string){
    const {enhancedElement} = pp;
    //const {doBeHavings} = await import('trans-render/lib/doBeHavings.js');
    import('be-exportable/be-exportable.js');
    const prevScriptElement = enhancedElement.previousElementSibling as any;
    const enhancement = await prevScriptElement.beEnhanced.whenResolved('be-exportable');
    const exports = enhancement.exports;
    return exports[exportSymbol];
}