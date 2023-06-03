import {SharingCamelConfig, Link, LinkStatement, ParseOptions, MathOp, AllProps, AP, IObserve, Share} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';

let reShareStatements: RegExpOrRegExpExt<PSS>[] | undefined;

export async function prsShare(scc: SharingCamelConfig, links: Link[], pp: any){
    const {Share, shareOverrides} = scc;
    const defaultLink = {
        localInstance: 'local',
        upstreamCamelQry: ['upSearch', '[itemscope]']
    } as Link;
    const { tryParse } = await import('be-enhanced/cpu.js');
    //const { adjustLink } = await import('./adjustLink.js');
    if(reShareStatements === undefined){
        reShareStatements = [
            {
                regExp: new RegExp(String.raw `^(?<nameJoin>[\w\,]+)(?<!\\)From(?<source>Scope|ElementProps)`),
                defaultVals: {
                    
                }
            }
        ];
    }
    const {lc} = await import('be-enhanced/cpu.js');
    for(const shareString of Share!){
        const test = tryParse(shareString, reShareStatements) as ShareStatement | null;
        if(test !== null){
            const {nameJoin, source} = test;
            
            const names = nameJoin.split(',').map(s => lc(s.trim()));
            const link: Link = {
                ...defaultLink,
                enhancement: source === 'ElementProps' ? 'bePropagating': 'beScoped',
                upstreamPropName: source === 'ElementProps' ? 'propagator' : 'scope',

                share: {
                    scope: ['closestOrHost', '[itemscope]'],
                    attr: 'itemprop',
                    ...shareOverrides,
                    names,
                }
            };
            links.push(link);
        }
    }
}

interface ShareStatement{
    nameJoin: string,
    source: 'Scope' | 'ElementProps'
}

type PSS = Partial<ShareStatement>;

