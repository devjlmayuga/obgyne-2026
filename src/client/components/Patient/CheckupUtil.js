import React from 'react';
import { Field, FieldArray } from 'redux-form';
import moment from 'moment';

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Button,
  FormGroup,
  Label,
  Input,
  Collapse,
  Table
} from 'reactstrap';
import {
  renderSingleTextField,
  renderFormTextField,
  renderVerticalFormTextField,
  renderVerticalFormTextArea,
  renderSingleTextArea,
  required,
  renderFileUpload
} from './PatientUtil';

function toggleIcon(show) {
  const className = show ? 'fa fa-minus-square' : 'fa fa-plus-square';
  return <i className={className} />;
}

const renderMedicines = ({ fields }) => (
  <div>
    <Table responsive className="table-outline mb-0 d-none d-sm-table">
      <thead className="thead-light">
        <tr>
          <th>&nbsp;</th>
          <th>Name</th>
          {/* <th>QTY</th> */}
          <th colSpan="2">Frequency</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((medicine, index) => (
          <tr key={index}>
            <td>M{index + 1}</td>
            <td>
              <Field
                component={renderSingleTextField}
                name={`${medicine}.med_name`}
                type="text"
                validate={[required('This field is required')]}
              />
            </td>
            {/* <td>
              <Field
                component={renderSingleTextField}
                name={`${medicine}.med_qty`}
                type="number"
                validate={[required('This field is required')]}
              />
            </td> */}
            <td>
              <Field
                component={renderSingleTextField}
                name={`${medicine}.frequency`}
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

export function renderCheckUpSection(show, formValues, toggleAccordion) {
  const { sc_checkup_history } = formValues || {};
  let checkup_type_id = 'Obstertics';
  if (sc_checkup_history) {
    checkup_type_id = sc_checkup_history.checkup_type_id || 'Obstertics';
  }
  const validate = [];
  validate.push(required('This field is required'));

  let edc = '';
  if (sc_checkup_history && sc_checkup_history.lmp !== undefined) {
    const { lmp } = sc_checkup_history;
    edc = lmp
      ? moment(lmp)
          .add(9, 'M')
          .add(7, 'days')
          .local()
          .format('MMM DD, YYYY ')
      : '';

    if (lmp) {
      sc_checkup_history.aog_date = sc_checkup_history.aog_date
        ? sc_checkup_history.aog_date
        : moment().format('YYYY-MM-DD');
      console.log(sc_checkup_history.aog_date);
      let days = Math.round(
        (new Date(sc_checkup_history.aog_date) - new Date(lmp)) /
          (24 * 60 * 60 * 1000)
      );
      sc_checkup_history.aog_by_lmp = `${Math.trunc(days / 7)} week/s ${days %
        7} day/s`;

      // sc_checkup_history.aog_weeks = Math.round(days/7);
      // sc_checkup_history.aog_days = days%7;
    }
  }

  return (
    <Card>
      <CardHeader id="headingCheckup">
        <strong>Checkup Information</strong>
        <div className="card-header-actions">
          <Button
            color="link"
            className="card-header-action btn-setting"
            onClick={() => toggleAccordion(0)}
            aria-expanded={show}
            aria-controls="collapseCheckup"
          >
            {toggleIcon(show)}
          </Button>
        </div>
      </CardHeader>
      <Collapse
        isOpen={show}
        id="collapseCheckup"
        aria-labelledby="headingCheckup"
      >
        <CardBody>
          <FormGroup className="mt-sm-3" row>
            <Col md="2">
              <Label>
                <strong>Checkup Type</strong>
              </Label>
            </Col>
            <Col md="9">
              <FormGroup check inline>
                <Field
                  name="sc_checkup_history.checkup_type_id"
                  id="Obstertics"
                  component="input"
                  type="radio"
                  value="Obstertics"
                  className="form-check-input"
                />
                <Label className="form-check-label" check htmlFor="Obstertics">
                  Obstertics
                </Label>
              </FormGroup>
              <FormGroup check inline>
                <Field
                  name="sc_checkup_history.checkup_type_id"
                  id="Gynecology"
                  component="input"
                  type="radio"
                  value="Gynecology"
                  className="form-check-input"
                />
                <Label className="form-check-label" check htmlFor="Gynecology">
                  Gynecology
                </Label>
              </FormGroup>
            </Col>
          </FormGroup>

          {checkup_type_id === 'Gynecology' && (
            <>
              {/* <FormGroup row className="my-0">
                <Col md="6">
                  <h5 className="text-center">
                    <strong>Menstrual History</strong>
                  </h5>
                  <Field
                    component={renderFormTextField}
                    name="sc_checkup_history.mh_menarche"
                    label="Menarche"
                  />
                  <Field
                    component={renderFormTextField}
                    name="sc_checkup_history.mh_interval"
                    label="Interval"
                  />
                  <Field
                    component={renderFormTextField}
                    name="sc_checkup_history.mh_duration"
                    label="Duration"
                  />
                  <Field
                    component={renderFormTextField}
                    name="sc_checkup_history.mh_ammount"
                    label="Amount"
                  />
                  <Field
                    component={renderFormTextField}
                    name="sc_checkup_history.mh_symptoms"
                    label="Symptoms"
                  />
                </Col>
                <Col md="6">
                  <h5 className="text-center">
                    <strong>Sexual History</strong>
                  </h5>
                  <Field
                    component={renderFormTextField}
                    name="sc_checkup_history.sh_coitarche"
                    label="Coitarche"
                  />
                  <Field
                    component={renderFormTextField}
                    name="sc_checkup_history.sh_nop"
                    label="NOP"
                  />
                  <Field
                    component={renderFormTextField}
                    name="sc_checkup_history.sh_std"
                    label="STD's"
                  />
                  <Field
                    component={renderFormTextField}
                    name="sc_checkup_history.sh_vaccination"
                    label="Vaccinations"
                  />
                  <Field
                    component={renderFormTextField}
                    name="sc_checkup_history.sh_others"
                    label="Others"
                  />
                </Col>
              </FormGroup> */}

              <FormGroup row className="my-0">
                <Col md="4">
                  <Field
                    component={renderVerticalFormTextField}
                    name="sc_checkup_history.ob_score"
                    label="OB Score"
                  />
                </Col>
                <Col md="4">
                  <Field
                    component={renderVerticalFormTextField}
                    name="sc_checkup_history.lmp"
                    label="LMP"
                    type="date"
                  />
                </Col>
              </FormGroup>
            </>
          )}

          {checkup_type_id === 'Obstertics' && (
            <>
              <FormGroup row className="my-0">
                <Col md="4">
                  <Field
                    component={renderVerticalFormTextField}
                    name="sc_checkup_history.ob_score"
                    label="OB Score"
                  />
                </Col>
                <Col md="4">
                  <Field
                    component={renderVerticalFormTextField}
                    name="sc_checkup_history.lmp"
                    label="LMP"
                    type="date"
                  />
                </Col>
                <Col md="4">
                  <Label htmlFor="text-input">EDC</Label>
                  <div>{edc}</div>
                </Col>
              </FormGroup>
              {/* <FormGroup row className="my-0">
                <Col md="4">
                  <Field
                    component={renderVerticalFormTextField}
                    name="sc_checkup_history.aog_weeks"
                    label="AOG"
                    placeholder="weeks"
                    type="number"
                  />
                </Col>
                <Col md="4">
                  <Field
                    component={renderVerticalFormTextField}
                    name="sc_checkup_history.aog_days"
                    label="&nbsp;"
                    placeholder="days"
                    type="number"
                  />
                </Col>
              </FormGroup> */}
              <FormGroup row className="my-0">
                <Col md="4">
                  <Field
                    component={renderVerticalFormTextField}
                    name="sc_checkup_history.aog_date"
                    label="Date"
                    type="date"
                  />
                </Col>
                <Col md="4">
                  <Field
                    component={renderVerticalFormTextField}
                    name="sc_checkup_history.aog_by_lmp"
                    value
                    label="AOG by LMP"
                  />
                </Col>
                <Col md="4">
                  <Field
                    component={renderVerticalFormTextField}
                    name="sc_checkup_history.aog_by_utz"
                    label="AOG by UTZ"
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="my-0">
                <Col md="12">
                  <Field
                    component={renderVerticalFormTextArea}
                    name="sc_checkup_history.aog_remarks"
                    label="Remarks"
                  />
                </Col>
              </FormGroup>
            </>
          )}

          <h5>
            <strong>Vital Signs</strong>
          </h5>
          <FormGroup row className="my-0">
            <Col md="2">
              <Field
                component={renderVerticalFormTextField}
                name="sc_checkup_history.weight"
                label="Weight"
                maxlength="10"
              />
            </Col>
            <Col md="2">
              <Field
                component={renderVerticalFormTextField}
                name="sc_checkup_history.bp"
                label="BP"
                maxlength="10"
              />
            </Col>
            <Col md="2">
              <Field
                component={renderVerticalFormTextField}
                name="sc_checkup_history.cr"
                label="CR"
                maxlength="10"
              />
            </Col>
            <Col md="2">
              <Field
                component={renderVerticalFormTextField}
                name="sc_checkup_history.temp"
                label="Temp"
                maxlength="10"
              />
            </Col>
            <Col md="4">
              <Field
                component={renderVerticalFormTextArea}
                name="sc_checkup_history.remarks"
                label="Remarks"
              />
            </Col>
          </FormGroup>
        </CardBody>
      </Collapse>
    </Card>
  );
}

export function renderSoapSection(show, formValues, toggleAccordion) {
  const { sc_checkup_history } = formValues || {};
  let checkup_type_id = 'Obstertics';
  if (sc_checkup_history) {
    checkup_type_id = sc_checkup_history.checkup_type_id || 'Obstertics';
  }
  return (
    <Card>
      <CardHeader id="headingSoap">
        <strong>SOAP</strong>
        <div className="card-header-actions">
          <Button
            color="link"
            className="card-header-action btn-setting"
            onClick={() => toggleAccordion(1)}
            aria-expanded={show}
            aria-controls="collapseSoap"
          >
            {toggleIcon(show)}
          </Button>
        </div>
      </CardHeader>
      <Collapse isOpen={show} id="collapseSoap" aria-labelledby="headingSoap">
        <CardBody>
          <FormGroup row className="my-0">
            <Col md="1">
              <strong className="display-4">S</strong>
            </Col>
            <Col md="11">
              {checkup_type_id === 'Obstertics' && (
                <>
                  <FormGroup row>
                    <Col md="2" className="text-right">
                      <Label>Nausea/Vomiting</Label>
                    </Col>
                    <Col md="2">
                      <FormGroup check inline>
                        <Field
                          name="sc_soap.s_nausea_vomiting"
                          id="sc_soap.s_nausea_vomiting_yes"
                          component="input"
                          type="radio"
                          value="true"
                          className="form-check-input"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="s_nausea_vomiting_yes"
                        >
                          Yes
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Field
                          name="sc_soap.s_nausea_vomiting"
                          id="sc_soap.s_nausea_vomiting_none"
                          component="input"
                          type="radio"
                          value="false"
                          className="form-check-input"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="s_nausea_vomiting_none"
                        >
                          None
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md="1">
                      <Label htmlFor="sc_soap.s_nausea_vomiting_remarks">
                        Remarks
                      </Label>
                    </Col>
                    <Col md="7">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.s_nausea_vomiting_remarks"
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="2" className="text-right">
                      <Label>Hypogastric Pain</Label>
                    </Col>
                    <Col md="2">
                      <FormGroup check inline>
                        <Field
                          name="sc_soap.s_hypogastric_pain"
                          id="sc_soap.s_hypogastric_pain_yes"
                          component="input"
                          type="radio"
                          value="true"
                          className="form-check-input"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="s_hypogastric_pain_yes"
                        >
                          Yes
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Field
                          name="sc_soap.s_hypogastric_pain"
                          id="sc_soap.s_hypogastric_pain_none"
                          component="input"
                          type="radio"
                          value="false"
                          className="form-check-input"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="s_hypogastric_pain_none"
                        >
                          None
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md="1">
                      <Label htmlFor="sc_soap.s_hypogastric_pain_remarks">
                        Remarks
                      </Label>
                    </Col>
                    <Col md="7">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.s_hypogastric_pain_remarks"
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="2" className="text-right">
                      <Label>Uterine Contractions</Label>
                    </Col>
                    <Col md="2">
                      <FormGroup check inline>
                        <Field
                          name="sc_soap.s_uterine_contractions"
                          id="sc_soap.s_uterine_contractions_yes"
                          component="input"
                          type="radio"
                          value="true"
                          className="form-check-input"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="s_uterine_contractions_yes"
                        >
                          Yes
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Field
                          name="sc_soap.s_uterine_contractions"
                          id="sc_soap.s_uterine_contractions_none"
                          component="input"
                          type="radio"
                          value="false"
                          className="form-check-input"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="s_uterine_contractions_none"
                        >
                          None
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md="1">
                      <Label htmlFor="sc_soap.s_uterine_contractions_remarks">
                        Remarks
                      </Label>
                    </Col>
                    <Col md="7">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.s_uterine_contractions_remarks"
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="2" className="text-right">
                      <Label>Bleeding</Label>
                    </Col>
                    <Col md="2">
                      <FormGroup check inline>
                        <Field
                          name="sc_soap.s_bleeding"
                          id="sc_soap.s_bleeding_yes"
                          component="input"
                          type="radio"
                          value="true"
                          className="form-check-input"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="s_bleeding_yes"
                        >
                          Yes
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Field
                          name="sc_soap.s_bleeding"
                          id="sc_soap.s_bleeding_none"
                          component="input"
                          type="radio"
                          value="false"
                          className="form-check-input"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="s_bleeding_none"
                        >
                          None
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md="1">
                      <Label htmlFor="sc_soap.s_bleeding_remarks">
                        Remarks
                      </Label>
                    </Col>
                    <Col md="7">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.s_bleeding_remarks"
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="2" className="text-right">
                      <Label>Fetal Movement</Label>
                    </Col>
                    <Col md="2">
                      <FormGroup check inline>
                        <Field
                          name="sc_soap.s_fetal_movement"
                          id="sc_soap.s_fetal_movement_yes"
                          component="input"
                          type="radio"
                          value="true"
                          className="form-check-input"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="s_fetal_movement_yes"
                        >
                          Yes
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Field
                          name="sc_soap.s_fetal_movement"
                          id="sc_soap.s_fetal_movement_none"
                          component="input"
                          type="radio"
                          value="false"
                          className="form-check-input"
                        />
                        <Label
                          className="form-check-label"
                          check
                          htmlFor="s_fetal_movement_none"
                        >
                          None
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md="1">
                      <Label htmlFor="sc_soap.s_fetal_movement_remarks">
                        Remarks
                      </Label>
                    </Col>
                    <Col md="7">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.s_fetal_movement_remarks"
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="2" className="text-right">
                      <Label htmlFor="sc_soap.s_others">Others</Label>
                    </Col>
                    <Col md="10">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.s_others"
                      />
                    </Col>
                  </FormGroup>
                </>
              )}

              {checkup_type_id !== 'Obstertics' && (
                <>
                  <FormGroup row>
                    <Col md="2" className="text-right">
                      <Label htmlFor="sc_soap.s_what">What</Label>
                    </Col>
                    <Col md="10">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.s_what"
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="2" className="text-right">
                      <Label htmlFor="sc_soap.s_duration">Duration</Label>
                    </Col>
                    <Col md="10">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.s_duration"
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="2" className="text-right">
                      <Label htmlFor="sc_soap.s_intervention">
                        Intervention
                      </Label>
                    </Col>
                    <Col md="10">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.s_intervention"
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="2" className="text-right">
                      <Label htmlFor="sc_soap.s_others">Others</Label>
                    </Col>
                    <Col md="10">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.s_others"
                      />
                    </Col>
                  </FormGroup>
                </>
              )}
            </Col>
          </FormGroup>

          <hr />

          <FormGroup row className="mt-sm-4">
            <Col md="1">
              <strong className="display-4">O</strong>
            </Col>
            <Col md="11">
              {checkup_type_id === 'Obstertics' && (
                <>
                  <FormGroup row>
                    <Col md="2">
                      <Label htmlFor="sc_soap.o_fundic_height">
                        Fundic Height
                      </Label>
                    </Col>
                    <Col md="2">
                      <Field
                        component={renderSingleTextField}
                        name="sc_soap.o_fundic_height"
                      />
                    </Col>
                    <Col md="1">
                      <Label htmlFor="sc_soap.o_fundic_height_remarks">
                        Remarks
                      </Label>
                    </Col>
                    <Col md="7">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.o_fundic_height_remarks"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <Label htmlFor="sc_soap.o_fetal_heart_beat">
                        Fetal Heart Beat
                      </Label>
                    </Col>
                    <Col md="2">
                      <Field
                        component={renderSingleTextField}
                        name="sc_soap.o_fetal_heart_beat"
                      />
                    </Col>
                    <Col md="1">
                      <Label htmlFor="sc_soap.o_fetal_heart_beat_remarks">
                        Remarks
                      </Label>
                    </Col>
                    <Col md="7">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.o_fetal_heart_beat_remarks"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <Label htmlFor="sc_soap.o_others">Others</Label>
                    </Col>
                    <Col md="2">
                      <Field
                        component={renderSingleTextField}
                        name="sc_soap.o_others"
                      />
                    </Col>
                    <Col md="1">
                      <Label htmlFor="sc_soap.o_others_remarks">Remarks</Label>
                    </Col>
                    <Col md="7">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.o_others_remarks"
                      />
                    </Col>
                  </FormGroup>
                </>
              )}

              {checkup_type_id === 'Gynecology' && (
                <>
                  <FormGroup row>
                    <Col md="2">
                      <Label htmlFor="sc_soap.o_abdomen">Abdomen</Label>
                    </Col>
                    <Col md="10">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.o_abdomen"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <Label htmlFor="sc_soap.o_ie">IE</Label>
                    </Col>
                    <Col md="10">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.o_ie"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <Label htmlFor="sc_soap.o_se">SE</Label>
                    </Col>
                    <Col md="10">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.o_se"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <Label htmlFor="sc_soap.o_breast">Breast</Label>
                    </Col>
                    <Col md="10">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.o_breast"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <Label htmlFor="sc_soap.o_others">Others</Label>
                    </Col>
                    <Col md="10">
                      <Field
                        component={renderSingleTextArea}
                        name="sc_soap.o_others"
                      />
                    </Col>
                  </FormGroup>
                </>
              )}
            </Col>
          </FormGroup>

          <hr />

          <FormGroup row className="mt-sm-4">
            <Col md="1">
              <strong className="display-4">A</strong>
            </Col>
            <Col md="11">
              <Field
                component={renderVerticalFormTextArea}
                name="sc_soap.a_diagnosis"
                label="Remarks"
              />
            </Col>
          </FormGroup>

          <hr />

          <FormGroup row className="mt-sm-4">
            <Col md="1">
              <strong className="display-4">P</strong>
            </Col>
            <Col md="11">
              <h5>
                <strong>Medicines</strong>
              </h5>

              <FieldArray
                name="prescribed_medicine"
                component={renderMedicines}
              />

              <h5 className="mt-sm-4">
                <strong>Labs</strong>
              </h5>

              <FormGroup row>
                <Col md="1">
                  <Label>UTZ</Label>
                </Col>
                <Col md="5">
                  <Field
                    component={renderSingleTextField}
                    name="sc_soap.p_utz"
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="1">
                  <Label>Blood</Label>
                </Col>
                <Col md="5">
                  <Field
                    component={renderSingleTextField}
                    name="sc_soap.p_blood"
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="1">
                  <Label>Urine</Label>
                </Col>
                <Col md="5">
                  <Field
                    component={renderSingleTextField}
                    name="sc_soap.p_urine"
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="1">
                  <Label>Others</Label>
                </Col>
                <Col md="5">
                  <Field
                    component={renderSingleTextField}
                    name="sc_soap.p_others"
                  />
                </Col>
              </FormGroup>

              <h5 className="mt-sm-4">
                <strong>Vaccine</strong>
              </h5>

              <FormGroup row>
                <Col md="1">
                  <Label>Remarks</Label>
                </Col>
                <Col md="11">
                  <Field
                    component={renderSingleTextArea}
                    name="sc_soap.p_vaccine_remarks"
                  />
                </Col>
              </FormGroup>

              <h5 className="mt-sm-4">
                <strong>Monitoring</strong>
              </h5>

              <FormGroup row>
                <Col md="1">
                  <Label>Remarks</Label>
                </Col>
                <Col md="11">
                  <Field
                    component={renderSingleTextArea}
                    name="sc_soap.p_monitoring_remarks"
                  />
                </Col>
              </FormGroup>
            </Col>
          </FormGroup>
        </CardBody>
      </Collapse>
    </Card>
  );
}

export function renderTestResultsSection(show, toggleAccordion) {
  return (
    <Card>
      <CardHeader id="headingTestResults">
        <strong>Upload result</strong>
        <div className="card-header-actions">
          <Button
            color="link"
            className="card-header-action btn-setting"
            onClick={() => toggleAccordion(3)}
            aria-expanded={show}
            aria-controls="collapseTestResults"
          >
            {toggleIcon(show)}
          </Button>
        </div>
      </CardHeader>
      <Collapse
        isOpen={show}
        id="collapseTestResults"
        aria-labelledby="headingTestResults"
      >
        <CardBody>
          <FormGroup row>
            <Col md="1">
              <Label>Type</Label>
            </Col>
            <Col md="4">
              <Field
                component={renderSingleTextField}
                name="test_type"
                validate={[required('This field is required')]}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="1">
              <Label htmlFor="file-input">Browse</Label>
            </Col>
            <Col md="4">
              <Field
                name="file"
                component={renderFileUpload}
                validate={[required('File input is required')]}
                value={null}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="1" />
            <Col md="4">
              <Button type="submit" size="sm" color="primary">
                Upload
              </Button>
            </Col>
          </FormGroup>
        </CardBody>
      </Collapse>
    </Card>
  );
}
