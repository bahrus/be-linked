import { findRealm } from 'trans-render/lib/findRealm.js';
export async function getSignal(enhancedElement, type, prop, attr) {
    switch (type) {
        case '$': {
            const el = await findRealm(enhancedElement, ['wis', prop]);
            if (!el)
                throw 404;
            if (el.hasAttribute('contenteditable')) {
                throw 'NI';
            }
            else {
                import('be-value-added/be-value-added.js');
                const signal = await el.beEnhanced.whenResolved('be-value-added');
                return {
                    el,
                    signal,
                    ref: new WeakRef(signal)
                };
            }
        }
        case '@': {
            const el = await findRealm(enhancedElement, ['wf', prop]);
            if (!el)
                throw 404;
            return {
                el,
                signal: el,
                ref: new WeakRef(el)
            };
        }
        case '#': {
            const el = await findRealm(enhancedElement, ['wrn', '#' + prop]);
            if (!el)
                throw 404;
            return {
                el,
                signal: el,
                ref: new WeakRef(el)
            };
        }
        case '/': {
            const el = await findRealm(enhancedElement, 'hostish');
            if (!el)
                throw 404;
            import('be-propagating/be-propagating.js');
            //console.log('enhance with be-propagating');
            const bePropagating = await el.beEnhanced.whenResolved('be-propagating');
            //console.log('attached be-propagating');
            const signal = await bePropagating.getSignal(prop);
            return {
                el,
                signal,
                ref: new WeakRef(signal)
            };
        }
        case '-': {
            const el = await findRealm(enhancedElement, ['upSearch', `[${attr}]`]);
            if (!el)
                throw 404;
            import('be-propagating/be-propagating.js');
            const bePropagating = await el.beEnhanced.whenResolved('be-propagating');
            const signal = await bePropagating.getSignal(prop);
            return {
                el,
                signal,
                ref: new WeakRef(signal)
            };
        }
    }
}
