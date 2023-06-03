export async function setNameVal(el: Element, val: any){
    if('value' in el){
        el['value'] = val;
        return;
    }
    if('href' in el){
        el['href'] = val;
    }
    el.textContent = val;
}