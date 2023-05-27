import {CamelConfig, Link, LinkStatement, ParseOptions, MathOp, AllProps, AP, IObserve} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';

let reObserveStatements: RegExpOrRegExpExt<POPS>[] | undefined;
export async function prsObj(cc: CamelConfig, links: Link[], pp: AP){
    const {Observe, declare} = cc;
    const defaultLink = {
        observeDefaults:{
            
        }
    } as Link;
    const { tryParse } = await import('be-enhanced/cpu.js');
    const { adjustLink } = await import('./adjustLink.js');
    if(reObserveStatements === undefined){
        reObserveStatements = [

        ]
    }

    for(const observeString of Observe!){
        const test = tryParse(observeString, reObserveStatements, declare);
        if(test === null){
            const names = observeString.split(',').forEach(s => s.trim());
            const link
        }
    }
}

interface ObserveStatement {
    args: string,
    by: string,
}

type POPS = Partial<ObserveStatement>;