import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { withRouter } from 'react-router';

import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Label,
  Input,
  Badge
} from 'reactstrap';

// action
import { updateItem } from '../../actions/actionMedicines';

class UpdateItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockAction: 'add',
      totalQty: null
    };
    this.submitForm = this.submitForm.bind(this);
    this.toggleUpdateItem = this.toggleUpdateItem.bind(this);
    this.handleStockActionChange = this.handleStockActionChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    const previousItem = prevProps.selectedItem || {};
    const currentItem = this.props.selectedItem || {};
    const openedModal = !prevProps.displayModal && this.props.displayModal;
    const changedItem = previousItem.medicine_id !== currentItem.medicine_id;

    if (openedModal || changedItem) {
      this.setState({
        stockAction: 'add',
        totalQty: null
      });
    }
  }

  getUpdatedTotalQty(qty, stockAction = this.state.stockAction) {
    const currentQty = parseInt(this.props.selectedItem.qty, 10) || 0;
    const itemQty = parseInt(qty || 0, 10) || 0;

    if (stockAction === 'less') {
      return currentQty - itemQty;
    }

    return currentQty + itemQty;
  }

  computeTotalQty(qty, stockAction = this.state.stockAction) {
    this.setState({
      totalQty: this.getUpdatedTotalQty(qty, stockAction)
    });
  }

  handleStockActionChange(event) {
    const stockAction = event.target.value;
    const addQty = this.props.formValues && this.props.formValues.addQty;

    this.setState({
      stockAction,
      totalQty: this.getUpdatedTotalQty(addQty, stockAction)
    });
  }

  renderTextField(props) {
    const { input, placeholder } = props;
    return (
      <Input
        type="text"
        {...input}
        placeholder={placeholder}
        autoComplete={input.name}
      />
    );
  }

  renderTextArea(props) {
    const { input, rows } = props;
    return <Input type="textarea" {...input} rows={rows} />;
  }

  toggleUpdateItem() {
    this.setState({
      isUpdateItem: !this.state.isUpdateItem
    });
  }

  submitForm(formValues) {
    const {
      medicine_id,
      addQty,
      description,
      name,
      unit_price
    } = formValues;
    const updatedQty = this.getUpdatedTotalQty(addQty);

    if (updatedQty < 0) {
      return;
    }

    const requestData = {
      medicine_id: medicine_id,
      name: name,
      qty: updatedQty,
      description: description,
      unit_price: unit_price
    };

    this.props.updateItem(requestData, success => {
      if (success) {
        this.props.updateList();
        this.props.onToggleUpdateModal();
      } else {
        this.props.onToggleUpdateModal;
      }
    });
  }

  render() {
    const { handleSubmit, selectedItem } = this.props;
    if (!selectedItem) {
      return '';
    }
    const totalQty =
      this.state.totalQty === null ? selectedItem.qty : this.state.totalQty;
    const hasInvalidTotal = totalQty < 0;

    return (
      <Modal
        isOpen={this.props.displayModal}
        toggle={this.props.onToggleUpdateModal}
        className={'modal-primary ' + this.props.className}
      >
        <Form
          className="UpdateItemForm"
          onSubmit={handleSubmit(this.submitForm)}
        >
          <ModalHeader toggle={this.toggleLarge}>Update stocks</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="text-input">Name</Label>
              <Field
                component={this.renderTextField}
                name="name"
                placeholder="Enter item name"
              />
            </FormGroup>
            <p className="help-block">
              Current Stocks:{' '}
              <Badge pill color="danger">
                {selectedItem.qty}
              </Badge>
            </p>
            <FormGroup row className="my-0">
              <Col xs="6" sm="6" md="4" lg="3">
                <FormGroup>
                  <Label htmlFor="stock-action">Action</Label>
                  <Input
                    type="select"
                    id="stock-action"
                    value={this.state.stockAction}
                    onChange={this.handleStockActionChange}
                  >
                    <option value="add">Add</option>
                    <option value="less">Less</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="6" sm="6" md="4" lg="3">
                <FormGroup>
                  <Label htmlFor="quantity">No. of Items</Label>
                  <Field
                    component={this.renderTextField}
                    name="addQty"
                    placeholder="Enter qty"
                    onChange={event => {
                      this.computeTotalQty(event.target.value);
                    }}
                  />
                </FormGroup>
              </Col>
              <Col xs="6" sm="6" md="4" lg="3">
                <FormGroup>
                  <Label htmlFor="price">Unit Price</Label>
                  <Field
                    component={this.renderTextField}
                    name="unit_price"
                    placeholder="Enter item price"
                  />
                </FormGroup>
              </Col>
            </FormGroup>
            <p className="help-block">
              New Total Stocks:{' '}
              <Badge pill color={hasInvalidTotal ? 'warning' : 'danger'}>
                {totalQty}
              </Badge>
            </p>
            {hasInvalidTotal && (
              <p className="text-danger">
                No. of Items cannot be greater than current stocks.
              </p>
            )}
            <FormGroup>
              <Label htmlFor="text-input">Description</Label>
              <Field
                component={this.renderTextArea}
                name="description"
                rows="5"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              color="primary"
              disabled={hasInvalidTotal}
              // onClick={this.props.onToggleUpdateModal}
            >
              Update
            </Button>{' '}
            <Button color="secondary" onClick={this.props.onToggleUpdateModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'name cannot be empty';
  }
  if (!values.unit_price) {
    errors.unit_price = 'qty cannot be empty';
  }
  return errors;
};

function mapStateToProps(state) {
  return {
    formValues: getFormValues('UpdateItemForm')(state),
    selectedItem: state.medicine.selectedItem,
    initialValues: state.medicine.selectedItem
  };
}

export default connect(
  mapStateToProps,
  {
    updateItem
  }
)(
  reduxForm({ form: 'UpdateItemForm', validate, enableReinitialize: true })(
    withRouter(UpdateItemModal)
  )
);
