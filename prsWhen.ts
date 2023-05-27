import {CamelConfig, ConditionValue, Link, LinkStatement, NewValue, ExportSymbol, AP} from './types';
import {Scope} from 'trans-render/lib/types';
//import {upstream, downstream, toDownstream, toAdorned, assResOf} from './be-linked.js';
import {RegExpOrRegExpExt} from 'be-decorated/types';

let reWhens: RegExpOrRegExpExt<PWSG>[] | undefined;
export async function prsWhen(cc: CamelConfig, downlinks: Link[], pp: AP){
    const {When, declare} = cc;
    const {tryParse} = await import('be-enhanced/cpu.js');
    const {adjustLink} = await import('./adjustLink.js');
    const {upstream, downstream, assResOf, toAdorned, toDownstream} = await import('./reCommon.js');
    if(reWhens === undefined){
        reWhens = [
            {
                regExp: new RegExp(String.raw `${upstream}${changes}Increment${downstream}`),
                defaultVals: {
                    increment: true,
                    skipInit: true,
                    ...defaultVal1
                }
            },
            {
                regExp: new RegExp(String.raw `${upstream}${changes}${assResOf}${toAdorned}`),
                defaultVals: {
                    ...defaultVal1
                }
            },
            {
                regExp: new RegExp(String.raw `${upstream}(?<!\\)Equals(?<conditionValue>\w+)(?<!\\)Assign(?<newValue>\w+)${toDownstream}`),
                defaultVals:{
                    ...defaultVal1
                }
            }
        ]
    }

    for(const whenStatement of When!){
        const test = tryParse(whenStatement, reWhens, declare);
        if(test !== null){
            await adjustLink(test as Link, pp);
            downlinks.push({
                ...test,
            });
        }
    }
}

interface WhenStatementGroup {
    upstreamPropPath: string,
    upstreamCamelQry: Scope & string,
    downstreamPropPath: string,
    increment?: boolean,
    localInstance?: 'local' | 'proxy',
    passDirection?: 'away' | 'towards',
    exportSymbol?: ExportSymbol,
    conditionValue?: ConditionValue,
    newValue?: NewValue,
    skipInit?: boolean,
}
type PWSG = Partial<WhenStatementGroup>;
//const reWhen = new RegExp(String.raw `${upstream}(?<!\\)ChangesIncrement${downstream}`);

const changes = String.raw `(?<!\\)Changes`;

const defaultVal1: PWSG = {
    passDirection: 'towards',
    localInstance: 'local',
}

