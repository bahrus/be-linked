import {CamelConfig, Link, LinkStatement, ParseOptions, MathOp, AllProps, AP, IObserve} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';

let reObserveStatements: RegExpOrRegExpExt<POPS>[] | undefined;
export async function prsObj(cc: CamelConfig, links: Link[], pp: AP){
    const {Observe, declare, observeDefaults} = cc;
    const defaultObserve = {

    } as IObserve;
    const defaultLink = {
        observe: defaultObserve
    } as Link;
    Object.assign(defaultObserve, observeDefaults);
    const { tryParse } = await import('be-enhanced/cpu.js');
    const { adjustLink } = await import('./adjustLink.js');
    if(reObserveStatements === undefined){
        reObserveStatements = [

        ]
    }

    for(const observeString of Observe!){
        const test = tryParse(observeString, reObserveStatements, declare);
        if(test === null){
            const names = observeString.split(',').map(s => s.trim());
            const observe: IObserve = {
                ...defaultObserve,
                names
            };
            const link: Link = {
                ...defaultLink,
                observe,
            };
            links.push(link);
        }
    }
}

interface ObserveStatement {
    args: string,
    by: string,
}

type POPS = Partial<ObserveStatement>;