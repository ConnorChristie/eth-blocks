import _ from 'lodash';

const initialState = {
  transactions: [],
  currentBlock: 0,
  lastBlock: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TRANSACTIONS': {
      const { transactions } = action.payload;
      return {
        ...state,
        transactions: _.chain(state.transactions)
          .concat(transactions)
          .uniqBy('hash')
          .orderBy('block', 'desc')
          .value()
      };
    }
    case 'SET_CURRENT_BLOCK':
      return {
        ...state,
        currentBlock: action.payload.blockNumber
      };
    case 'SET_LAST_BLOCK':
      return {
        ...state,
        lastBlock: action.payload.blockNumber
      };
    default:
      return state;
  }
}
