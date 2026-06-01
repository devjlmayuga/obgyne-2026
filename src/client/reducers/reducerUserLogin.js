import { ADMIN_USER_LOGIN } from '../actions/actionUserLogin';

const initialState = {
  data: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADMIN_USER_LOGIN:
      return {
        ...state,
        data: action.payload
      };
    default:
      return state;
  }
}
