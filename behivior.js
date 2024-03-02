import { register } from 'be-hive/register.js';
import { tagName } from './be-linked.js';
import './be-linked.js';
const ifWantsToBe = 'linked';
const upgrade = '*';
register(ifWantsToBe, upgrade, tagName);
