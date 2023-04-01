import { PP } from './types';
import {ExportableScript} from 'be-exportable/types';

export async function getExportSym(pp: PP, exportSymbol: string){
    const {self} = pp;
    const {doBeHavings} = await import('trans-render/lib/doBeHavings.js');
    import('be-exportable/be-exportable.js');
    const prevScriptElement = self.previousElementSibling as ExportableScript;
    if(prevScriptElement._modExport !== undefined) return prevScriptElement._modExport[exportSymbol];
    await doBeHavings(prevScriptElement!, [{
        be: 'exportable',
        waitForResolved: true,
    }]);
    return prevScriptElement._modExport[exportSymbol];
}