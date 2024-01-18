import { findRealm } from 'trans-render/lib/findRealm.js';
import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
const realmMap = new Map([
    ['#', (remoteProp) => ['wrn', '#' + remoteProp]],
    ['/', 'hostish'],
    ['@', (remoteProp) => ['wf', remoteProp]],
    ['|', (remoteProp) => ['wis', remoteProp]],
    ['-', (remoteProp) => ['us', `[-${camelToLisp(remoteProp)}]`]],
    ['$', (remoteProp) => { throw 'NI'; }]
]);
export async function getRemoteEl(enhancedElement, typ, remoteProp) {
    const scopeOrScopeFn = realmMap.get(typ);
    const scope = (typeof scopeOrScopeFn === 'function' ? scopeOrScopeFn(remoteProp) : scopeOrScopeFn);
    const el = await findRealm(enhancedElement, scope);
    if (!el)
        throw 404;
    return el;
}
