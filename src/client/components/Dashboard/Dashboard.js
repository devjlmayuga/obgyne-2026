import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap';

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
      checkupId: 0,
      activeTab: 'todays-patients'
    };

    this.togglePurchaseItem = this.togglePurchaseItem.bind(this);
    this.closePurchaseModal = this.closePurchaseModal.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
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

  toggleTab(activeTab) {
    if (this.state.activeTab !== activeTab) {
      this.setState({ activeTab });
    }
  }

  render() {
    const { activeTab } = this.state;

    return (
      <div>
        <div className="animated fadeIn">
          <Card>
            <CardBody>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={activeTab === 'todays-patients' ? 'active' : ''}
                    onClick={() => this.toggleTab('todays-patients')}
                  >
                    Todays Patients list
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === 'confinement' ? 'active' : ''}
                    onClick={() => this.toggleTab('confinement')}
                  >
                    Patient Date of Confinement
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === 'medicine-sales' ? 'active' : ''}
                    onClick={() => this.toggleTab('medicine-sales')}
                  >
                    Medicine Sales
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab} className="pt-3">
                <TabPane tabId="todays-patients">
                  <TodaysPatientsList
                    onTogglePurchaseModal={checkupId =>
                      this.togglePurchaseItem(checkupId)
                    }
                  />
                </TabPane>
                <TabPane tabId="confinement">
                  <PatientConfinement />
                </TabPane>
                <TabPane tabId="medicine-sales">
                  <MedicineSales />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
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
