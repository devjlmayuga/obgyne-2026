import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Form,
  CardFooter
} from 'reactstrap';
import {
  fetchPatientInformation,
  updatePatientInfo
} from '../../actions/actionPatients';
import { Loader, Alert } from '../Utilities/Modals';
import { renderPatientInformationForm } from './PatientInformationForm';
import { setPatientDefaultValues } from './PatientUtil';
class PatientInformationWrapper extends Component {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      isLoading: true,
      isAlert: false,
      alertClassName: 'modal-primary',
      alertMessage: ''
    };
  }

  componentWillMount() {
    const { patientId } = this.props.match.params;
    this.props.fetchPatientInformation(patientId, success => {
      this.setState({ isLoading: false });
    });
  }

  submitForm(formValues) {
    this.setState({ isLoading: true });
    let { patient_information } = formValues;
    patient_information = setPatientDefaultValues(patient_information);
    delete patient_information.registered_date;
    delete patient_information.last_edit_user;
    delete patient_information.last_edit_date;
    delete patient_information.is_deleted;
    delete patient_information.sc_test_results;
    this.props.updatePatientInfo(patient_information, response => {
      let alertClassName = 'modal-success';
      let alertMessage = 'Patient information successfully saved!';
      if (!response) {
        alertClassName = 'modal-danger';
        alertMessage = 'Failed saving of patient information!';
      }
      setTimeout(() => {
        this.setState({
          isLoading: false,
          isAlert: true,
          alertClassName,
          alertMessage
        });
      }, 1000);
    });
  }

  render() {
    const { handleSubmit } = this.props;
    const { isLoading, isAlert, alertMessage, alertClassName } = this.state;
    return (
      <div>
        <Form
          className="PatientInformationForm form-horizontal"
          onSubmit={handleSubmit(this.submitForm)}
        >
          <Card>
            <CardHeader id="headingOne">
              <strong>Patient Information</strong>
            </CardHeader>
            <CardBody>{renderPatientInformationForm()}</CardBody>
            <CardFooter>
              <Button color="primary" size="sm">
                Save
              </Button>
            </CardFooter>
          </Card>
        </Form>
        <Alert
          isOpen={isAlert}
          className={alertClassName}
          message={alertMessage}
          toggle={() => {
            this.setState({ isAlert: false });
          }}
        />
        <Loader isOpen={isLoading} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  let bday = (new Date() - new Date(state.patient.patientInformation.birth_date));
  state.patient.patientInformation.age = Math.trunc(bday/(24 * 60 * 60 * 1000)/366);


  return {
    initialValues: {
      patient_information: state.patient.patientInformation
    }
  };
}

export default connect(
  mapStateToProps,
  { fetchPatientInformation, updatePatientInfo }
)(
  reduxForm({ form: 'PatientInformationForm', enableReinitialize: true })(
    withRouter(PatientInformationWrapper)
  )
);
