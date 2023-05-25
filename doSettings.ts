import {Settings} from './types';
export async function doSettings(settings: Settings, enhancedElement: Element){
    const {enh} = settings;
    if(enh !== undefined){
        for(const key in enh){
            const enhancementSettings = enh[key];
            const {autoImport} = enhancementSettings;
            if(autoImport !== undefined){
                if(autoImport === true){
                    const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
                    const lisp = camelToLisp(key);
                    import(`${lisp}/${lisp}.js`);
                }
            }
            const base = (<any>enhancedElement).beEnhanced.by[key];
            Object.assign(base, enhancementSettings);
        }
    }
}