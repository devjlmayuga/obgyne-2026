import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router';

import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Label
} from 'reactstrap';

// action
import { deleteItem } from '../../actions/actionMedicines';

class DeleteItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalQty: null
    };
    this.submitForm = this.submitForm.bind(this);
    this.toggleDeleteItem = this.toggleDeleteItem.bind(this);
  }

  toggleDeleteItem() {
    this.setState({
      isDeleteItem: !this.state.isDeleteItem
    });
  }

  submitForm() {
    const {
      deleteItem,
      selectedItem,
      updateList,
      onToggleDeleteModal
    } = this.props;

    deleteItem(selectedItem.medicine_id, () => {
      updateList();
      onToggleDeleteModal();
    });
  }

  render() {
    const { handleSubmit, selectedItem } = this.props;
    if (!selectedItem) {
      return '';
    }

    return (
      <Modal
        isOpen={this.props.displayModal}
        toggle={this.props.onToggleDeleteModal}
        className={'modal-danger ' + this.props.className}
      >
        <Form
          className="DeleteItemForm"
          onSubmit={handleSubmit(this.submitForm)}
        >
          <ModalHeader toggle={this.toggleDanger}>Confirmation</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="text-input">{`Do you want to delete ${
                selectedItem.name
              }?`}</Label>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="danger">
              Delete
            </Button>{' '}
            <Button color="secondary" onClick={this.props.onToggleDeleteModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedItem: state.medicine.selectedItem,
    initialValues: state.medicine.selectedItem
  };
}

export default connect(
  mapStateToProps,
  {
    deleteItem
  }
)(
  reduxForm({ form: 'DeleteItemForm', enableReinitialize: true })(
    withRouter(DeleteItemModal)
  )
);
