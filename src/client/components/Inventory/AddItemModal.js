import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { withRouter } from 'react-router';

import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';

import { addNewItem } from '../../actions/actionMedicines';
import { Loader, Alert } from '../Utilities/Modals';

class AddItemModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isAlert: false,
      alertClassName: 'modal-primary',
      alertMessage: ''
    };

    this.submitForm = this.submitForm.bind(this);
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

  renderNumericField(props) {
    const { input, placeholder } = props;
    return (
      <Input
        type="number"
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

  submitForm(formValues) {
    this.setState({ isLoading: true });
    this.props.addNewItem(formValues, response => {
      this.setState({ isLoading: false });

      if (response.success) {
        this.props.reset();
        this.props.updateList();
        this.props.onToggleAddModal();
        return;
      }

      this.setState({
        isAlert: true,
        alertClassName: 'modal-danger',
        alertMessage:
          _.get(response, 'data.error.message') || 'Request failed!'
      });
    });
  }

  render() {
    const { handleSubmit, displayModal, onToggleAddModal } = this.props;
    const { isAlert, alertClassName, alertMessage, isLoading } = this.state;

    return (
      <Modal
        isOpen={displayModal}
        toggle={onToggleAddModal}
        className={'modal-primary ' + this.props.className}
      >
        <Form className="AddItemForm" onSubmit={handleSubmit(this.submitForm)}>
          <ModalHeader toggle={onToggleAddModal}>Add New Item</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="text-input">Name</Label>
              <Field
                component={this.renderTextField}
                name="name"
                placeholder="Enter item name"
              />
            </FormGroup>
            <FormGroup row className="my-0">
              <Col xs="6" sm="6" md="4" lg="3">
                <FormGroup>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Field
                    component={this.renderNumericField}
                    name="qty"
                    placeholder="Enter item quantity"
                  />
                </FormGroup>
              </Col>
              <Col xs="6" sm="6" md="4" lg="3">
                <FormGroup>
                  <Label htmlFor="price">Unit Price</Label>
                  <Field
                    component={this.renderNumericField}
                    name="unit_price"
                    placeholder="Enter item price"
                  />
                </FormGroup>
              </Col>
            </FormGroup>
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
            <Button type="submit" color="primary">
              Save
            </Button>{' '}
            <Button color="secondary" onClick={onToggleAddModal}>
              Cancel
            </Button>
          </ModalFooter>
          <Loader isOpen={isLoading} />
          <Alert
            isOpen={isAlert}
            className={alertClassName}
            message={alertMessage}
            toggle={() => {
              this.setState({ isAlert: false });
            }}
          />
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
  if (!values.qty) {
    errors.qty = 'qty cannot be empty';
  }
  if (!values.unit_price) {
    errors.unit_price = 'qty cannot be empty';
  }
  return errors;
};

export default connect(
  null,
  { addNewItem }
)(
  reduxForm({
    form: 'AddItemForm',
    validate
  })(withRouter(AddItemModal))
);
