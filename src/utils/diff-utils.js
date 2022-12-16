import {
  flow,
  set,
  isEmpty,
  map,
  filter,
  symmetricDifference,
  difference,
  spread,
  get,
  first,
} from 'lodash/fp';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import {
  findUniqueKeys,
  getActivationTypes,
  omitEmptyKeys,
} from './generic-utils';
import { IS_DEV } from '../constants';

const filterByActivationType =
  (activationType) =>
  ({ fixedActivationTypes }) =>
    symmetricDifference(
      fixedActivationTypes,
      getActivationTypes(activationType),
    ).length === 0;

const getRoles = (activationType, permissions) =>
  flow(
    first,
    get('rolePermissions'),
    filter(filterByActivationType(activationType)), //
    map('role'),
  )(permissions);

const findDiffsByType = (
  activationType,
  permissionsFe,
  permissionsBe,
) => {
  const rolesFe = getRoles(activationType, permissionsFe);
  const rolesBe = getRoles(activationType, permissionsBe);

  return omitEmptyKeys({
    fe: difference(rolesFe, rolesBe),
    be: difference(rolesBe, rolesFe),
  });
};

const findAllDiffs = (permissionsFe, permissionsBe) =>
  omitEmptyKeys({
    new: findDiffsByType('new', permissionsFe, permissionsBe),
    portIn: findDiffsByType('portIn', permissionsFe, permissionsBe),
    both: findDiffsByType('both', permissionsFe, permissionsBe),
  });

export const findDiffs = (fe, be) => {
  let diffs = {};

  const allPartNums = findUniqueKeys(fe, be);

  allPartNums.forEach((partNum) => {
    const diff = flow(
      map(get([partNum, 'fixedPricePointRolePermissions'])),
      spread(findAllDiffs),
    )([fe, be]);

    if (!isEmpty(diff)) {
      diffs = set(partNum, diff, diffs);
    }
  });

  return diffs;
};

export const writeDiffs = (diffs) => {
  const resultsDir = join(__dirname, '..', '..', 'results');
  const fileName = `${
    IS_DEV ? 'dev-' : ''
  }found-diffs-${new Date().getTime()}.json`;

  if (!existsSync(resultsDir)) {
    mkdirSync(resultsDir);
  }

  writeFileSync(
    join(resultsDir, fileName),
    JSON.stringify(diffs, null, 2),
    'utf-8',
  );
};
