import { Worker } from 'worker_threads';
import {
  flow,
  flatMap,
  uniq,
  isEmpty,
  keys,
  omitBy,
} from 'lodash/fp';
import { join } from 'path';

export const startWork = (dbName) =>
  new Promise((resolve, reject) => {
    const workerPath = join(__dirname, '..', 'worker.js');
    const worker = new Worker(workerPath);

    worker.once('message', resolve);
    worker.once('error', reject);
    worker.postMessage(dbName);
  });

export const getActivationTypes = (type) =>
  ({
    new: ['new'],
    portIn: ['portIn'],
    both: ['new', 'portIn'],
  }[type]);

export const findUniqueKeys = (objA, objB) =>
  flow(
    flatMap(keys), //
    uniq,
  )([objA, objB]);

export const omitEmptyKeys = omitBy(isEmpty);
