import {AssignCamelConfig, Link} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';

let reAssignStatements: RegExpOrRegExpExt<PAS>[] | undefined;
export async function prsAssign(acc: AssignCamelConfig, links: Link[]){
    const {Assign} = acc;
    const defaultLink = {
        localInstance: 'local',
        upstreamCamelQry: 'hostish',
        passDirection: 'towards',
        assign: true,
    } as Link;
    const { tryParse } = await import('be-enhanced/cpu.js');
    if(reAssignStatements === undefined){
        const {upstreamProperty} = await import('./reCommon.js');
        reAssignStatements = [
            {
                regExp: new RegExp(upstreamProperty),
                defaultVals: {

                }
            }
        ]
    }
    for(const assigmentString of Assign!){
        const test = tryParse(assigmentString, reAssignStatements) as AssignStatement;
        if(test !== null){
            const {upstreamPropPath} = test;
            const link: Link = {
                ...defaultLink,
                upstreamPropPath,
            };
            links.push(link);
        }
    }
}

interface AssignStatement{
    upstreamPropPath: string,
}

type PAS = Partial<AssignStatement>;