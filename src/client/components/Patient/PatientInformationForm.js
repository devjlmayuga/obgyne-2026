import React from 'react';
import { Field } from 'redux-form';
import { Col, FormGroup } from 'reactstrap';
import {
  renderFormTextFieldBirthDate,
  renderFormTextField,
  renderFormTextArea,
  required
} from './PatientUtil';

export function renderPatientInformationForm() {
  const validate = [];
  validate.push(required('This field is required'));
  return (
    <FormGroup row className="my-0">
      <Col md="6">
        <Field
          component={renderFormTextField}
          name="patient_information.patient_name"
          label="Name"
          maxlength="100"
          validate={validate}
        />
        <Field
          component={renderFormTextArea}
          name="patient_information.address"
          label="Address"
          maxlength="100"
          validate={validate}
        />
        <Field
          component={renderFormTextFieldBirthDate}
          name="patient_information.birth_date"
          label="Birthday"
          type="date"
          validate={validate}
        />
      </Col>
      <Col md="6">
        <Field
          component={renderFormTextField}
          name="patient_information.contact_no"
          label="CP #"
          maxlength="50"
          validate={validate}
        />
        <Field
          component={renderFormTextField}
          name="patient_information.cs"
          label="CS"
          maxlength="100"
        />
        <Field
          component={renderFormTextField}
          name="patient_information.philhealth"
          label="Philhealth"
          maxlength="100"
        />
        <Field
          component={renderFormTextField}
          name="patient_information.hmo"
          label="HMO"
          maxlength="100"
        />
      </Col>
    </FormGroup>
  );
}
