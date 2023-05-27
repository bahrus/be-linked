import {AP, IObserve, Link} from './types';
import {IBE} from 'be-enhanced/types';
export async function observe(ibe: IBE, link: Link): Promise<void>{
    console.log({ibe, link});
}