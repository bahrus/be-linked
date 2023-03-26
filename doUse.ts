import {CamelConfig, DownLink, PP} from './types';
import {ExportableScript} from 'be-exportable/types';
import {Scope} from 'trans-render/lib/types';

export async function doUse(pp: PP, cc: CamelConfig, downlinks: DownLink[]){
    const {self} = pp;
    const {Use, debug, nudge, skip} = cc!;
    const prev = self.previousElementSibling as HTMLScriptElement;
    if(!(prev instanceof HTMLScriptElement)) throw 'bL.404';
    const {doBeHavings} = await import('trans-render/lib/doBeHavings.js');
    import('be-exportable/be-exportable.js');
    const prevScriptElement = self.previousElementSibling as ExportableScript;
    await doBeHavings(prevScriptElement!, [{
        be: 'exportable',
        waitForResolved: true,
    }]);
    const exports = prevScriptElement._modExport;
    const {tryParse} = await import('be-decorated/cpu.js');
    for(const useStatement of Use!){
        const test = tryParse(useStatement, reUseStatement) as UseLinkStatement;
        if(test !== null){
            const {upstreamCamelQry, upstreamPropPath, exportSymbol} = test;
            const downlink: DownLink = {
                target: 'local',
                nudge,
                debug,
                skipInit: skip,
                upstreamPropPath,
                upstreamCamelQry,
                handler: exports[exportSymbol],
            };
            downlinks.push(downlink);
        }
    }
}

interface UseLinkStatement {
    upstreamPropPath: string,
    upstreamCamelQry: Scope,
    exportSymbol: string,
}
const reUseStatement = /^(?<exportSymbol>\w+)ImportToManage(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyChangesOf(?<upstreamCamelQry>\w+)/;
