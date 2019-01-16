import { showAlert } from './alertStatus';

export const addContract = (name, abi) => (dispatch) => {
  dispatch({
    type: 'ADD_CONTRACT',
    payload: {
      name,
      abi
    }
  });

  dispatch(showAlert('Successfully added contract ABI for MyManager', 5000));
};