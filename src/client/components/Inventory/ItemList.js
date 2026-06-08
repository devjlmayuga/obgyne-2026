import React from 'react';

import { Button } from 'reactstrap';

const ItemList = props => {
  const itemList = props.invetoryList;
  let items = '';

  // 0 for invalid checkup
  const { pristine, submitting } = props;

  if (_.isArray(itemList)) {
    items = _.map(itemList, (med, index) => {
      const { name, qty, unit_price } = med;

      let btn = (
        <div>
          <Button
            type="submit"
            size="sm"
            color="primary"
            onClick={() => props.toggleUpdate(med)}
          >
            <i className="fa fa-pencil" />
          </Button>
          &nbsp;
          <Button
            type="submit"
            size="sm"
            color="danger"
            onClick={() => props.toggleDelete(med)}
          >
            <i className="fa fa-trash" />
          </Button>
        </div>
      );

      if (props.displayPurchaseButton && props.displayPurchaseButton === true) {
        btn = (
          <Button
            type="submit"
            size="sm"
            disabled={pristine || submitting}
            color="primary"
            onClick={() => props.addToCart(med)}
          >
            <i className="fa fa-cart-plus" />
          </Button>
        );
      }

      props.displayPurchaseButton;

      return (
        <tr key={med.medicine_id || index}>
          <td>{name}</td>
          <td>{qty}</td>
          <td>&#x20B1; {unit_price}</td>
          <td className="text-right">{btn}</td>
        </tr>
      );
    });
  }

  return items;
};

export default ItemList;
