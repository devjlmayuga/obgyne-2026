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
  ListGroupItem
} from 'reactstrap';
import CheckupForm from './CheckupForm';
import { fetchCheckUpList } from '../../actions/actionCheckup';
import { selectCheckupForm } from '../../actions/actionPatients';

import moment from 'moment';

class CheckupWrapper extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { patientId } = this.props.match.params;
    this.props.fetchCheckUpList(patientId, () => {});
  }

  selectForm(data) {
    this.props.selectCheckupForm(data);
  }

  renderCheckupHistory() {
    const { patientCheckupList } = this.props;
    const elemList = [];
    _.map(patientCheckupList, (data, key) => {
      let checkupType = '';

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
          key={key}
          style={{ textAlign: 'center' }}
          onClick={() => {
            this.selectForm(data);
          }}
        >
          {dateVal === todayVal ? 'Today' : dateVal} {checkupType}
        </ListGroupItem>
      );
    });

    return <ListGroup>{elemList}</ListGroup>;
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
    patientCheckupList: state.patient.patientCheckupList
  };
}

export default connect(
  mapStateToProps,
  { fetchCheckUpList, selectCheckupForm }
)(withRouter(CheckupWrapper));
