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
  Button,
  Pagination,
  PaginationItem,
  PaginationLink
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
      patientList: [],
      currentPage: 1,
      pageSize: 10,
      totalPatients: 0,
      totalPages: 0,
      isLoading: false,
      isAlert: false,
      alertHasYesNo: false,
      alertClassName: 'modal-primary',
      alertMessage: '',
      alertOnYes: () => {},
      alertOnNo: () => {}
    };

    this.removePatient = this.removePatient.bind(this);
    this.changePage = this.changePage.bind(this);
    this.patientSearchDebounced = _.debounce(term => {
      this.patientSearch(term, 1);
    }, 300);
  }

  componentDidMount() {
    this.patientSearch('', 1);
  }

  patientSearch(term, page = 1) {
    const { pageSize } = this.state;

    this.setState({
      term,
      currentPage: page,
      isLoading: true
    });

    this.props.fetchPatientList(term, response => {
      const payload = response || {};
      const patientList = _.isArray(payload) ? payload : payload.data;

      this.setState({
        patientList: patientList || [],
        totalPatients: payload.total || (patientList && patientList.length) || 0,
        totalPages: payload.totalPages || 1,
        currentPage: payload.page || page,
        isLoading: false
      });
    }, page, pageSize);
  }

  changePage(page) {
    const { term, currentPage, totalPages } = this.state;

    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    this.patientSearch(term, page);
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
        this.patientSearch(this.state.term, this.state.currentPage);
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
    let { patientList, currentPage, totalPages, totalPatients } = this.state;
    let patients = [];

    if (_.isArray(patientList)) {
      patients = _.map(patientList, (patient, index) => {
        return (
          <tr key={patient.patient_id || index}>
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

    const paginationItems = [];
    const firstPage = Math.max(currentPage - 2, 1);
    const lastPage = Math.min(firstPage + 4, totalPages);
    const startPage = Math.max(lastPage - 4, 1);

    for (let page = startPage; page <= lastPage; page += 1) {
      paginationItems.push(
        <PaginationItem key={page} active={page === currentPage}>
          <PaginationLink onClick={() => this.changePage(page)}>
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

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
                  onSearchTermChange={this.patientSearchDebounced}
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
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                      Showing page {currentPage} of {totalPages} ({totalPatients}{' '}
                      patients)
                    </small>
                    <Pagination className="mb-0">
                      <PaginationItem disabled={currentPage === 1}>
                        <PaginationLink
                          previous
                          onClick={() => this.changePage(currentPage - 1)}
                        />
                      </PaginationItem>
                      {paginationItems}
                      <PaginationItem disabled={currentPage === totalPages}>
                        <PaginationLink
                          next
                          onClick={() => this.changePage(currentPage + 1)}
                        />
                      </PaginationItem>
                    </Pagination>
                  </div>
                )}
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
