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
  fetchMedicalHistory,
  fetchPatientDelivery,
  saveMedicalHistory
} from '../../actions/actionPatients';
import { Loader, Alert } from '../Utilities/Modals';
import { renderMedicalHistoryForm } from './MedicalHistoryForm';
import { setMedicalDefaultValues } from './PatientUtil';
class MedicalHistoryWrapper extends Component {
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
    this.props.fetchMedicalHistory(patientId, success => {
      this.props.fetchPatientDelivery(patientId, success2 => {
        this.setState({ isLoading: false });
      });
    });
  }

  submitForm(formValues) {
    this.setState({ isLoading: true });
    let { medical_history, patient_delivery } = formValues;
    const patient_id = this.props.match.params.patientId;
    medical_history = setMedicalDefaultValues(medical_history);
    delete medical_history.patient_medical_history_id;
    delete medical_history.last_edit_user;
    delete medical_history.last_edit_date;
    medical_history.patient_id = patient_id;
    let medicalObj = { medical_history };
    if (!_.isUndefined(patient_delivery)) {
      for (let i = 0; i < patient_delivery.length; i++) {
        patient_delivery[i].patient_id = patient_id;
        patient_delivery[i].sort_id = i;
        delete patient_delivery[i].patient_delivery_history_id;
        delete patient_delivery[i].last_edit_user;
        delete patient_delivery[i].last_edit_date;
      }
      medicalObj.patient_delivery = patient_delivery;
    }
    this.props.saveMedicalHistory(medicalObj, response => {
      let alertClassName = 'modal-success';
      let alertMessage = 'Patient medical history successfully saved!';
      if (!response) {
        alertClassName = 'modal-danger';
        alertMessage = 'Failed saving of patient medical history!';
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
          className="form-horizontal"
          onSubmit={handleSubmit(this.submitForm)}
        >
          <Card>
            <CardHeader id="headingOne">
              <strong>Past Medical History</strong>
            </CardHeader>
            <CardBody>{renderMedicalHistoryForm()}</CardBody>
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
  return {
    initialValues: {
      medical_history: state.patient.medicalHistory,
      patient_delivery: state.patient.patientDelivery
    }
  };
}

export default connect(
  mapStateToProps,
  { fetchMedicalHistory, fetchPatientDelivery, saveMedicalHistory }
)(
  reduxForm({ form: 'MedicalHistoryWrapper', enableReinitialize: true })(
    withRouter(MedicalHistoryWrapper)
  )
);
