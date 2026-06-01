import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import UserLogin from './reducerUserLogin';
import Patient from './reducerPatient';
import Medicine from './reducersMedicine';

const appReducer = combineReducers({
  form: formReducer,
  userIdentity: UserLogin,
  patient: Patient,
  medicine: Medicine
});

export const rootReducer = (state, action) => {
  let reInitializeState = state;

  if (action.type === 'CLEAR_USER_SESSION') {
    reInitializeState = {};
  }

  return appReducer(reInitializeState, action);
};

export default rootReducer;
