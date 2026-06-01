import React from 'react';
import { Field } from 'redux-form';
import { renderFormTextFieldv2, required } from '../Patient/PatientUtil';

import { FormGroup, Label } from 'reactstrap';

export function renderChangePassFields() {
  const validate = [];
  validate.push(required('This field is required'));
  return (
    <div>
      <FormGroup>
        <Label htmlFor="text-input">Username</Label>
        <Field
          component={renderFormTextFieldv2}
          name="username"
          placeholder="Enter username"
          validate={validate}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="text-input">Password</Label>
        <Field
          component={renderFormTextFieldv2}
          name="password"
          placeholder="Enter current password"
          validate={validate}
          type="password"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="text-input">New Password</Label>
        <Field
          component={renderFormTextFieldv2}
          name="new_password"
          placeholder="Enter new password"
          validate={validate}
          type="password"
        />
      </FormGroup>
    </div>
  );
}
