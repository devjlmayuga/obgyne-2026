import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';

import { userLogin } from '../../actions/actionUserLogin';

import { Loader } from '../Utilities/Modals';

class Login extends Component {
  static propTypes = {
    userLogin: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      success: false,
      isLoading: false,
    };
    this.submitLogin = this.submitLogin.bind(this);
  }

  componentWillMount() {
    const { authToken } = this.props;
    if (authToken && !_.isEmpty(authToken)) {
      this.props.history.push('/dashboard');
    }

  }


  renderUsername(props) {
    const { input } = props;
    return (
      <Input
        type="text"
        {...input}
        placeholder="Username"
        autoComplete="username"
      />
    );
  }

  renderPassword(props) {
    const { input } = props;
    return (
      <Input
        type="password"
        {...input}
        placeholder="Password"
        autoComplete="current-password"
      />
    );
  }

  redirectToDashboard() {
    const { authToken } = this.props;
    if (authToken && !_.isEmpty(authToken)) {
      this.props.history.push('/dashboard');
    } else {
      setTimeout(() => {
        this.redirectToDashboard();
      }, 500);
    }
  }

  submitLogin(formValues) {
    this.setState({
      isLoading: true
    });
    this.props.userLogin(formValues, success => {
      this.setState({
        isLoading: false
      });
      if (success) {
        this.redirectToDashboard();
      } else {
        this.setState({ success: true });
      }
    });
  }

  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    const { success, isLoading } = this.state;

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="p-4">
                <CardBody>
                  <Form onSubmit={handleSubmit(this.submitLogin)}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Field component={this.renderUsername} name="username" />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Field component={this.renderPassword} name="password" />
                    </InputGroup>

                    <Row>
                      <Col xs="6">
                        <Button
                          color="primary"
                          className="px-4"
                          disabled={pristine || submitting}
                        >
                          Login
                        </Button>
                      </Col>
                      {/* <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col> */}
                    </Row>

                    {success && (
                      <div align="center">
                        <br /> The password you’ve entered is incorrect.
                      </div>
                    )}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
 
	  <Loader isOpen={isLoading} />
        </Container>
      </div>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'username cannot be empty';
  }
  if (!values.password) {
    errors.password = 'password cannot be empty';
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
    form: 'LoginForm',
    validate
  })(
    connect(
      mapStateToProps,
      { userLogin }
    )(Login)
  )
);
