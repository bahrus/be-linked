export function parseVal(val, option) {
    if (!option)
        return val;
    switch (option) {
        case 'date':
            return new Date(val);
        case 'number':
            return Number(val);
        case 'object':
            return JSON.parse(val);
        case 'string':
            return JSON.stringify(val);
        case 'regExp':
            return new RegExp(val);
        case 'url':
            return new URL(val);
    }
}
