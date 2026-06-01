import _ from 'lodash';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

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
  fetchInventoryList,
  setSelectedItem
} from '../../actions/actionMedicines';

// component
import SearchBar from '../ReusableComp/SearchBar';
import Loader from '../ReusableComp/Loader';
import UpdateItemModal from './UpdateItemModal';
import ItemList from './ItemList';
import DeleteItemModal from './DeleteItemModal';

class Inventory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: '',
      inventoryList: {},
      isLoading: true,
      isUpdateItem: false,
      isDeleteItem: false,
      selectedItem: {}
    };

    this.toggleUpdateItem = this.toggleUpdateItem.bind(this);
    this.toggleDeleteItem = this.toggleDeleteItem.bind(this);
  }

  toggleUpdateItem(med) {
    this.props.setSelectedItem(med);
    this.setState({
      isUpdateItem: !this.state.isUpdateItem
    });
  }

  toggleDeleteItem(med) {
    this.props.setSelectedItem(med);
    this.setState({
      isDeleteItem: !this.state.isDeleteItem
    });
  }

  inventorySearch(term) {
    this.props.fetchInventoryList(term, inventoryList => {
      this.setState({
        inventoryList,
        isLoading: false
      });
    });
  }

  componentWillMount() {
    this.inventorySearch('');
  }

  render() {
    const inventorySearch = _.debounce(term => {
      this.inventorySearch(term);
    }, 300);

    let { inventoryList } = this.state;
    let meds = [];

    if (this.state.isLoading) {
      return <Loader open={this.state.isLoading} />;
    }

    if (_.isArray(inventoryList)) {
      meds = (
        <ItemList
          invetoryList={inventoryList}
          toggleUpdate={this.toggleUpdateItem}
          toggleDelete={this.toggleDeleteItem}
        />
      );
    }

    return (
      <div>
        <div className="animated fadeIn">
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <strong>Inventory</strong>
                  <div className="card-header-actions">
                    <Button
                      color="link"
                      className="card-header-action btn-setting"
                    >
                      {/* <i className="fa fa-plus-square" title="Add new?" /> */}
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <SearchBar
                    placeholder="Enter item name..."
                    onSearchTermChange={inventorySearch}
                  />
                  <Table
                    hover
                    responsive
                    className="table-outline mb-0 d-none d-sm-table"
                  >
                    <thead className="thead-light">
                      <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>{meds}</tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <UpdateItemModal
          onToggleUpdateModal={this.toggleUpdateItem}
          displayModal={this.state.isUpdateItem}
          updateList={() => this.inventorySearch('')}
        />
        <DeleteItemModal
          onToggleDeleteModal={this.toggleDeleteItem}
          displayModal={this.state.isDeleteItem}
          updateList={() => this.inventorySearch('')}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    inventory: state.medicine.inventory,
    authToken: state.userIdentity.data.authToken
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchInventoryList,
      setSelectedItem
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Inventory));
