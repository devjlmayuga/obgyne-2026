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

// component
import { Loader, Alert } from '../Utilities/Modals';
import { renderChangePassFields } from './changePassFields';

// action
import { changePassword } from '../../actions/actionChangePassword';

class ChangePassword extends Component {
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

  submitForm(formValues) {
    this.setState({
      isLoading: true
    });
    this.props.changePassword(formValues, response => {
      this.setState({
        isLoading: false
      });
      if (response.success) {
        this.setState({
          isAlert: true,
          alertClassName: 'modal-success',
          alertMessage: 'Password Successfully Updated'
        });
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

  renderPasswordField(props) {
    const { input, placeholder, type } = props;
    return (
      <Input
        type="password"
        {...input}
        placeholder={placeholder}
        autoComplete={input.name}
      />
    );
  }

  render() {
    const { handleSubmit } = this.props;
    const { isAlert, alertClassName, alertMessage, isLoading } = this.state;

    const required = value => (value ? undefined : 'Required');

    return (
      <div>
        <div className="animated fadeIn">
          <Row>
            <Col>
              <Card>
                <Form
                  name="ChangePasswordForm"
                  onSubmit={handleSubmit(this.submitForm)}
                >
                  <CardHeader>
                    <strong>Change Password</strong>
                    <div className="card-header-actions">
                      <Button
                        color="link"
                        className="card-header-action btn-setting"
                      >
                        <i className="fa fa-align-justify" title="Item list" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody>{renderChangePassFields()}</CardBody>
                  <CardFooter>
                    <Button type="submit" size="sm" color="primary">
                      <i className="fa fa-dot-circle-o" /> Save
                    </Button>
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
      </div>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.name = 'Username cannot be empty';
  }
  if (!values.password) {
    errors.qty = 'Current password cannot be empty';
  }
  if (!values.new_password) {
    errors.unit_price = 'New password cannot be empty';
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
    form: 'ChangePasswordForm'
  })(
    connect(
      mapStateToProps,
      { changePassword }
    )(ChangePassword)
  )
);
