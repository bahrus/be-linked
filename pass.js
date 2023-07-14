export async function pass(ibe, downlink) {
    const et = new ET();
    const { enhancedElement } = ibe;
    const { findRealm } = await import('trans-render/lib/findRealm.js');
    const { getVal } = await import('trans-render/lib/getVal.js');
    const { setProp } = await import('trans-render/lib/setProp.js');
    const { upstreamCamelQry, skipInit, upstreamPropPath, localInstance, downstreamPropPath, negate, translate, parseOption, handler, conditionValue, newValue, on, debug, nudge, increment, passDirection, enhancement, invoke, fire, toggle, assign, inferTriggerEvent } = downlink;
    let src = null;
    let dest;
    let srcPropPath;
    let destPropPath;
    //let destEnhancement: string | undefined;
    const upstreamRealm = await findRealm(enhancedElement, upstreamCamelQry);
    //const downstreamInstance = localInstance === 'local' ? enhancedElement : 
    const downstreamInstance = enhancedElement;
    switch (passDirection) {
        case 'towards':
            src = upstreamRealm;
            if (enhancement === undefined) {
                dest = downstreamInstance;
            }
            else {
                const { applyEnh } = await import('./applyEnh.js');
                dest = await applyEnh(downstreamInstance, enhancement);
            }
            srcPropPath = upstreamPropPath;
            destPropPath = downstreamPropPath;
            break;
        case 'away':
            src = downstreamInstance;
            srcPropPath = downstreamPropPath;
            destPropPath = upstreamPropPath;
            dest = upstreamRealm;
            break;
    }
    if (src === null)
        throw 'bL.404';
    const doPass = async (e) => {
        if (debug)
            debugger;
        switch (passDirection) {
            case 'away':
                if (dest === null)
                    dest = await findRealm(enhancedElement, upstreamCamelQry);
                break;
        }
        if (increment) {
            const val = await getVal({ host: dest }, destPropPath);
            const newVal = val + 1;
            await setProp(dest, destPropPath, newVal);
            et.value = newVal;
        }
        else if (handler !== undefined) {
            const objToAssign = await handler({
                remoteInstance: upstreamRealm,
                $0: enhancedElement,
                event: e,
            });
            Object.assign(dest, objToAssign);
            et.value = objToAssign;
        }
        else if (invoke !== undefined) {
            dest[invoke](dest, src, e);
        }
        else if (toggle) {
            const val = await getVal({ host: dest }, destPropPath);
            const newVal = !val;
            await setProp(dest, destPropPath, newVal);
            et.value = newVal;
        }
        else if (assign) {
            const val = await getVal({ host: src }, srcPropPath);
            if (typeof val === 'object') {
                Object.assign(dest, val);
            }
            et.value = val;
        }
        else {
            let val = await getVal({ host: src }, srcPropPath);
            if (parseOption) {
                const { parseVal } = await import('./parseVal.js');
                val = parseVal(val, parseOption);
            }
            if (negate)
                val = !val;
            if (translate)
                val = Number(val) + translate;
            if (conditionValue !== undefined) {
                if (val.toString() !== conditionValue.toString())
                    return;
                if (newValue !== undefined)
                    val = newValue;
            }
            if (destPropPath !== undefined) {
                await setProp(dest, destPropPath, val);
            }
            et.value = val;
        }
        if (fire !== undefined) {
            for (const fireInstance of fire) {
                dest.dispatchEvent(new Event(fireInstance));
            }
        }
    };
    if (!skipInit) {
        await doPass();
    }
    let upstreamPropName = downlink.upstreamPropName;
    if (upstreamPropName === undefined && upstreamPropPath !== undefined) {
        upstreamPropName = upstreamPropPath.split('.')[0];
        downlink.upstreamPropName = upstreamPropName;
    }
    if (on !== undefined || inferTriggerEvent) {
        let type = on;
        const eventTarget = passDirection === 'towards' ? src : enhancedElement;
        if (on === undefined) {
            if (eventTarget instanceof Element) {
                const { inferEvent } = await import('./inferEvent.js');
                type = inferEvent(eventTarget);
            }
            else {
                type = upstreamPropName;
            }
        }
        eventTarget.addEventListener(type, async (e) => {
            await doPass();
        });
    }
    else {
        let propagator = null;
        if (!src._isPropagating) {
            import('be-propagating/be-propagating.js');
            const aSrc = src;
            const bePropagating = await aSrc.beEnhanced.whenResolved('be-propagating');
            propagator = bePropagating.propagators.get('self');
        }
        else {
            propagator = src;
        }
        propagator.addEventListener(upstreamPropName, async (e) => {
            await doPass();
        });
    }
    if (nudge && src instanceof Element) {
        const { nudge } = await import('trans-render/lib/nudge.js');
        nudge(src);
    }
    return et;
}
class ET extends EventTarget {
    #value;
    get value() { return this.#value; }
    set value(nv) {
        this.#value = nv;
        this.dispatchEvent(new Event('value'));
    }
}
