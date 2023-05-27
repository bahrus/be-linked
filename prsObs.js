let reObserveStatements;
export async function prsObj(cc, links, pp) {
    const { Observe, declare } = cc;
    const defaultLink = {
        observeDefaults: {}
    };
    const { tryParse } = await import('be-enhanced/cpu.js');
    const { adjustLink } = await import('./adjustLink.js');
    if (reObserveStatements === undefined) {
        reObserveStatements = [];
    }
    for (const observeString of Observe) {
        const test = tryParse(observeString, reObserveStatements, declare);
        if (test === null) {
            const names = observeString.split(',').forEach(s => s.trim());
            const link;
        }
    }
}
