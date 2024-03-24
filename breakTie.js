const typeComp = new Map([
    ['string.undefined', 'local'],
    ['string.string', 'tie'],
    ['boolean.undefined', 'local'],
    ['string.object', 'remote'],
    ['string.null', 'local']
]);
export function breakTie(localVal, remoteVal) {
    const localType = typeof localVal;
    const remoteType = remoteVal === null ? 'null' : typeof remoteVal;
    const sameType = localType === remoteType;
    let winner = sameType ? 'tie' : typeComp.get(`${localType}.${remoteType}`);
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
                    break;
                case 'boolean':
                    if (sameType) {
                        //since the values are different, one should take precedence
                        val = true;
                        if (localVal) {
                            winner = 'local';
                        }
                        else {
                            winner = 'remote';
                        }
                    }
                    break;
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
