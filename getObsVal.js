export async function getObsVal(remoteRef, elO, enhancedElement) {
    let remoteVal;
    const { elType, prop } = elO;
    //TODO:  Generic code.  Share with be-bound/Bind.js/#reconcileValues
    switch (elType) {
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
            const { getSubProp } = await import('trans-render/lib/prs/prsElO.js');
            const dynSubProp = getSubProp(elO, enhancedElement);
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
