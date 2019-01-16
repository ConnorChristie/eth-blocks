import Web3 from 'web3';
import PromisifyBatchRequest from '../utils/PromisifyBatchRequest';

const web3 = new Web3('ws://localhost:8546');

export const subscribe = () => async (dispatch) => {
  const subscription = await web3.eth.subscribe('newBlockHeaders');

  subscription.on('data', blockHeader => {
    dispatch(setCurrentBlock(blockHeader.number));
    dispatch(processBlock(blockHeader.number));
  });
}

export const processBlock = (number) => async (dispatch) => {
  const block = await web3.eth.getBlock(number);

  const transactions = block.transactions.map(transaction => ({
    block: number,
    hash: transaction
  }));

  dispatch(addTransactions(transactions));
}

export const getLatestTransactions = () => async (dispatch, getState) => {
  const block = await web3.eth.getBlockNumber();
  const { lastBlock } = getState().transactions;

  if (block === lastBlock) {
    return;
  }

  dispatch(setCurrentBlock(block));

  const limit = Math.min(block, lastBlock + 1000);
  const batch = new PromisifyBatchRequest(web3);

  for (let i = lastBlock; i <= limit; i++) {
    batch.add(web3.eth.getBlock.request, i);
  }

  const blocks = await batch.execute();
  const transactions = blocks.filter(x => x.transactions)
    .map(b => b.transactions.map(t => ({
      block: b.number,
      hash: t
    })))
    .reduce((prev, current) => prev.concat(current), []);

  dispatch(setLastBlock(limit));
  dispatch(addTransactions(transactions));
};

export const addTransactions = (transactions) => ({
  type: 'ADD_TRANSACTIONS',
  payload: {
    transactions
  }
});

export const setCurrentBlock = (blockNumber) => ({
  type: 'SET_CURRENT_BLOCK',
  payload: {
    blockNumber
  }
});

export const setLastBlock = (blockNumber) => ({
  type: 'SET_LAST_BLOCK',
  payload: {
    blockNumber
  }
});
