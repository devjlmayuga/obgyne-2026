import React from 'react';
import { Field } from 'redux-form';
import { Col, Button, FormGroup, Label, Input, Table } from 'reactstrap';
import moment from 'moment';

export const required = _.memoize(message => value =>
  value ? undefined : message
);

export function renderFormTextFieldv2(props) {
  const {
    input,
    meta,
    placeholder = '',
    type = 'text',
    maxlength = '',
    minlength = ''
  } = props;
  const hasError = meta.touched && meta.error;
  const className = hasError ? 'is-invalid' : '';
  return (
    <div>
      <Input
        type={type}
        {...input}
        className={className}
        placeholder={placeholder}
        minLength={minlength}
        maxLength={maxlength}
        autoComplete={input.name}
      />
      {hasError && <div className="invalid-feedback">{meta.error}</div>}
    </div>
  );
}

export function renderFormTextField(props) {
  const {
    label,
    input,
    meta,
    placeholder = '',
    type = 'text',
    maxlength = '',
    minlength = ''
  } = props;
  const hasError = meta.touched && meta.error;
  const className = hasError ? 'is-invalid' : '';
  return (
    <FormGroup row>
      <Col md="3">
        <Label>{label}</Label>
      </Col>
      <Col xs="12" md="9">
        <Input
          type={type}
          {...input}
          className={className}
          placeholder={placeholder}
          minLength={minlength}
          maxLength={maxlength}
          autoComplete={input.name}
        />
        {hasError && <div className="invalid-feedback">{meta.error}</div>}
      </Col>
    </FormGroup>
  );
}

export function renderFormTextFieldBirthDate(props) {
  const {
    label,
    input,
    meta,
    placeholder = '',
    type = 'text',
    maxlength = ''
  } = props;
  const hasError = meta.touched && meta.error;
  const className = hasError ? 'is-invalid' : '';

  return (
    <div>
      <FormGroup row>
        <Col md="3">
          <Label>{label}</Label>
        </Col>
        <Col xs="12" md="9">
          <Input
            type={type}
            {...input}
            className={className}
            placeholder={placeholder}
            maxLength={maxlength}
            autoComplete={input.name}
          />
          {hasError && <div className="invalid-feedback">{meta.error}</div>}
        </Col>
      </FormGroup>
      <FormGroup row>
        <Col md="3">
          <Label>Age</Label>
        </Col>
        <Col xs="12" md="9">
          {input && input.value
            ? moment().diff(moment(input.value, 'YYYY-MM-DD'), 'years')
            : ''}
        </Col>
      </FormGroup>
    </div>
  );
}

export function renderVerticalFormTextField(props) {
  const {
    label,
    input,
    meta,
    placeholder = '',
    type = 'text',
    maxlength = ''
  } = props;
  const hasError = meta.touched && meta.error;
  const className = hasError ? 'is-invalid' : '';
  return (
    <FormGroup>
      <Label>{label}</Label>
      <Input
        type={type}
        {...input}
        className={className}
        placeholder={placeholder}
        maxLength={maxlength}
        autoComplete={input.name}
      />
      {hasError && <div className="invalid-feedback">{meta.error}</div>}
    </FormGroup>
  );
}

export function renderFormTextArea(props) {
  const { label, input, meta } = props;
  const hasError = meta.touched && meta.error;
  const className = hasError ? 'is-invalid' : '';
  return (
    <FormGroup row>
      <Col md="3">
        <Label>{label}</Label>
      </Col>
      <Col xs="12" md="9">
        <Input
          type="textarea"
          {...input}
          className={className}
          autoComplete={input.name}
          rows="3"
        />
        {hasError && <div className="invalid-feedback">{meta.error}</div>}
      </Col>
    </FormGroup>
  );
}

export function renderVerticalFormTextArea(props) {
  const { label, input, meta } = props;
  const hasError = meta.touched && meta.error;
  const className = hasError ? 'is-invalid' : '';
  return (
    <FormGroup>
      <Label>{label}</Label>
      <Input
        type="textarea"
        {...input}
        className={className}
        autoComplete={input.name}
        rows="3"
      />
      {hasError && <div className="invalid-feedback">{meta.error}</div>}
    </FormGroup>
  );
}

export function renderSingleTextArea(props) {
  const { input, meta, maxlength = '' } = props;
  const hasError = meta.touched && meta.error;
  const className = hasError ? 'is-invalid' : '';
  return (
    <FormGroup>
      <Input
        type="textarea"
        {...input}
        className={className}
        maxLength={maxlength}
        autoComplete={input.name}
        rows="3"
      />
      {hasError && <div className="invalid-feedback">{meta.error}</div>}
    </FormGroup>
  );
}

export function renderSingleTextField(props) {
  const {
    input,
    meta,
    placeholder = '',
    type = 'text',
    maxlength = ''
  } = props;
  const hasError = meta.touched && meta.error;
  const className = hasError ? 'is-invalid' : '';
  return (
    <FormGroup>
      <Input
        type={type}
        {...input}
        className={className}
        maxLength={maxlength}
        placeholder={placeholder}
        autoComplete={input.name}
      />
      {hasError && <div className="invalid-feedback">{meta.error}</div>}
    </FormGroup>
  );
}

export function renderFileUpload(props) {
  const onChange = e => {
    const {
      input: { onChange }
    } = props;
    onChange(e.target.files[0]);
  };

  const {
    input: { value },
    meta
  } = props;

  const hasError = meta.touched && meta.error;
  const className = hasError ? 'is-invalid' : '';

  return (
    <FormGroup>
      <Input type="file" onChange={onChange} className={className} />
      {hasError && <div className="invalid-feedback">{meta.error}</div>}
    </FormGroup>
  );
}

export const renderPatientDeliveries = ({ fields }) => (
  <div>
    <Table responsive className="table-outline mb-0 d-none d-sm-table">
      <thead className="thead-light">
        <tr>
          <th>&nbsp;</th>
          <th>Year of Delivery</th>
          <th>Mode of Delivery</th>
          <th>Place of Delivery</th>
          <th>Attendant</th>
          <th colSpan="2">Complications</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((delivery, index) => (
          <tr key={index}>
            <td>G{index + 1}</td>
            <td>
              <Field
                component={renderSingleTextField}
                name={`${delivery}.year`}
                type="number"
                maxlength="4"
                validate={[required('This field is required')]}
              />
            </td>
            <td>
              <Field
                component={renderSingleTextField}
                name={`${delivery}.mode_of_delivery`}
                type="text"
                maxlength="50"
                validate={[required('This field is required')]}
              />
            </td>
            <td>
              <Field
                component={renderSingleTextField}
                name={`${delivery}.place_of_delivery`}
                type="text"
                maxlength="200"
                validate={[required('This field is required')]}
              />
            </td>
            <td>
              <Field
                component={renderSingleTextField}
                name={`${delivery}.attendant`}
                type="text"
                validate={[required('This field is required')]}
              />
            </td>
            <td>
              <Field
                component={renderSingleTextField}
                name={`${delivery}.complications`}
                type="text"
                validate={[required('This field is required')]}
              />
            </td>
            <td className="text-right">
              <Button
                type="submit"
                size="sm"
                color="danger"
                onClick={() => fields.remove(index)}
              >
                <i className="fa fa-trash" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    <Button
      type="button"
      size="sm"
      color="success"
      className="mt-sm-2"
      onClick={() => fields.push({})}
    >
      <i className="fa fa-plus" /> ADD MORE
    </Button>
  </div>
);

export function setPatientDefaultValues(obj) {
  if (!obj.cs) {
    obj.cs = '';
  }
  if (!obj.philhealth) {
    obj.philhealth = '';
  }
  if (!obj.hmo) {
    obj.hmo = '';
  }
  return obj;
}

export function setMedicalDefaultValues(obj) {
  if (!obj) {
    obj = {};
  }
  if (!obj.remarks) {
    obj.remarks = '';
  }
  if (!obj.allergies) {
    obj.allergies = '';
  }
  if (!obj.asthma) {
    obj.asthma = '';
  }
  if (!obj.dm) {
    obj.dm = false;
  }
  if (!obj.dm_remarks) {
    obj.dm_remarks = '';
  }
  if (!obj.hpn) {
    obj.hpn = false;
  }
  if (!obj.hpn_remarks) {
    obj.hpn_remarks = '';
  }
  if (!obj.others_remarks) {
    obj.others_remarks = '';
  }
  return obj;
}
