const initialState = {
  message: '',
  visible: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SET_MESSAGE': {
      const { message } = action.payload;
      return {
        ...state,
        message,
        visible: true
      };
    }
    case 'DISMISS_ALERT':
      return {
        ...state,
        visible: false
      };
    default:
      return state;
  }
}
