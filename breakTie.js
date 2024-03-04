const typeComp = new Map([
    ['string.undefined', 'local'],
    ['string.string', 'tie'],
    ['boolean.undefined', 'local'],
    ['string.object', 'remote'],
]);
export function breakTie(localVal, remoteVal) {
    const localType = typeof localVal;
    const remoteType = typeof remoteVal;
    const sameType = localType === remoteType;
    let winner = typeComp.get(`${localType}.${remoteType}`);
    let val = localVal;
    switch (winner) {
        case 'tie':
            switch (localType) {
                case 'string':
                    if (localVal.length > remoteVal.length) {
                        winner = 'local';
                        val = localVal;
                    }
                    else {
                        winner = 'remote';
                        val = remoteVal;
                    }
            }
            break;
        case 'remote':
            val = remoteVal;
            break;
    }
    return {
        winner,
        val
    };
}
