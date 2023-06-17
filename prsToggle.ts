import {ToggleCamelConfig, Link, LinkStatement, ParseOptions, MathOp, AllProps, AP, IObserve, Share, Source} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';


let reToggleStatements: RegExpOrRegExpExt<PTS>[] | undefined;
export async function prsToggle(tcc: ToggleCamelConfig, links: Link[], pp: any){
    const {Toggle, toggleOverrides} = tcc;
    const defaultLink = {
        on: 'click',
        localInstance: 'local',
        upstreamCamelQry: 'hostish',
        toggle: true,
        passDirection: 'away',
    } as Link;
    const { tryParse } = await import('be-enhanced/cpu.js');
    if(reToggleStatements === undefined){
        const {upstreamProperty} = await import('./reCommon.js');
        reToggleStatements = [
            {
                regExp: new RegExp(upstreamProperty),
                defaultVals: {

                }
            }
        ]
    }
    for(const toggleString of Toggle!){
        const test = tryParse(toggleString, reToggleStatements) as ToggleStatement;
        if(test !== null){
            const {upstreamPropPath} = test;
            const link: Link = {
                ...defaultLink,
                upstreamPropPath,
                
            }
            links.push(link);
        }
    }
}

interface ToggleStatement{
    upstreamPropPath: string,
} 

type PTS = Partial<ToggleStatement>;