import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';

import { Card, CardBody, Table, Button } from 'reactstrap';

import patientA from '../../assets/img/patient.png';
import { assetSrc } from '../../utilities/assetSrc';

// action
import {
  fetchTodaysPatientList,
  fetchTodaysPatientSched
} from '../../actions/actionPatients';
import { fetchCheckUpList } from '../../actions/actionCheckup';

import { updateScheduleStatus } from '../../actions/actionSchedule';

// f component
import { Alert, Loader } from '../Utilities/Modals';

class TodaysPatientsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: false,
      alertMsg: '',
      loader: false,
      selectedPatient: {}
    };

    this.toggleAlertStatusChange = this.toggleAlertStatusChange.bind(this);
    this.updateScheduleStat = this.updateScheduleStat.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }

  navigateToPatientForm(patientId) {
    this.props.fetchTodaysPatientSched(patientId, response => {
      this.props.fetchCheckUpList(patientId, () => {
        this.props.history.push(`/patient/${patientId}`);
      });
    });
  }

  toggleAlertStatusChange(patient) {
    const { schedule_checkup_id, status_id, patient_name } = patient;

    // if status is not yet completed
    if (status_id !== 5) {
      const message = `Change ${patient_name} status to ${
        status_id === 8
          ? 'In Progress'
          : status_id === 4
          ? 'Completed'
          : 'Completed'
      }?`;

      this.setState({
        alert: true,
        alertMsg: message,
        selectedPatient: patient
      });
    }
  }

  closeAlert() {
    this.setState(this.setState({ alert: false, alertMsg: '' }));
  }

  updateScheduleStat() {
    this.setState({ loader: true });
    const { schedule_checkup_id, status_id } = this.state.selectedPatient;

    // status = waiting(8) -> in progress(4) -> completed(5)
    const requestData = {
      schedule_checkup_id: schedule_checkup_id,
      status_id: status_id === 8 ? 4 : status_id === 4 ? 5 : 5
    };

    this.props.updateScheduleStatus(requestData, () => {
      this.props.fetchTodaysPatientList(this.props.authToken, () => {});
      this.setState({ loader: false, alert: false, alertMsg: '' });
    });
  }

  componentDidMount() {
    const { authToken } = this.props;
    if (authToken) {
      this.props.fetchTodaysPatientList(authToken, () => {});
    }
  }

  render() {
    const { todaysPatientList } = this.props;

    let items = [];

    if (_.isArray(todaysPatientList)) {
      items = _.map(todaysPatientList, (patient, index) => {
        const {
          patient_name,
          arrived_date,
          status,
          status_id,
          schedule_checkup_id,
          patient_id
        } = patient;

        return (
          <tr key={index}>
            <td className="text-center">
              <div className="avatar">
                <img
                  src={assetSrc(patientA)}
                  className="img-avatar"
                  alt="admin@bootstrapmaster.com"
                />
                <span className="avatar-status badge-success" />
              </div>
            </td>
            <td>
              <div>{patient_name}</div>
              <div className="small text-muted">
                {`Arrived at ${moment(arrived_date)
                  .local()
                  .format('hh:mm:ss A ')}`}
              </div>
            </td>
            <td className="text-right" colSpan="2">
              <Button
                color={
                  status === 'Waiting'
                    ? 'danger'
                    : status === 'In Progress'
                    ? 'success'
                    : 'secondary'
                }
                size="sm"
                onClick={() => this.toggleAlertStatusChange(patient)}
              >
                {status}
              </Button>
              &nbsp;
              <Button
                size="sm"
                color="primary"
                onClick={() =>
                  this.props.onTogglePurchaseModal(schedule_checkup_id)
                }
              >
                <i className="fa fa-medkit" />
              </Button>
              &nbsp;
              <Button
                size="sm"
                color="primary"
                onClick={() => this.navigateToPatientForm(patient_id)}
              >
                <i className="fa fa-pencil" />
              </Button>
            </td>
          </tr>
        );
      });
    }

    return (
      <Card>
        <Alert
          isOpen={this.state.alert}
          message={this.state.alertMsg}
          className={'modal-warning'}
          hasYesNoBtn={true}
          onYes={() => this.updateScheduleStat()}
          onNo={() => this.closeAlert()}
        />
        <Loader isOpen={this.state.loader} />
        <CardBody>
          <Table
            hover
            responsive
            className="table-outline mb-0 d-none d-sm-table"
          >
            <thead className="thead-light">
              <tr>
                <th colSpan="4">
                  <i className="icon-people" />
                  &nbsp;Todays Patients list
                </th>
              </tr>
            </thead>
            <tbody>{items}</tbody>
          </Table>
        </CardBody>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    todaysPatientList: state.patient.todaysPatientList,
    authToken: state.userIdentity.data.authToken
  };
}

export default connect(
  mapStateToProps,
  {
    fetchTodaysPatientList,
    updateScheduleStatus,
    fetchTodaysPatientSched,
    fetchCheckUpList
  }
)(withRouter(TodaysPatientsList));
