import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  CardFooter
} from 'reactstrap';
import {
  savePatientInfo,
  saveMedicalHistory,
  schedulePatient
} from '../../actions/actionPatients';
import { Loader, Alert } from '../Utilities/Modals';
import { renderPatientInformationForm } from './PatientInformationForm';
import { renderMedicalHistoryForm } from './MedicalHistoryForm';
import {
  setPatientDefaultValues,
  setMedicalDefaultValues
} from './PatientUtil';

class PatientRegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      isLoading: false,
      isAlert: false,
      alertClassName: 'modal-primary',
      alertMessage: ''
    };
  }

  submitForm(formValues) {
    this.setState({ isLoading: true });
    let {
      patient_information,
      medical_history,
      patient_delivery,
      schedule_patient
    } = formValues;
    patient_information = setPatientDefaultValues(patient_information);
    medical_history = setMedicalDefaultValues(medical_history);
    const { reset } = this.props;
    this.props.savePatientInfo(patient_information, response => {
      if (!response) {
        this.setState({
          isLoading: false,
          isAlert: true,
          alertClassName: 'modal-danger',
          alertMessage: 'Failed saving of patient information!'
        });
      } else {
        const { patient_id } = response[0];
        medical_history.patient_id = patient_id;
        let medicalObj = { medical_history };
        if (!_.isUndefined(patient_delivery)) {
          for (let i = 0; i < patient_delivery.length; i++) {
            patient_delivery[i].patient_id = patient_id;
          }
          medicalObj.patient_delivery = patient_delivery;
        }
        this.props.saveMedicalHistory(medicalObj, () => {
          this.setState({
            isLoading: false,
            isAlert: true,
            alertClassName: 'modal-success',
            alertMessage: 'Patient successfully added!'
          });
          reset();
        });
        if (!_.isUndefined(schedule_patient) && schedule_patient) {
          this.props.schedulePatient(
            { patient_id, status_id: 8, in_dashboard: true },
            () => {}
          );
        }
      }
    });
  }

  render() {
    const { handleSubmit, pristine, submitting, reset } = this.props;
    const { isLoading, isAlert, alertMessage, alertClassName } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Form
              className="form-horizontal"
              onSubmit={handleSubmit(this.submitForm)}
            >
              <Card>
                <CardBody>
                  <h3>Registration Form</h3>
                  <Card>
                    <CardHeader id="headingOne">
                      <strong>Patient Information</strong>
                    </CardHeader>
                    <CardBody>{renderPatientInformationForm()}</CardBody>
                  </Card>
                  <Card>
                    <CardHeader id="headingOne">
                      <strong>Past Medical History</strong>
                    </CardHeader>
                    <CardBody>
                      {renderMedicalHistoryForm()}

                      <br />

                      <FormGroup check inline>
                        <Field
                          name="schedule_patient"
                          id="schedule_patient"
                          component="input"
                          type="checkbox"
                          className="form-check-input"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="schedule_patient"
                        >
                          <strong>Schedule Patient Today?</strong>
                        </Label>
                      </FormGroup>
                    </CardBody>
                  </Card>
                </CardBody>
                <CardFooter>
                  <Button
                    color="primary"
                    size="sm"
                    disabled={pristine || submitting}
                  >
                    Save
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    size="sm"
                    color="danger"
                    disabled={pristine || submitting}
                    onClick={reset}
                  >
                    <i className="fa fa-ban" /> Reset
                  </Button>
                </CardFooter>
              </Card>
            </Form>
          </Col>
        </Row>
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

export default reduxForm({
  form: 'RegistrationForm'
})(
  connect(
    null,
    {
      savePatientInfo,
      saveMedicalHistory,
      schedulePatient
    }
  )(PatientRegistrationForm)
);
