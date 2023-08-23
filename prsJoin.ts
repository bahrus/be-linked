import {JoinCamelConfig, Link, LinkStatement, ParseOptions, MathOp, AllProps, AP, IObserve, Share, Source} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';

interface JoinStatement{
    expr: string,
    prop: string,
}

type PJS = Partial<JoinStatement>;

let reJoinStatements: RegExpOrRegExpExt<PJS>[] | undefined;

export async function prsJoin(jcc: JoinCamelConfig, links: Link[]){
    const {Join} = jcc;
    const defaultLink = {
        
    }
}