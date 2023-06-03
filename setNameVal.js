export async function setNameVal(el, val) {
    if ('value' in el) {
        el['value'] = val;
        return;
    }
    if ('href' in el) {
        el['href'] = val;
    }
    el.textContent = val;
}
