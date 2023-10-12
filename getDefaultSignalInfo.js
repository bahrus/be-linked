"use strict";
function getDefaultSignalInfo(enhancedElement) {
    const { localName } = enhancedElement;
    switch (localName) {
        case 'input':
            return {
                eventTarget: enhancedElement,
                type: 'input'
            };
    }
    throw 'NI';
}
