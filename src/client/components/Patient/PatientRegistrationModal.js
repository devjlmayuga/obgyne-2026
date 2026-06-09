import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import {
  Button,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
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

class PatientRegistrationModal extends Component {
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

    this.props.savePatientInfo(patient_information, response => {
      if (!response) {
        this.setState({
          isLoading: false,
          isAlert: true,
          alertClassName: 'modal-danger',
          alertMessage: 'Failed saving of patient information!'
        });
        return;
      }

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
        this.setState({ isLoading: false });
        this.props.reset();
        this.props.onSaved();
        this.props.onToggleRegistrationModal();
      });

      if (!_.isUndefined(schedule_patient) && schedule_patient) {
        this.props.schedulePatient(
          { patient_id, status_id: 8, in_dashboard: true },
          () => {}
        );
      }
    });
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      reset,
      displayModal,
      onToggleRegistrationModal
    } = this.props;
    const { isLoading, isAlert, alertMessage, alertClassName } = this.state;

    return (
      <Modal
        isOpen={displayModal}
        toggle={onToggleRegistrationModal}
        className={'modal-primary modal-patient-registration ' + this.props.className}
      >
        <Form
          className="form-horizontal"
          onSubmit={handleSubmit(this.submitForm)}
        >
          <ModalHeader toggle={onToggleRegistrationModal}>
            Register Patient
          </ModalHeader>
          <ModalBody>
            <h5>Patient Information</h5>
            {renderPatientInformationForm()}
            <hr />
            <h5>Past Medical History</h5>
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
          </ModalBody>
          <ModalFooter>
            <Button color="primary" disabled={pristine || submitting}>
              Save
            </Button>{' '}
            <Button
              type="button"
              color="danger"
              disabled={pristine || submitting}
              onClick={reset}
            >
              Reset
            </Button>{' '}
            <Button color="secondary" onClick={onToggleRegistrationModal}>
              Cancel
            </Button>
          </ModalFooter>
          <Alert
            isOpen={isAlert}
            className={alertClassName}
            message={alertMessage}
            toggle={() => {
              this.setState({ isAlert: false });
            }}
          />
          <Loader isOpen={isLoading} />
        </Form>
      </Modal>
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
  )(PatientRegistrationModal)
);
