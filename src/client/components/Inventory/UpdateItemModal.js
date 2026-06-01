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
      totalQty: null
    };
    this.submitForm = this.submitForm.bind(this);
    this.toggleUpdateItem = this.toggleUpdateItem.bind(this);
  }

  computeTotalQty(qty) {
    this.setState({
      totalQty: parseInt(qty || 0) + parseInt(this.props.selectedItem.qty)
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
      qty,
      addQty,
      description,
      name,
      unit_price
    } = formValues;

    const requestData = {
      medicine_id: medicine_id,
      name: name,
      qty: parseInt(qty) + parseInt(addQty || 0),
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
                  <Label htmlFor="quantity">No. of Items</Label>
                  <Field
                    component={this.renderTextField}
                    name="addQty"
                    placeholder="Enter qty to be added"
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
              <Badge pill color="danger">
                {this.state.totalQty || selectedItem.qty}
              </Badge>
            </p>
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
