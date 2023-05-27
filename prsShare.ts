import {CamelConfig, Link, LinkStatement, ParseOptions, MathOp, AllProps, AP, IObserve} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';

let reShareStatements: RegExpOrRegExpExt<PSS>[] | undefined;

export async function prsShare(cc: CamelConfig, links: Link[], pp: AP){
    const {Share, shareDefaults} = cc;
    const defaultLink = {
        localInstance: 'local',
        enhancement: 'beScoped',
        upstreamPropName: 'scope',
        upstreamCamelQry: ['closestOrHost', '[itemscope]']
    } as Link;
    for(const shareString of Share!){
        const names = shareString.split(',').map(s => s.trim());
        const link: Link = {
            ...defaultLink,
            share: {
                scope: ['closestOrHost', '[itemscope]'],
                attr: 'itemprop',
                ...shareDefaults,
                names,
            }
        }
        links.push(link);
    }
}

interface ShareStatement{

}

type PSS = Partial<ShareStatement>;

