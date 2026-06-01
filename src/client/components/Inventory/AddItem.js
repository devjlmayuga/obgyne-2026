import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { withRouter } from 'react-router';

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Badge,
  Button,
  Form,
  FormGroup,
  Label,
  CardFooter,
  Input
} from 'reactstrap';

// action
import { addNewItem } from '../../actions/actionMedicines';

// component
import { Loader, Alert } from '../Utilities/Modals';

class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      success: false,
      isAlert: false,
      alertClassName: 'modal-primary',
      alertMessage: ''
    };
    this.submitForm = this.submitForm.bind(this);
  }

  renderTextField(props) {
    const { input, placeholder, type } = props;
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
    const { input, placeholder, type } = props;
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

  redirectToInventory() {
    const { authToken } = this.props;
    if (authToken && !_.isEmpty(authToken)) {
      this.props.history.push('/inventory/list');
    } else {
      setTimeout(() => {
        this.redirectToInventory();
      }, 500);
    }
  }

  submitForm(formValues) {
    this.setState({
      isLoading: true
    });
    this.props.addNewItem(formValues, response => {
      this.setState({
        isLoading: false
      });
      if (response.success) {
        this.redirectToInventory();
      } else {
        this.setState({
          isAlert: true,
          alertClassName: 'modal-danger',
          alertMessage: response.data.error.message
        });
        this.setState({ success: true });
      }
    });
  }

  render() {
    const { handleSubmit } = this.props;
    const { isAlert, alertClassName, alertMessage, isLoading } = this.state;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <Form onSubmit={handleSubmit(this.submitForm)}>
                <CardHeader>
                  <strong>Add New Item</strong>
                  <div className="card-header-actions">
                    <Button
                      color="link"
                      className="card-header-action btn-setting"
                    >
                      <i className="fa fa-align-justify" title="Item list" />
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
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
                </CardBody>
                <CardFooter>
                  <Button type="submit" size="sm" color="primary">
                    <i className="fa fa-dot-circle-o" /> Save
                  </Button>
                  &nbsp;
                  {/* <Button type="reset" size="sm" color="danger">
                    <i className="fa fa-ban" /> Reset
                  </Button> */}
                </CardFooter>
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
            </Card>
          </Col>
        </Row>
      </div>
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

export function mapStateToProps(state) {
  return {
    authToken: state.userIdentity.data.authToken
  };
}

export default withRouter(
  reduxForm({
    form: 'AddItemForm',
    validate
  })(
    connect(
      mapStateToProps,
      { addNewItem }
    )(AddItem)
  )
);
