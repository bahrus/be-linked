export async function doSettings(settings, enhancedElement) {
    const { enh } = settings;
    if (enh !== undefined) {
        for (const key in enh) {
            const enhancementSettings = enh[key];
            const base = enhancedElement.by[key];
            Object.assign(base, enhancementSettings);
        }
    }
}
