import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  FormGroup,
  Col,
  Card,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Button
} from 'reactstrap';
import CheckupForm from './CheckupForm';
import { fetchCheckUpList } from '../../actions/actionCheckup';
import { selectCheckupForm } from '../../actions/actionPatients';

import moment from 'moment';

class CheckupWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      historyPage: 1,
      historyLimit: 10,
      isLoadingHistory: false
    };

    this.loadCheckupHistory = this.loadCheckupHistory.bind(this);
    this.loadMoreCheckupHistory = this.loadMoreCheckupHistory.bind(this);
  }

  componentDidMount() {
    const { patientId } = this.props.match.params;
    this.loadCheckupHistory(patientId, 1, false);
  }

  loadCheckupHistory(patientId, page, append) {
    const { historyLimit } = this.state;

    this.setState({ isLoadingHistory: true });
    this.props.fetchCheckUpList(
      patientId,
      () => {
        this.setState({
          historyPage: page,
          isLoadingHistory: false
        });
      },
      page,
      historyLimit,
      append
    );
  }

  loadMoreCheckupHistory() {
    const { patientId } = this.props.match.params;
    const { historyPage, isLoadingHistory } = this.state;

    if (isLoadingHistory) {
      return;
    }

    this.loadCheckupHistory(patientId, historyPage + 1, true);
  }

  selectForm(data) {
    this.props.selectCheckupForm(data);
  }

  renderCheckupHistory() {
    const {
      patientCheckupList,
      patientCheckupMeta,
      selectedCheckupForm
    } = this.props;
    const { isLoadingHistory } = this.state;
    const elemList = [];
    _.map(patientCheckupList, (data, key) => {
      let checkupType = '';
      const isSelected =
        selectedCheckupForm &&
        selectedCheckupForm.schedule_checkup_id === data.schedule_checkup_id;

      if (data.sc_checkup_history) {
        const { checkup_type_id = '' } = data.sc_checkup_history;

        if (checkup_type_id === 'Obstertics' || checkup_type_id === 6) {
          checkupType = ' - (O)';
        } else if (checkup_type_id === 'Gynecology' || checkup_type_id === 7) {
          checkupType = ' - (G)';
        }
      }
      const dateVal = moment(data.checkup_date)
        .local()
        .format('MMM DD, YYYY');
      const todayVal = moment()
        .local()
        .format('MMM DD, YYYY');
      elemList.push(
        <ListGroupItem
          tag="button"
          key={data.schedule_checkup_id || key}
          active={isSelected}
          style={{ textAlign: 'center' }}
          onClick={() => {
            this.selectForm(data);
          }}
        >
          {dateVal === todayVal ? 'Today' : dateVal} {checkupType}
        </ListGroupItem>
      );
    });

    return (
      <React.Fragment>
        <ListGroup>{elemList}</ListGroup>
        {patientCheckupMeta && patientCheckupMeta.hasMore && (
          <Button
            block
            color="link"
            className="mt-2"
            disabled={isLoadingHistory}
            onClick={this.loadMoreCheckupHistory}
          >
            {isLoadingHistory ? 'Loading...' : 'Load More'}
          </Button>
        )}
      </React.Fragment>
    );
  }

  render() {
    return (
      <FormGroup row className="my-0">
        <Col md="9">
          <CheckupForm />
        </Col>
        <Col md="3">
          <Card>
            <CardHeader id="headingOne">
              <strong>Checkup History</strong>
            </CardHeader>
            <CardBody>{this.renderCheckupHistory()}</CardBody>
          </Card>
        </Col>
      </FormGroup>
    );
  }
}

function mapStateToProps(state) {
  return {
    patientCheckupList: state.patient.patientCheckupList,
    patientCheckupMeta: state.patient.patientCheckupMeta,
    selectedCheckupForm: state.patient.selectedCheckupForm
  };
}

export default connect(
  mapStateToProps,
  { fetchCheckUpList, selectCheckupForm }
)(withRouter(CheckupWrapper));
