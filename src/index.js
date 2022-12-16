import { keyBy, keys } from 'lodash/fp';
import { IS_DEV } from './constants';
import { findDiffs, startWork, writeDiffs } from './utils';
import { mockFe, mockBe } from './mocks';

(async () => {
  const [fe, be] = (
    await Promise.all([
      IS_DEV ? Promise.resolve(mockFe) : startWork('FE_DB'),
      IS_DEV ? Promise.resolve(mockBe) : startWork('BE_DB'),
    ])
  ).map(keyBy('partNum'));

  console.log('Finding diffs');

  const diffs = findDiffs(fe, be);
  writeDiffs(diffs);

  console.log(`Found ${keys(diffs).length} diffs`);
})();
