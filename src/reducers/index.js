import { combineReducers } from 'redux';

import contracts from './contracts';
import transactions from './transactions';
import alertStatus from './alertStatus';

export default combineReducers({
  contracts,
  transactions,
  alertStatus
});
