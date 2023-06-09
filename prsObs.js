let reObserveStatements;
export async function prsObj(cc, links, pp) {
    const { Observe, observeOverrides } = cc;
    const defaultLink = {
        localInstance: 'local',
        enhancement: 'beLinked',
        downstreamPropName: 'propertyBag',
    };
    //const { tryParse } = await import('be-enhanced/cpu.js');
    //const { adjustLink } = await import('./adjustLink.js');
    // if(reObserveStatements === undefined){
    //     reObserveStatements = [
    //     ]
    // }
    for (const observeString of Observe) {
        //const test = tryParse(observeString, reObserveStatements, declare);
        //if(test === null){
        const names = observeString.split(',').map(s => s.trim());
        const link = {
            ...defaultLink,
            observe: {
                scope: ['closestOrRootNode', 'form'],
                on: 'change',
                isFormElement: true,
                attr: 'name',
                ...observeOverrides,
                names
            }
        };
        links.push(link);
        //}
    }
}
