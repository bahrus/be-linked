export async function applyEnh(instance, enhancement) {
    const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
    const enh = camelToLisp(enhancement);
    return await instance.beEnhanced.whenDefined(enh);
}
