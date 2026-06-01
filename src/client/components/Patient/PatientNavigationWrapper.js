import React, { Component } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import PatientInformationWrapper from './PatientInformationWrapper';
import MedicalHistoryWrapper from './MedicalHistoryWrapper';
import CheckupWrapper from './CheckupWrapper';
import TestResultsWrapper from './TestResultsWrapper';

class PatientNavigationForm extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: new Array(4).fill('3')
    };
  }

  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice();
    newArray[tabPane] = tab;
    this.setState({
      activeTab: newArray
    });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Nav tabs>
          <NavItem>
            <NavLink
              active={this.state.activeTab[0] === '1'}
              onClick={() => {
                this.toggle(0, '1');
              }}
            >
              <i className="icon-people" />
              <span className={this.state.activeTab[0] === '1' ? 'd-none' : ''}>
                {' '}
                Patient Information
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={this.state.activeTab[0] === '2'}
              onClick={() => {
                this.toggle(0, '2');
              }}
            >
              <i className="fa fa-hospital-o fa-sm" />
              <span className={this.state.activeTab[0] === '2' ? 'd-none' : ''}>
                {' '}
                Past Medical History
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={this.state.activeTab[0] === '3'}
              onClick={() => {
                this.toggle(0, '3');
              }}
            >
              <i className="fa fa-stethoscope fa-sm" />
              <span className={this.state.activeTab[0] === '3' ? 'd-none' : ''}>
                {' '}
                Checkup Form
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={this.state.activeTab[0] === '4'}
              onClick={() => {
                this.toggle(0, '4');
              }}
            >
              <i className="fa fa-laptop fa-sm" />
              <span className={this.state.activeTab[0] === '4' ? 'd-none' : ''}>
                {' '}
                Test Results
              </span>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab[0]}>
          <TabPane tabId="1">
            <PatientInformationWrapper />
          </TabPane>
          <TabPane tabId="2">
            <MedicalHistoryWrapper />
          </TabPane>
          <TabPane tabId="3">
            <CheckupWrapper />
          </TabPane>
          <TabPane tabId="4">
            <TestResultsWrapper />
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default PatientNavigationForm;
