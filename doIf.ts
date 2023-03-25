import {CamelConfig, DownLink} from './types';

export async function doIf(cc: CamelConfig, downlinks: DownLink[]){
    const {If} = cc;
    const {tryParse} = await import('be-decorated/cpu.js');
    for(const ifString of If!){
        const test = tryParse(ifString, reIfStatement) as IfStatement | null;
        if(test !== null){
            
        }
    }
}

interface IfStatement {
    upstreamPropPath: string,
    condition: string,
    downstreamPropPath: string,
    value: string,
}

const reIfStatement = 
/^(?<upstreamPropPath>[\w\\\:]+)(?<!\\)Of(?<condition>w+)(?<!\\)ThenSet(?<downstreamPropPath>[\w\\\:]+)(?<!\\)OfAdornedElementTo(?<value>w+)/;