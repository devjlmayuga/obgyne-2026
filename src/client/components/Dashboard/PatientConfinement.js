import _ from 'lodash';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';

import { Card, CardBody, Table, Button } from 'reactstrap';

// image
import patientA from '../../assets/img/patient.png';
import { assetSrc } from '../../utilities/assetSrc';

// action
import {
  fetchPatientConfinementList,
  removeInConfinementList
} from '../../actions/actionPatients';

// f component
import { Alert, Loader } from '../Utilities/Modals';

class PatientConfinement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: false,
      alertMsg: '',
      loader: false,
      selectedPatient: {}
    };

    this.removePatientInConfinementList = this.removePatientInConfinementList.bind(
      this
    );
    this.showAlertRemovePatient = this.showAlertRemovePatient.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }

  componentDidMount() {
    const { authToken } = this.props;
    if (authToken) {
      this.props.fetchPatientConfinementList(authToken, () => {});
    }
  }

  showAlertRemovePatient(patient) {
    const { patient_name } = patient;
    const message = `Do you want to remove ${patient_name} in the list?`;
    this.setState({ alert: true, alertMsg: message, selectedPatient: patient });
  }

  removePatientInConfinementList() {
    const { sc_checkup_history_id } = this.state.selectedPatient;
    this.setState({ loader: true });
    this.props.removeInConfinementList(sc_checkup_history_id, () => {
      this.setState({ alert: false, alertMsg: '' });
      this.props.fetchPatientConfinementList(this.props.authToken, () => {
        this.setState({ loader: false });
      });
    });
  }

  closeAlert() {
    this.setState(this.setState({ alert: false, alertMsg: '' }));
  }

  render() {
    let { confinementList } = this.props;
    let patientList = [];

    if (_.isArray(confinementList)) {
      patientList = _.map(confinementList, (patient, index) => {
        const { patient_name, edc, sc_checkup_history_id } = patient;
        return (
          <tr key={index}>
            <td className="text-center">
              <div className="avatar">
                <img
                  src={assetSrc(patientA)}
                  className="img-avatar"
                  alt="admin@bootstrapmaster.com"
                />
                <span className="avatar-status badge-danger" />
              </div>
            </td>
            <td>
              <div>{patient_name}</div>
              <div className="small text-muted">
                <span>EDC: </span>
                {moment(edc)
                  .local()
                  .format('MMM DD, YYYY')}
              </div>
            </td>
            <td>
              <Button
                color="danger"
                size="sm"
                onClick={() => this.showAlertRemovePatient(patient)}
              >
                {' '}
                Remove
              </Button>
            </td>
          </tr>
        );
      });
    }

    return (
      <div>
        <Alert
          isOpen={this.state.alert}
          message={this.state.alertMsg}
          className={'modal-warning'}
          hasYesNoBtn={true}
          onYes={() => this.removePatientInConfinementList()}
          onNo={() => this.closeAlert()}
        />
        <Loader isOpen={this.state.loader} />
        <div>
          <Table
            hover
            responsive
            className="table-outline mb-0 d-none d-sm-table"
          >
            <thead className="thead-light">
              <tr>
                <th colSpan="3">
                  <i className="icon-people" />
                  &nbsp;Patient Date of Confinement
                </th>
              </tr>
            </thead>
            <tbody>{patientList}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    confinementList: state.patient.confinementList,
    authToken: state.userIdentity.data.authToken
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchPatientConfinementList,
      removeInConfinementList
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PatientConfinement));
