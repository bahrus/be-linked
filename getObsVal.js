export async function getObsVal(remoteRef, specifier, enhancedElement) {
    let remoteVal;
    const { s, prop } = specifier;
    switch (s) {
        case '|':
        case '#':
        case '@':
            {
                const { getSignalVal } = await import('./getSignalVal.js');
                remoteVal = getSignalVal(remoteRef);
            }
            break;
        case '-':
        case '/':
            remoteVal = remoteRef[prop];
            break;
        case '~':
            const { getSubProp } = await import('trans-render/dss/find.js');
            const dynSubProp = getSubProp(specifier, enhancedElement);
            if (dynSubProp) {
                const head = dynSubProp[0];
                if (head === '.') {
                    throw 'NI';
                }
                else {
                    remoteVal = remoteRef[dynSubProp];
                }
            }
            break;
        default:
            throw 'NI';
    }
    return remoteVal;
}
