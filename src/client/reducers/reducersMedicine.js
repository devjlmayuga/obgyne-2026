import {
  MEDICINE_SALES_LIST,
  INVENTORY_LIST,
  SELECTED_ITEM
} from '../actions/actionMedicines';

const initialState = {
  medSalesList: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MEDICINE_SALES_LIST:
      return {
        ...state,
        medSalesList: action.payload
      };
    case INVENTORY_LIST:
      const inventory = _.isArray(action.payload)
        ? _.orderBy(action.payload, 'name', 'asc')
        : {
            ...action.payload,
            data: _.orderBy(action.payload && action.payload.data, 'name', 'asc')
          };
      return {
        ...state,
        inventory
      };
    case SELECTED_ITEM:
      return {
        ...state,
        selectedItem: action.payload
      };
    default:
      return state;
  }
}
