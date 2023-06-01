export async function inferHost(invokingElement: Element, method: string){
    //TODO:  cache with weakmap
    const splitMethod = method.split('.');
    const methodRoot = splitMethod[0];
    const itemScopeQry = '[itemscope]';
    let closestItemScope = invokingElement.closest(itemScopeQry);
    while(closestItemScope !== null){
        const {localName} = closestItemScope;
        if(localName.includes('-')){
            await customElements.whenDefined(localName);
            if(closestItemScope[methodRoot] !== undefined) return closestItemScope;
        }
        closestItemScope = closestItemScope.parentElement;
        if(closestItemScope !== null){
            closestItemScope = closestItemScope.closest(itemScopeQry);
        }
    }
    let host = (invokingElement.getRootNode() as any).host;
    if(!(host instanceof Element)) throw 404;
    const {localName} = host;
    if(localName.includes('-')){
        await customElements.whenDefined(localName);
        if(host[methodRoot] === undefined) throw 404;
        return host;
    }
    
}