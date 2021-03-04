import { createSelector } from 'reselect';
import { getSelectorProps } from './baseSelectors';

export const sendBoxSelector = createSelector([getSelectorProps], ({ displayName, userId }) => ({
  displayName,
  userId
}));
