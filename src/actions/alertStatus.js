export const showAlert = (message, timeout) => (dispatch) => {
  dispatch(setMessage(message));

  if (timeout) {
    setTimeout(() => dispatch(dismissAlert()), timeout);
  }
};

export const setMessage = (message) => ({
  type: 'SET_MESSAGE',
  payload: {
    message
  }
});

export const dismissAlert = () => ({
  type: 'DISMISS_ALERT'
});
