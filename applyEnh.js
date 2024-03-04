import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
export async function applyEnh(instance, enhancement, wait) {
    const enh = camelToLisp(enhancement);
    if (wait) {
        return await instance.beEnhanced.whenResolved(enh);
    }
    else {
        return await instance.beEnhanced.whenAttached(enh);
    }
}
