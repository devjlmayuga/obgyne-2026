import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router';
import moment from 'moment';

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Form,
  Row,
  Col,
  Table,
  CardFooter
} from 'reactstrap';
import {
  uploadFile,
  fetchPatientInformation,
  deleteTestResult
} from '../../actions/actionPatients';
import { Loader, Alert } from '../Utilities/Modals';
import { renderTestResultsSection } from './CheckupUtil';

class TestResultsWrapper extends Component {
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

    this.removeFile = this.removeFile.bind(this);
  }

  toggleAccordion(tab) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : x));
    this.setState({
      accordion: state
    });
  }

  componentWillMount() {
    const { patientId } = this.props.match.params;
    // this.props.fetchMedicalHistory(patientId, success => {
    //   this.props.fetchPatientDelivery(patientId, success2 => {
    //     this.setState({ isLoading: false });
    //   });
    // });
  }

  submitForm(formValues) {
    let request = formValues;
    request.patient_id = this.props.patientInformation.patient_id;

    if (request.file.size > 5000000) {
      this.setState({
        isAlert: true,
        alertClassName: 'modal-danger',
        alertMessage: 'File size should not exceed 5mb'
      });
      return;
    }

    this.setState({
      isLoading: true
    });

    this.props.uploadFile(request, response => {
      if (!response) {
        this.setState({
          isAlert: true,
          alertClassName: 'modal-danger',
          alertMessage: 'Failed to upload the file',
          isLoading: false
        });
      } else {
        this.props.fetchPatientInformation(request.patient_id, response => {
          this.setState({
            isAlert: true,
            alertClassName: 'modal-success',
            alertMessage: 'File is successfully uploaded!',
            isLoading: false
          });
        });
      }
    });
  }

  viewFile(url) {
    window.open(url, '_blank');
  }

  removeFile(testResult) {
    const { test_type, patient_id, google_id } = testResult;

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
      this.setState({ isLoading: true });
      this.props.deleteTestResult(google_id, response => {
        if (!response) {
          this.setState({
            isLoading: false,
            isAlert: true,
            alertMessage: 'Failed to delete the file!'
          });
        } else {
          this.props.fetchPatientInformation(patient_id, () => {
            this.setState({
              isAlert: true,
              alertClassName: 'modal-success',
              alertMessage: 'File is successfully deleted!',
              isLoading: false
            });
          });
        }
      });
    };

    this.setState({
      isAlert: true,
      alertHasYesNo: true,
      alertClassName: 'modal-danger',
      alertMessage: `Do you want to delete ${test_type}?`,
      alertOnNo: onNo,
      alertOnYes: onYes
    });
  }

  render() {
    const { handleSubmit, sc_test_results } = this.props;
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

    let items = [];
    if (_.isArray(sc_test_results)) {
      items = _.map(sc_test_results, (testResult, index) => {
        const {
          patient_test_results_id,
          patient_id,
          test_type,
          file_path,
          last_edit_date
        } = testResult;

        let btn = (
          <div>
            <Button
              size="sm"
              color="success"
              onClick={() => {
                this.viewFile(file_path);
              }}
            >
              <i className="icon-doc" title="Preview?" />
            </Button>
            &nbsp;
            <Button
              size="sm"
              color="danger"
              onClick={() => {
                this.removeFile(testResult);
              }}
            >
              <i className="icon-trash" title="Remove?" />
            </Button>
          </div>
        );

        return (
          <tr key={index}>
            <td>{test_type}</td>
            <td>
              {moment(last_edit_date)
                .local()
                .format('MMM DD, YYYY ')}
            </td>
            <td className="text-right">{btn}</td>
          </tr>
        );
      });
    }

    return (
      <div>
        <Form
          className="form-horizontal"
          onSubmit={handleSubmit(this.submitForm)}
          encType="multipart/form-data"
        >
          <Card>
            <CardHeader id="headingOne">
              <strong>Test Results</strong>
            </CardHeader>
            <CardBody>
              {renderTestResultsSection(accordion[3], index => {
                this.toggleAccordion(index);
              })}
            </CardBody>
            {/* <CardFooter>
              <Button color="primary" size="sm">
                Save
              </Button>
            </CardFooter> */}

            <CardBody>
              <Table
                hover
                responsive
                className="table-outline mb-0 d-none d-sm-table"
              >
                <thead className="thead-light">
                  <tr>
                    <th>File Type</th>
                    <th>Date Uploaded</th>
                    <th className="text-right" />
                  </tr>
                </thead>
                <tbody>{items}</tbody>
              </Table>
            </CardBody>
          </Card>
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
  return {
    patientInformation: state.patient.patientInformation,
    sc_test_results: state.patient.patientInformation.sc_test_results,
    initialValues: {
      patient_information: state.patient.patientInformation
    }
  };
}

export default connect(
  mapStateToProps,
  { uploadFile, fetchPatientInformation, deleteTestResult }
)(
  reduxForm({ form: 'TestResultsWrapper', enableReinitialize: true })(
    withRouter(TestResultsWrapper)
  )
);
