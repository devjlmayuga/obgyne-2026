import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';

// components
import PatientConfinement from './PatientConfinement';
import MedicineSales from './MedicineSales';
import TodaysPatientsList from './TodaysPatientsList';
import PurchaseItemModal from './PurchaseItemModal';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayPurchaseModal: false,
      checkupId: 0
    };

    this.togglePurchaseItem = this.togglePurchaseItem.bind(this);
    this.closePurchaseModal = this.closePurchaseModal.bind(this);
  }

  togglePurchaseItem(checkupId) {
    this.setState({
      displayPurchaseModal: !this.state.displayPurchaseModal,
      checkupId: checkupId || 0
    });
  }

  closePurchaseModal() {
    this.setState({ displayPurchaseModal: false, checkupId: 0 });
  }

  render() {
    return (
      <div>
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" sm="12" md="5">
              <PatientConfinement />
              <MedicineSales />
            </Col>
            <Col xs="12" sm="12" md="7">
              <TodaysPatientsList
                onTogglePurchaseModal={checkupId =>
                  this.togglePurchaseItem(checkupId)
                }
              />
            </Col>
          </Row>
        </div>
        <div>
          <PurchaseItemModal
            onTogglePurchaseModal={() => {
              this.togglePurchaseItem;
            }}
            closePurchaseModal={() => {
              this.closePurchaseModal();
            }}
            displayModal={this.state.displayPurchaseModal}
            checkupId={this.state.checkupId}
          />
        </div>
      </div>
    );
  }
}

export default Dashboard;
