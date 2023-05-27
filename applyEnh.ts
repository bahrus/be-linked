export async function applyEnh(instance: Element, enhancement: string){
    const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
    const enh = camelToLisp(enhancement);
    return await (<any>instance).beEnhanced.whenDefined(enh);
}