import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { withRouter } from 'react-router';
import { Button, Form } from 'reactstrap';
import moment from 'moment';

import {
  renderCheckUpSection,
  renderSoapSection,
  renderTestResultsSection
} from './CheckupUtil';

import { hasItsOwnProperty } from '../Utilities/propUtil';

// action
import {
  saveCheckup,
  updateCheckup,
  schedulePatient,
  fetchTodaysPatientSched
} from '../../actions/actionPatients';
import { fetchCheckUpList } from '../../actions/actionCheckup';

// component
import { Loader, Alert } from '../Utilities/Modals';

class CheckupForm extends Component {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.state = {
      accordion: [true, true, true, true],
      isLoading: false,
      isAlert: false,
      alertHasYesNo: false,
      alertClassName: 'modal-primary',
      alertMessage: '',
      alertOnYes: () => {},
      alertOnNo: () => {}
    };
  }

  toggleAccordion(tab) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : x));
    this.setState({
      accordion: state
    });
  }

  submitForm(formValues) {
    const { patientInformation, patientTodaySched = false } = this.props;
    const { patient_id } = patientInformation;

    const {
      sc_checkup_history = undefined,
      sc_soap = undefined,
      prescribed_medicine = undefined
    } = formValues;

    let method = 'save';
    if (
      (sc_checkup_history && sc_checkup_history.schedule_checkup_id) ||
      (sc_soap && sc_soap.schedule_checkup_id)
    ) {
      method = 'update';
    }

    //reset alert modal to default
    const onNo = () => {
      this.setState({
        isAlert: false,
        alertHasYesNo: false,
        alertClassName: 'modal-primary',
        alertMessage: '',
        alertOnYes: () => {},
        alertOnNo: () => {}
      });
    };

    //create schedule and save checkup
    const onYes = () => {
      onNo();
      let alertClassName = 'modal-success';
      let alertMessage = 'Patient checkup successfully saved!';
      this.setState({ isLoading: true });

      this.props.schedulePatient(
        { patient_id, status_id: 4, in_dashboard: false },
        success => {
          let alertClassName = 'modal-success';
          let alertMessage = 'Patient checkup successfully updated!';
          if (!success) {
            alertClassName = 'modal-danger';
            alertMessage = 'Failed to save patient checkup!';

            //refresh checkup list for update
            this.props.fetchCheckUpList(patient_id, () => {
              this.setState({
                isLoading: false,
                isAlert: true,
                alertClassName,
                alertMessage
              });
            });
          } else {
            this.props.fetchTodaysPatientSched(patient_id, response => {
              return this.submitForm(formValues);
            });
          }
        }
      );
    };

    // if patient is not scheduled today
    if (!patientTodaySched) {
      this.setState({
        isAlert: true,
        alertHasYesNo: true,
        alertClassName: 'modal-warning',
        alertMessage: `${
          patientInformation.patient_name
        } is currently not scheduled. Do you want to proceed on updating the information? `,
        alertOnNo: onNo,
        alertOnYes: onYes
      });
    } else {
      let checkupId = patientTodaySched[0].schedule_checkup_id;

      let request = formValues;
      const checkupTypeId = request.sc_checkup_history.checkup_type_id;

      // replace checkup_type_id value
      if (checkupTypeId === 'Obstertics') {
        request.sc_checkup_history.checkup_type_id = 6;
      } else if (checkupTypeId === 'Gynecology') {
        request.sc_checkup_history.checkup_type_id = 7;
      }

      // map the schedule_checkup_id for prescribed meds
      _.map(request.prescribed_medicine, obj => {
        obj.schedule_checkup_id = checkupId;
      });

      // UPDATE CHECKUP
      if (method === 'update') {
        this.setState({
          isLoading: true
        });
        this.props.updateCheckup(request, response => {
          let alertClassName = 'modal-success';
          let alertMessage = 'Patient checkup successfully updated!';
          if (!response) {
            alertClassName = 'modal-danger';
            alertMessage = 'Failed updating of patient checkup!';
          }

          //refresh checkup list for update
          this.props.fetchCheckUpList(patientInformation.patient_id, () => {
            this.setState({
              isLoading: false,
              isAlert: true,
              alertClassName,
              alertMessage
            });
          });
        });

        //SAVE NEW CHECKUP
      } else if (method === 'save') {
        // replace schedule_checkup_id
        if (request.sc_checkup_history) {
          request.sc_checkup_history.schedule_checkup_id = checkupId;
        }
        if (request.sc_soap) {
          request.sc_soap.schedule_checkup_id = checkupId;
        }

        this.setState({ isLoading: true });

        this.props.saveCheckup(request, response => {
          let alertClassName = 'modal-success';
          let alertMessage = 'Patient checkup successfully saved!';
          if (!response) {
            alertClassName = 'modal-danger';
            alertMessage = 'Failed saving of patient checkup!';
          }

          //refresh checkup list for save new
          this.props.fetchCheckUpList(patientInformation.patient_id, () => {
            this.setState({
              isLoading: false,
              isAlert: true,
              alertClassName,
              alertMessage
            });
          });
        });
      }
    }
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      formValues,
      selectedCheckupForm,
      patientInformation
    } = this.props;
    const {
      accordion,
      isLoading,
      isAlert,
      alertMessage,
      alertClassName,
      alertHasYesNo,
      alertOnYes,
      alertOnNo
    } = this.state;

    return (
      <div>
        <Form
          className="form-horizontal"
          onSubmit={handleSubmit(this.submitForm)}
        >
          {renderCheckUpSection(accordion[0], formValues, index => {
            this.toggleAccordion(index);
          })}
          {renderSoapSection(accordion[1], formValues, index => {
            this.toggleAccordion(index);
          })}
          {/* {renderTestResultsSection(accordion[2], index => {
            this.toggleAccordion(index);
          })} */}
          {/* disabled={pristine || submitting} */}
          <Button color="primary" size="sm">
            Save
          </Button>
        </Form>
        <Alert
          isOpen={isAlert}
          className={alertClassName}
          message={alertMessage}
          hasYesNoBtn={alertHasYesNo}
          toggle={() => {
            this.setState({ isAlert: false });
          }}
          onYes={alertOnYes}
          onNo={alertOnNo}
        />
        <Loader isOpen={isLoading} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { patient } = state;
  let {
    patientTodaySched,
    patientCheckupList,
    selectedCheckupForm,
    patientInformation
  } = patient;

  // sort patientCheckupList by schedule_checkup_id in desc order
  patientCheckupList = _.orderBy(
    patientCheckupList,
    'schedule_checkup_id',
    'desc'
  );

  let sc_checkup_history;
  let sc_soap;
  let sc_prescribed_medicine;

  if (patientTodaySched && patientTodaySched !== false && patientCheckupList) {
    const { patientTodaySched } = patient;

    if (
      patientCheckupList[0] &&
      patientTodaySched[0].schedule_checkup_id ===
        patientCheckupList[0].schedule_checkup_id
    ) {
      // load default formValues (todays date)
      sc_soap = patientCheckupList[0].sc_soap;
      sc_prescribed_medicine = patientCheckupList[0].sc_prescribed_medicine;
      sc_checkup_history = patientCheckupList[0].sc_checkup_history;
    }
  }

  // load selected checkup form
  if (
    selectedCheckupForm &&
    selectedCheckupForm.schedule_checkup_id > 0 &&
    patientInformation.patient_id === selectedCheckupForm.patient_id
  ) {
    sc_checkup_history = selectedCheckupForm.sc_checkup_history || {};
    sc_soap = selectedCheckupForm.sc_soap || {};
    sc_prescribed_medicine = selectedCheckupForm.sc_prescribed_medicine || [];
  }

  // load checkup type
  if (!sc_checkup_history || _.isEmpty(sc_checkup_history)) {
    sc_checkup_history = { checkup_type_id: 'Obstertics' };
    sc_checkup_history.aog_date = moment().format('YYYY-MM-DD');
    // load previous obscore
    if (
      patientCheckupList &&
      patientCheckupList[0] &&
      patientCheckupList[0].schedule_checkup_id &&
      patientCheckupList[0].schedule_checkup_id > 0
    ) {
      if (
        patientCheckupList[0].sc_checkup_history &&
        patientCheckupList[0].sc_checkup_history.ob_score
      ) {
        sc_checkup_history.ob_score =
          patientCheckupList[0].sc_checkup_history.ob_score;
      }
    }
  } else if (sc_checkup_history && sc_checkup_history.checkup_type_id === 6) {
    sc_checkup_history.checkup_type_id = 'Obstertics';
  } else if (sc_checkup_history && sc_checkup_history.checkup_type_id === 7) {
    sc_checkup_history.checkup_type_id = 'Gynecology';
  }

  // load S on soap
  if (sc_soap && sc_soap.s_nausea_vomiting !== undefined) {
    if (sc_soap.s_nausea_vomiting === true) {
      sc_soap.s_nausea_vomiting = 'true';
    }
    if (sc_soap.s_nausea_vomiting === false) {
      sc_soap.s_nausea_vomiting = 'false';
    }

    if (sc_soap.s_hypogastric_pain === true) {
      sc_soap.s_hypogastric_pain = 'true';
    }
    if (sc_soap.s_hypogastric_pain === false) {
      sc_soap.s_hypogastric_pain = 'false';
    }

    if (sc_soap.s_uterine_contractions === true) {
      sc_soap.s_uterine_contractions = 'true';
    }
    if (sc_soap.s_uterine_contractions === false) {
      sc_soap.s_uterine_contractions = 'false';
    }

    if (sc_soap.s_bleeding === true) {
      sc_soap.s_bleeding = 'true';
    }
    if (sc_soap.s_bleeding === false) {
      sc_soap.s_bleeding = 'false';
    }

    if (sc_soap.s_fetal_movement === true) {
      sc_soap.s_fetal_movement = 'true';
    }
    if (sc_soap.s_fetal_movement === false) {
      sc_soap.s_fetal_movement = 'false';
    }
  }

  return {
    formValues: getFormValues('CheckupForm')(state),
    initialValues: {
      sc_checkup_history: sc_checkup_history,
      sc_soap: sc_soap,
      prescribed_medicine: sc_prescribed_medicine
    },
    selectedCheckupForm: state.patient.selectedCheckupForm,
    patientTodaySched: state.patient.patientTodaySched,
    patientInformation: state.patient.patientInformation
  };
}

export default connect(
  mapStateToProps,
  {
    saveCheckup,
    updateCheckup,
    schedulePatient,
    fetchCheckUpList,
    fetchTodaysPatientSched
  }
)(
  reduxForm({ form: 'CheckupForm', enableReinitialize: true })(
    withRouter(CheckupForm)
  )
);
