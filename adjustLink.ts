import {Link, AP} from './types';
export async function adjustLink(link: Link, pp?: AP){
    const {downstreamPropPath, upstreamPropPath, exportSymbol, on} = link;
    if(downstreamPropPath !== undefined) link.downstreamPropPath = downstreamPropPath.replaceAll(':', '.');
    if(upstreamPropPath !== undefined) link.upstreamPropPath = upstreamPropPath.replaceAll(':', '.');
    if(on !== undefined){
        const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
        link.on = await camelToLisp(on);
    }
    if(exportSymbol !== undefined && pp !== undefined){
        const {getExportSym} = await import('./getExportSym.js');
        link.handler = await getExportSym(pp, exportSymbol);
    }
}