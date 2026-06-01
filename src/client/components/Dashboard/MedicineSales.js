import _ from 'lodash';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Card, CardBody, Table } from 'reactstrap';

// action
import { fetchTodayMedSalesList } from '../../actions/actionMedicines';

class MedicineSales extends Component {
  componentDidMount() {
    const { authToken } = this.props;
    if (authToken) {
      this.props.fetchTodayMedSalesList(authToken, () => {});
    }
  }

  render() {
    let { medSalesList } = this.props;
    let { sales } = medSalesList;
    let salesList = [];

    sales = _.orderBy(sales, 'name', 'asc');

    if (_.isArray(medSalesList.sales)) {
      salesList = _.map(sales, (med, index) => {
        const { name, qty, unit_price } = med;
        return (
          <tr key={index}>
            <td>
              <div>{name}</div>
            </td>
            <td>
              <div>{qty}</div>
            </td>
            <td>
              <div>
                &#x20B1;{` ${parseInt(qty)} * ${parseFloat(unit_price)}`}
              </div>
            </td>
          </tr>
        );
      });
    }

    return (
      <Card>
        <CardBody>
          <Table
            hover
            responsive
            className="table-outline mb-0 d-none d-sm-table"
          >
            <thead className="thead-light">
              <tr>
                <th colSpan="3">
                  <i className="fa fa-hospital-o fa-sm" />
                  &nbsp;Medicine Sales
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td />
                <td>Qty</td>
                <td>Price</td>
              </tr>
              {salesList}
              <tr>
                <td>Total Sales: </td>
                <td />
                <td>
                  &#x20B1;
                  {` ${parseFloat(medSalesList.total_sale_today * 1) || 0}`}
                </td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    medSalesList: state.medicine.medSalesList,
    authToken: state.userIdentity.data.authToken
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchTodayMedSalesList
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MedicineSales));
