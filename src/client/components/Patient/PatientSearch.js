import _ from 'lodash';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';

import {
  Table,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button
} from 'reactstrap';

// action
import {
  fetchPatientList,
  schedulePatient,
  fetchTodaysPatientSched,
  deletePatient
} from '../../actions/actionPatients';
import { fetchCheckUpList } from '../../actions/actionCheckup';

// component
import SearchBar from '../ReusableComp/SearchBar';
import { Loader, Alert } from '../Utilities/Modals';

class PatientSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: '',
      patientList: {},
      isLoading: false,
      isAlert: false,
      alertHasYesNo: false,
      alertClassName: 'modal-primary',
      alertMessage: '',
      alertOnYes: () => {},
      alertOnNo: () => {}
    };

    this.patientSearch('');

    this.removePatient = this.removePatient.bind(this);
  }

  patientSearch(term) {
    this.props.fetchPatientList(term, patientList => {
      this.setState({
        patientList,
        isLoading: false
      });
    });
  }

  schedulePatient(patient_id) {
    var reply = confirm('Schedule patient?');
    if (reply) {
      this.props.schedulePatient(
        { patient_id, status_id: 8, in_dashboard: true },
        success => {
          if (success) {
            alert('Patient successfully scheduled!');
          } else {
            alert('Request failed!');
          }
        }
      );
    }
  }

  removePatient(patient) {
    const { patient_name, patient_id } = patient;

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

    const onYes = () => {
      onNo();
      this.props.deletePatient(patient_id, () => {
        this.patientSearch('');
      });
    };

    this.setState({
      isAlert: true,
      alertHasYesNo: true,
      alertClassName: 'modal-danger',
      alertMessage: `Do you want to delete ${patient_name}?`,
      alertOnNo: onNo,
      alertOnYes: onYes
    });
  }

  navigateToPatientForm(patientId) {
    this.props.fetchTodaysPatientSched(patientId, response => {
      this.props.fetchCheckUpList(patientId, () => {
        this.props.history.push(`/patient/${patientId}`);
      });
    });
  }

  render() {
    const patientSearch = _.debounce(term => {
      this.patientSearch(term);
    }, 300);

    let { patientList } = this.state;
    let patients = [];

    if (_.isArray(patientList)) {
      patients = _.map(patientList, (patient, index) => {
        return (
          <tr key={index}>
            <td>{patient.patient_name}</td>
            <td>
              {moment(patient.birth_date)
                .local()
                .format('MMM DD, YYYY')}
            </td>
            <td>{patient.address}</td>
            <td className="text-right">
              <Button
                type="submit"
                size="sm"
                color="warning"
                onClick={() => {
                  this.schedulePatient(patient.patient_id);
                }}
              >
                <i className="icon-clock" title="Schedule today?" />
              </Button>
              &nbsp;
              <Button
                type="submit"
                size="sm"
                color="primary"
                onClick={() => {
                  this.navigateToPatientForm(patient.patient_id);
                }}
              >
                <i className="icon-pencil" title="Edit?" />
              </Button>
              &nbsp;
              <Button
                type="submit"
                size="sm"
                color="danger"
                onClick={() => {
                  this.removePatient(patient);
                }}
              >
                <i className="icon-trash" title="Remove?" />
              </Button>
            </td>
          </tr>
        );
      });
    }

    const {
      isLoading,
      isAlert,
      alertMessage,
      alertClassName,
      alertHasYesNo,
      alertOnYes,
      alertOnNo
    } = this.state;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <strong>Search Patient</strong>
                <div className="card-header-actions">
                  <Button
                    color="link"
                    className="card-header-action btn-setting"
                  >
                    <i className="fa fa-plus-square" title="Add new?" />
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <SearchBar
                  placeholder="Enter patient name..."
                  onSearchTermChange={patientSearch}
                />
                <Table
                  hover
                  responsive
                  className="table-outline mb-0 d-none d-sm-table"
                >
                  <thead className="thead-light">
                    <tr>
                      <th>Name</th>
                      <th>Birthdate</th>
                      <th>Address</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>{patients}</tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
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
  return {
    patientList: state.patient.patientList,
    authToken: state.userIdentity.data.authToken
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchPatientList,
      schedulePatient,
      fetchTodaysPatientSched,
      fetchCheckUpList,
      deletePatient
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PatientSearch));
