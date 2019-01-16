const initialState = {
  contracts: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'ADD_CONTRACT': {
      const { name, abi } = action.payload;
      return {
        ...state,
        contracts: {
          ...state.contracts,
          [name]: abi
        }
      };
    }
    default:
      return state;
  }
}
