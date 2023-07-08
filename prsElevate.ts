import {ElevateCamelConfig, Link, LinkStatement, ParseOptions, MathOp, AllProps, AP, IObserve, Share, Source} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';

interface ElevateStatement{
    downstreamPropPath: string,
    upstreamMarker: string
}

type PPS = Partial<ElevateStatement>;

let reElevateStatements: RegExpOrRegExpExt<PPS>[] | undefined;

export async function prsElevate(ecc: ElevateCamelConfig, links: Link[]){
    const {Elevate} = ecc;
    const defaultLink = {
        inferTriggerEvent: true,
        localInstance: 'local',
        passDirection: 'away',
        skipInit: true,

    } as Link;
    const {tryParse} = await import('be-enhanced/cpu.js');
    const {lispToCamel} = await import('trans-render/lib/lispToCamel.js');
    if(reElevateStatements === undefined){
        const {downstreamPropPath, PropertyTo} = await import('./reCommon.js');
        reElevateStatements = [
            {
                regExp: new RegExp(String.raw `${downstreamPropPath}${PropertyTo}(?<upstreamMarker>[\w\-\\]+)(?<!\\)Marker`),
                defaultVals: {

                }
            }
        ];
    }
    for(const passString of Elevate!){
        const test = tryParse(passString, reElevateStatements) as ElevateStatement;
        if(test !== null){
            const {downstreamPropPath, upstreamMarker} = test;
            if(upstreamMarker !== undefined){
                const clUpstreamMarker = lispToCamel(upstreamMarker.replace('\\', ''));
                const link: Link = {
                    ...defaultLink,
                    downstreamPropPath,
                    upstreamCamelQry: 'upSearchFor' + clUpstreamMarker + 'M',// ['upSearch', upstreamMarker + 'M'],
                    upstreamPropPath: clUpstreamMarker,
                    inferTriggerEvent: true,
                };
                links.push(link);
            }
        }
    }
}