import {CamelConfig, DownLink, PP} from './types';
import {ExportableScript} from 'be-exportable/types';
import {Scope} from 'trans-render/lib/types';

export async function doAssign(pp: PP, cc: CamelConfig, downlinks: DownLink[]){
    const {self} = pp;
    const {Assign, debug, nudge, skip} = cc!;
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
    for(const assignStatement of Assign!){
        const test = tryParse(assignStatement, reDownstreamAssignStatement) as UseLinkStatement;
        if(test !== null){
            const {upstreamCamelQry, upstreamPropPath, exportSymbol} = test;
            const downlink: DownLink = {
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

interface UseLinkStatement {
    upstreamPropPath: string,
    upstreamCamelQry: Scope,
    exportSymbol: string,
}
const reDownstreamAssignStatement = /^resultOf(?<exportSymbol>\w+)(?<!\\)ToAdornedElementWhen(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)Changes/;
