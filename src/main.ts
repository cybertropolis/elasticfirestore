import { Environment } from './environment';
import { Monitor } from './monitor';

const environment = new Environment();
const monitor = new Monitor(environment);

monitor.start();
