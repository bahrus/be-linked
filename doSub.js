export async function doSub(link, ap, catchAll) {
    const { camelConfig } = ap;
    const { arr } = await import('be-enhanced/cpu.js');
    if (camelConfig === undefined)
        return;
    const camelConfigs = arr(camelConfig);
    for (const cc of camelConfigs) {
        const { enh } = cc;
        for (const key in enh) {
            const val = enh[key];
            if (val[catchAll] !== undefined) {
                link.enhancement = key;
                link.downstreamPropName = catchAll;
                link.downstreamPropPath = catchAll;
            }
        }
    }
}
