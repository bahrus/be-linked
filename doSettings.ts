import {Settings} from './types';
export async function doSettings(settings: Settings, enhancedElement: Element){
    const {enh} = settings;
    if(enh !== undefined){
        for(const key in enh){
            const enhancementSettings = enh[key];
            const base = (<any>enhancedElement).by[key];
            Object.assign(base, enhancementSettings);
        }
    }
}