import {InvokeCamelConfig, Link, LinkStatement, ParseOptions, MathOp, AllProps, AP, IObserve, Share} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';

let reInvokeStatements: RegExpOrRegExpExt<PIS>[] | undefined;

export async function prsInvoke(icc: InvokeCamelConfig, links: Link[], pp: any){
    const {Invoke, invokeOverrides} = icc;
    const defaultLink = {
        localInstance: 'local',
        inferInvokeTarget: true,
    } as Link;
    const { tryParse } = await import('be-enhanced/cpu.js');
    //const { adjustLink } = await import('./adjustLink.js');
    if(reInvokeStatements === undefined){
        reInvokeStatements = [
            {
                regExp: new RegExp(String.raw `^(?<invoke>[\w\:]+)(?<!\\)On(?<on>[\w\-]+)`),
                defaultVals: {
                    inferInvokeTriggerEvent: false,
                }
            },
            {
                regExp: new RegExp(String.raw `^(?<invoke>[\w\:]+)`),
                defaultVals: {
                    inferInvokeTriggerEvent: true,
                }
            }
        ];
    }
    for(const invokeString of Invoke!){
        const test = tryParse(invokeString, reInvokeStatements) as InvokeStatement | null;
        if(test !== null){
            const {invoke, inferInvokeTriggerEvent, on} = test;
            const link: Link = {
                ...defaultLink,
                inferInvokeTriggerEvent,
                invoke,
                on,
            };
            links.push(link);
        }
    }
}

interface InvokeStatement {
    invoke: string,
    on?: string,
    inferInvokeTriggerEvent?: boolean,
}

type PIS = Partial<InvokeStatement>