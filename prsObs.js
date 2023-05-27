let reObserveStatements;
export async function prsObj(cc, links, pp) {
    const { Observe, declare, observeDefaults } = cc;
    const defaultObserve = {
        scope: ['closestOrRootNode', 'form']
    };
    const defaultLink = {
        observe: defaultObserve
    };
    Object.assign(defaultObserve, observeDefaults);
    const { tryParse } = await import('be-enhanced/cpu.js');
    const { adjustLink } = await import('./adjustLink.js');
    if (reObserveStatements === undefined) {
        reObserveStatements = [];
    }
    for (const observeString of Observe) {
        const test = tryParse(observeString, reObserveStatements, declare);
        if (test === null) {
            const names = observeString.split(',').map(s => s.trim());
            const observe = {
                ...defaultObserve,
                names
            };
            const link = {
                ...defaultLink,
                observe,
            };
            links.push(link);
        }
    }
}
