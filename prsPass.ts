import {PassCamelConfig, Link, LinkStatement, ParseOptions, MathOp, AllProps, AP, IObserve, Share, Source} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';

interface PassStatement{
    downstreamPropPath: string,
    upstreamMarker: string
}

type PPS = Partial<PassStatement>;

let rePassStatements: RegExpOrRegExpExt<PPS>[] | undefined;

export async function prsPass(pcc: PassCamelConfig, links: Link[]){
    const {Pass} = pcc;
    const defaultLink = {
        inferTriggerEvent: true,
        localInstance: 'local',
        passDirection: 'away',
        skipInit: true,

    } as Link;
    const {tryParse} = await import('be-enhanced/cpu.js');
    if(rePassStatements === undefined){
        const {downstreamPropPath, to} = await import('./reCommon.js');
        rePassStatements = [
            {
                regExp: new RegExp(String.raw `${downstreamPropPath}${to}(?<upstreamMarker>\w+)(?<!\\)Marker`),
                defaultVals: {

                }
            }
        ];
    }
    for(const passString of Pass!){
        const test = tryParse(passString, rePassStatements) as PassStatement;
        if(test !== null){
            const {downstreamPropPath, upstreamMarker} = test;
            if(upstreamMarker !== undefined){
                const link: Link = {
                    ...defaultLink,
                    downstreamPropPath,
                    upstreamCamelQry: 'upSearchFor' + upstreamMarker + 'M',// ['upSearch', upstreamMarker + 'M'],
                    upstreamPropPath: upstreamMarker,
                    inferTriggerEvent: true,
                };
                links.push(link);
            }
        }
    }
}