export function inferEvent(el) {
    switch (el.localName) {
        case 'input':
        case 'select':
        case 'textarea':
            return 'change';
        case 'form':
            return 'submit';
        default:
            return 'click';
    }
}
