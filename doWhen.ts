import {CamelConfig, ConditionValue, Link, Link, LinkStatement, NewValue, ExportSymbol} from './types';
import {Scope} from 'trans-render/lib/types';
import {upstream, downstream, toDownstream} from './be-linked.js';
import {RegExpOrRegExpExt} from 'be-decorated/types';

export async function doWhen(cc: CamelConfig, downlinks: Link[]){
    const {When} = cc;
    const {tryParse} = await import('be-decorated/cpu.js');
    for(const whenStatement of When!){
        const test = tryParse(whenStatement, reWhens);
        test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
        if(test !== null){
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
}
type PWSG = Partial<WhenStatementGroup>;
//const reWhen = new RegExp(String.raw `${upstream}(?<!\\)ChangesIncrement${downstream}`);

const changes = String.raw `(?<!\\)Changes`;

const defaultVal1: PWSG = {
    passDirection: 'towards',
    localInstance: 'local',
}

const reWhens : RegExpOrRegExpExt<PWSG>[] = [
    {
        regExp: new RegExp(String.raw `${upstream}${changes}Increment${downstream}`),
        defaultVals: {
            increment: true,
            ...defaultVal1
        }
    },
    {
        regExp: new RegExp(String.raw `${upstream}${changes}AssignResultOf(?<exportSymbol>\w+)${toDownstream}`),
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