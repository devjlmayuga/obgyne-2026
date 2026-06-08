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
  Button,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';

// action
import {
  fetchInventoryList,
  setSelectedItem
} from '../../actions/actionMedicines';

// component
import SearchBar from '../ReusableComp/SearchBar';
import { Loader } from '../Utilities/Modals';
import UpdateItemModal from './UpdateItemModal';
import ItemList from './ItemList';
import DeleteItemModal from './DeleteItemModal';

class Inventory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: '',
      inventoryList: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      isLoading: true,
      isUpdateItem: false,
      isDeleteItem: false,
      selectedItem: {}
    };

    this.toggleUpdateItem = this.toggleUpdateItem.bind(this);
    this.toggleDeleteItem = this.toggleDeleteItem.bind(this);
    this.changePage = this.changePage.bind(this);
    this.inventorySearchDebounced = _.debounce(term => {
      this.inventorySearch(term, 1);
    }, 300);
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

  inventorySearch(term, page = 1) {
    const { pageSize } = this.state;

    this.setState({
      term,
      currentPage: page,
      isLoading: true
    });

    this.props.fetchInventoryList(term, response => {
      const payload = response || {};
      const inventoryList = _.isArray(payload) ? payload : payload.data;

      this.setState({
        inventoryList: inventoryList || [],
        totalItems: payload.total || (inventoryList && inventoryList.length) || 0,
        totalPages: payload.totalPages || 1,
        currentPage: payload.page || page,
        isLoading: false
      });
    }, page, pageSize);
  }

  componentDidMount() {
    this.inventorySearch('', 1);
  }

  changePage(page) {
    const { term, currentPage, totalPages } = this.state;

    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    this.inventorySearch(term, page);
  }

  render() {
    let { inventoryList, currentPage, totalPages, totalItems, isLoading } = this.state;
    let meds = [];

    if (_.isArray(inventoryList)) {
      meds = (
        <ItemList
          invetoryList={inventoryList}
          toggleUpdate={this.toggleUpdateItem}
          toggleDelete={this.toggleDeleteItem}
        />
      );
    }

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
                    onSearchTermChange={this.inventorySearchDebounced}
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
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">
                        Showing page {currentPage} of {totalPages} ({totalItems}{' '}
                        items)
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
        </div>
        <UpdateItemModal
          onToggleUpdateModal={this.toggleUpdateItem}
          displayModal={this.state.isUpdateItem}
          updateList={() =>
            this.inventorySearch(this.state.term, this.state.currentPage)
          }
        />
        <DeleteItemModal
          onToggleDeleteModal={this.toggleDeleteItem}
          displayModal={this.state.isDeleteItem}
          updateList={() =>
            this.inventorySearch(this.state.term, this.state.currentPage)
          }
        />
        <Loader isOpen={isLoading} />
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
