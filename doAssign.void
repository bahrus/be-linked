import {CamelConfig, Link, PP} from './types';
import {ExportableScript} from 'be-exportable/types';
import {Scope} from 'trans-render/lib/types';

export async function doAssign(pp: PP, cc: CamelConfig, downlinks: Link[]){
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
    const defltLink = {
        localInstance: 'local',
        nudge,
        debug,
        skipInit: skip
    } as Link;
    for(const assignStatement of Assign!){
        const towardScriptWhenStatement = tryParse(assignStatement, reTowardsScriptResult) as TowardsScriptWhenStatement | null;
        if(towardScriptWhenStatement !== null){
            const {upstreamCamelQry, upstreamPropPath, exportSymbol} = towardScriptWhenStatement;
            const downlink: Link = {
                ...defltLink,
                upstreamPropPath,
                upstreamCamelQry,
                handler: exports[exportSymbol],
                passDirection: 'towards'
            };
            downlinks.push(downlink);
            continue;
        }
        const awayScriptOnStatement = tryParse(assignStatement, reAwayScriptOnResult) as AwayScriptOnStatement | null;
        if(awayScriptOnStatement !== null){
            const {eventName, exportSymbol, upstreamCamelQry} = awayScriptOnStatement;
            const downlink: Link = {
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

interface TowardsScriptWhenStatement {
    upstreamPropPath: string,
    upstreamCamelQry: Scope,
    exportSymbol: string,
}

interface AwayScriptOnStatement {
    exportSymbol: string,
    upstreamCamelQry: Scope,
    eventName: string,

}
const reTowardsScriptResult = /^resultOf(?<exportSymbol>\w+)(?<!\\)ToAdornedElementWhen(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)Changes/;

const reAwayScriptOnResult = /^resultOf(?<exportSymbol>\w+)(?<!\\)To(?<upstreamCamelQry>\w+)(?<!\\)On(?<eventName>\w+)(?<!\\)Event(?<!\\)OfAdornedElement/;


