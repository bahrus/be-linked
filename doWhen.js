import { upstream, downstream } from './be-linked.js';
export async function doWhen(cc, downlinks) {
    const { When } = cc;
    const { tryParse } = await import('be-decorated/cpu.js');
    for (const whenStatement of When) {
        const test = tryParse(whenStatement, reWhen);
        if (test !== null) {
            downlinks.push({
                localInstance: 'local',
                passDirection: 'towards',
                skipInit: true,
                increment: true,
                ...test,
            });
        }
    }
}
const reWhen = new RegExp(String.raw `${upstream}ChangesIncrement${downstream}`);
