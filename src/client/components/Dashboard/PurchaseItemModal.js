import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { withRouter } from 'react-router';

import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  CardBody,
  Row,
  Col,
  Table,
  Input
} from 'reactstrap';

// action
import {
  fetchInventoryList,
  fetchTodayMedSalesList
} from '../../actions/actionMedicines';
import { purchaseMed } from '../../actions/actionPurchase';

// component
import SearchBar from '../ReusableComp/SearchBar';
import ItemList from '../Inventory/ItemList';
import { Loader, Alert } from '../Utilities/Modals';

class PurchaseItemModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: '',
      inventoryList: {},
      isLoading: false,
      cartList: [],
      isAlert: false,
      alertClassName: 'modal-primary',
      alertMessage: ''
    };

    this.submitForm = this.submitForm.bind(this);
    this.togglePurchaseItem = this.togglePurchaseItem.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.updateItemQty = this.updateItemQty.bind(this);
    this.addOneItemQty = this.addOneItemQty.bind(this);
    this.buyItems = this.buyItems.bind(this);
  }

  togglePurchaseItem() {
    this.setState({
      isPurchaseItem: !this.state.isPurchaseItem
    });
  }

  inventorySearch(term) {
    this.props.fetchInventoryList(term, inventoryList => {
      this.setState({
        inventoryList,
        isLoading: false
      });
    });
  }

  updateItemQty(medId, qty) {
    let { cartList } = this.state;
    const objIndex = cartList.findIndex(obj => obj.medicine_id == medId);

    cartList[objIndex].qty = qty;
    cartList[objIndex].total_price =
      parseInt(qty || 0) * cartList[objIndex].unit_price;
    this.setState({
      cartList
    });
  }

  buyItems() {
    this.setState({ isLoading: true });
    const { cartList } = this.state;
    this.props.purchaseMed(cartList, response => {
      if (!response) {
        this.setState({
          isLoading: false,
          isAlert: true,
          alertClassName: 'modal-danger',
          alertMessage: 'Failed to purchased medicine!'
        });
      } else {
        this.props.fetchTodayMedSalesList(null, () => {
          this.setState({
            isLoading: false,
            isAlert: true,
            alertClassName: 'modal-success',
            alertMessage: 'Medicine successfully purchased!',
            cartList: []
          });
          this.props.closePurchaseModal();
        });
      }
    });
  }

  submitForm() {}

  cartRow(cartListitems) {
    let items = _.map(cartListitems, (med, index) => {
      const { medicine_id, name, unit_price, qty } = med;

      return (
        <tr key={medicine_id}>
          <td colSpan="2">{name}</td>
          <td className="text-right">
            <FormGroup>
              <Input
                type="numeric"
                maxLength="4"
                style={{ width: '55px' }}
                placeholder="qty"
                value={qty}
                onChange={event => {
                  this.updateItemQty(medicine_id, event.target.value);
                }}
              />
            </FormGroup>
          </td>
          <td>&#x20B1; {parseFloat(unit_price || 0) * qty}</td>
        </tr>
      );
    });
    return items;
  }

  addOneItemQty(medId) {
    let { cartList } = this.state;
    const objIndex = cartList.findIndex(obj => obj.medicine_id == medId);
    cartList[objIndex].qty = parseInt(cartList[objIndex].qty) + 1;

    cartList[objIndex].total_price =
      (parseInt(cartList[objIndex].qty) + 1) *
      parseFloat(cartList[objIndex].unit_price);

    this.setState({
      cartList
    });
  }

  addToCart(med) {
    let { cartList } = this.state;
    const { checkupId } = this.props;
    let { medicine_id, name, unit_price } = med;

    // check item if exists in cart
    if (_.find(cartList, { medicine_id })) {
      // +1 qty to med if it's existing
      this.addOneItemQty(medicine_id);
    } else {
      cartList.push({
        schedule_checkup_id: checkupId,
        medicine_id: medicine_id,
        qty: 1,
        name: name,
        unit_price: unit_price,
        total_price: parseInt(unit_price)
      });

      this.setState({
        cartList
      });
    }
  }

  componentDidMount() {
    this.inventorySearch('');
  }

  render() {
    const inventorySearch = _.debounce(term => {
      this.inventorySearch(term);
    }, 300);

    let { inventoryList, cartList, isLoading } = this.state;
    let meds = [];

    // if (this.state.isLoading) {
    //   return <Loader open={this.state.isLoading} />;
    // }

    if (_.isArray(inventoryList)) {
      meds = (
        <ItemList
          invetoryList={inventoryList}
          toggleUpdate={() => {}}
          toggleDelete={() => {}}
          toggleAddToCart={() => {}}
          addToCart={this.addToCart}
          displayPurchaseButton={true}
        />
      );
    }

    let { handleSubmit, selectedItem } = this.props;
    selectedItem = { name: 'test' };
    if (!selectedItem) {
      return '';
    }

    let totalPrice = _.sumBy(cartList, 'total_price') || 0;

    return (
      <Modal
        isOpen={this.props.displayModal}
        toggle={this.props.onTogglePurchaseModal}
        className={'modal-lg ' + this.props.className}
      >
        <Form
          className="PurchaseItemForm"
          onSubmit={handleSubmit(this.submitForm)}
        >
          <ModalHeader toggle={this.toggleDanger}>
            Purchase Medicine
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <CardBody>
                  <SearchBar
                    placeholder="Enter item name..."
                    onSearchTermChange={inventorySearch}
                  />
                  <div
                    className="table-responsive"
                    style={{ maxHeight: '300px' }}
                  >
                    <Table
                      hover
                      responsive
                      className="table-outline mb-0 d-none d-sm-table"
                    >
                      <thead className="thead-light">
                        <tr>
                          <th>Name</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th className="text-right" />
                        </tr>
                      </thead>
                      <tbody>{meds}</tbody>
                    </Table>
                  </div>
                </CardBody>
              </Col>
              <Col>
                <CardBody>
                  <Alert color="info">Cart Item(s)</Alert>
                  <div
                    className="table-responsive"
                    style={{ maxHeight: '300px' }}
                  >
                    <Table
                      hover
                      responsive
                      className="table-outline mb-0 d-none d-sm-table"
                    >
                      <thead className="thead-light">
                        <tr>
                          <th colSpan="2">Name</th>
                          <th>Qty</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>{this.cartRow(cartList)}</tbody>
                    </Table>
                    <div style={{ paddingTop: '10px' }}>
                      Total Amount: &#x20B1; {totalPrice}
                    </div>
                  </div>
                </CardBody>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.buyItems()}>
              Buy
            </Button>{' '}
            <Button
              color="secondary"
              onClick={() => {
                this.props.closePurchaseModal();
                this.setState({
                  cartList: []
                });
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Form>
        <Loader isOpen={isLoading} />
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedItem: state.medicine.selectedItem,
    initialValues: state.medicine.selectedItem
  };
}

export default connect(
  mapStateToProps,
  {
    purchaseMed,
    fetchInventoryList,
    fetchTodayMedSalesList
  }
)(
  reduxForm({ form: 'PurchaseItemForm', enableReinitialize: true })(
    withRouter(PurchaseItemModal)
  )
);
