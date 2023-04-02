import {PP, Link} from './types';
export async function pass(pp: PP, downlink: Link){
    const {canonicalConfig, self, proxy} = pp;
        
    const {findRealm} = await import('trans-render/lib/findRealm.js');
    const {getVal} = await import('trans-render/lib/getVal.js');
    const {setProp} = await import('trans-render/lib/setProp.js');
    const {
        upstreamCamelQry, skipInit, upstreamPropPath, localInstance, 
        downstreamPropPath, negate, translate, parseOption, handler,
        conditionValue, newValue, on, debug, nudge, increment, passDirection,
        invoke, fire
    } = downlink;
    let src: EventTarget | null = null;
    let dest: Element;
    let srcPropPath: string;
    let destPropPath: string | undefined;
    const upstreamRealm = await findRealm(self, upstreamCamelQry);
    const downstreamInstance = localInstance === 'local' ? self : proxy
    switch(passDirection){
        case 'towards':
            src = upstreamRealm;
            dest = downstreamInstance;
            srcPropPath = upstreamPropPath;
            destPropPath = downstreamPropPath;
            break;
        case 'away':
            src = downstreamInstance;
            srcPropPath = downstreamPropPath!;
            destPropPath = upstreamPropPath;
            dest = upstreamRealm as Element;
            break;
    }
    if(src === null) throw 'bL.404';
    const doPass = async (e?: Event) => {
        if(debug) debugger;
        if(increment){
            const val = await getVal({host: dest}, destPropPath!);
            await setProp(dest, destPropPath!, val + 1);
        }else if(handler !== undefined){
            const objToAssign = await handler({
                remoteInstance: upstreamRealm!,
                adornedElement: self,
                event: e,
            });
            Object.assign(dest, objToAssign);
        }else if(invoke !== undefined){
            (<any>dest)[invoke](dest, src, e)
        }else{
            let val =  await getVal({host: src}, srcPropPath);
            if(parseOption){
                const {parseVal} = await import('./parseVal.js');
                val = parseVal(val, parseOption);
            }
            if(negate) val = !val;
            if(translate) val = Number(val) + translate;
            if(conditionValue !== undefined){
                if(val.toString() !== conditionValue.toString()) return;
                if(newValue !== undefined) val = newValue;
            }
            if(destPropPath !== undefined){
                await setProp(dest, destPropPath, val);
            }
        }
        if(fire !== undefined){
            for(const fireInstance of fire){
                dest.dispatchEvent(new Event(fireInstance));
            }
        }
    }
    if(!skipInit){
        await doPass();
    }

    let upstreamPropName = downlink.upstreamPropName;
    if(upstreamPropName === undefined && upstreamPropPath !== undefined){
        upstreamPropName = upstreamPropPath.split('.')[0];
        downlink.upstreamPropName = upstreamPropName;
    }
    if(on !== undefined){
        const eventTarget = passDirection === 'towards' ? src : self;
        eventTarget.addEventListener(on, async e => {
            await doPass();
        });
    }else{
        let propagator: EventTarget | null = null;
        if(!(<any>src)._isPropagating){
            const aSrc = src as any;
            if(!aSrc?.beDecorated?.propagating){
                const {doBeHavings} = await import('trans-render/lib/doBeHavings.js');
                import('be-propagating/be-propagating.js');
                await doBeHavings(src as any as Element, [{
                    be: 'propagating',
                    waitForResolved: true,
                }]);
            }
            propagator = aSrc.beDecorated.propagating.propagators.get('self') as EventTarget;
            
            //await aSrc.beDecorated.propagating.proxy.controller.addPath('self');
        }else{
            propagator = src;
        }
        propagator.addEventListener(upstreamPropName!, async e => {
            await doPass();
        });
    }
    if(nudge && src instanceof Element){
        const {nudge} = await import('trans-render/lib/nudge.js');
        nudge(src);
    }
}