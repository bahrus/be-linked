import {CamelConfig, DownLink, Link, LinkStatement} from './types';
import {Scope} from 'trans-render/lib/types';
import {upstream, downstream} from './be-linked.js';

export async function doWhen(cc: CamelConfig, downlinks: DownLink[]){
    const {When} = cc;
    const {tryParse} = await import('be-decorated/cpu.js');
    for(const whenStatement of When!){
        const test = tryParse(whenStatement, reWhen);
        if(test !== null){
            downlinks.push({
                localInstance: 'local',
                passDirection: 'towards',
                skipInit: true,
                increment: true,
                ...test,
            });
        }
    }
}

interface WhenStatementGroup {
    upstreamPropPath: string,
    upstreamCamelQry: Scope & string,
    downstreamPropPath: string,
}
const reWhen = new RegExp(String.raw `${upstream}ChangesIncrement${downstream}`)