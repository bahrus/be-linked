import {Link, AP, CamelConfig} from './types';
export async function doSub(link: Link, ap: AP, catchAll: string){
    const {camelConfig} = ap!;
    const {arr} = await import('be-enhanced/cpu.js');
    if(camelConfig === undefined) return;
    const camelConfigs = arr(camelConfig) as CamelConfig[];
    for(const cc of camelConfigs){
        const {enh} = cc;
        for(const key in enh){
            const val = enh[key];
            if(val[catchAll] !== undefined){
                link.enhancement = key;
                link.downstreamPropName = catchAll;
                link.downstreamPropPath = catchAll;
            }
        }
    }

}