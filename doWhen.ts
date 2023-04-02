import {CamelConfig, ConditionValue, Link, LinkStatement, NewValue, ExportSymbol, PP} from './types';
import {Scope} from 'trans-render/lib/types';
import {upstream, downstream, toDownstream, adjustLink, toAdorned, assResOf} from './be-linked.js';
import {RegExpOrRegExpExt} from 'be-decorated/types';

export async function doWhen(cc: CamelConfig, downlinks: Link[], pp: PP){
    const {When} = cc;
    const {tryParse} = await import('be-decorated/cpu.js');
    for(const whenStatement of When!){
        const test = tryParse(whenStatement, reWhens);
        //test.downstreamPropPath = test.downstreamPropPath.replaceAll(':', '.');
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