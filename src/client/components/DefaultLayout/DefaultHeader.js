import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import {
  AppHeaderDropdown,
  AppNavbarBrand,
  AppSidebarToggler
} from '@coreui/react';
import dateFormat from 'dateformat';
import logo from '../../assets/img/brand/logo.svg';
import sygnet from '../../assets/img/brand/sygnet.svg';
import doc from '../../assets/img/doc.png';

import { userLogout } from '../../actions/actionUserLogin';

class DefaultHeader extends Component {
  static propTypes = {
    userLogout: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  logout() {
    this.props.userLogout();
    this.props.history.push('/login');
  }

  changePassword() {
    this.props.history.push('/changePassword');
  }

  render() {
    const now = new Date();
    const currentDate = dateFormat(now, 'fullDate');

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{
            src: logo,
            width: 89,
            height: 50,
            alt: 'CoreUI Logo'
          }}
          minimized={{
            src: sygnet,
            width: 30,
            height: 30,
            alt: 'CoreUI Logo'
          }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <strong>
              Today:
              {currentDate}
            </strong>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav right style={{ right: 'auto' }}>
              <img src={doc} className="img-avatar" alt="avatar" />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center">
                <strong>Settings</strong>
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  this.changePassword();
                }}
              >
                <i className="fa fa-user" /> Change Password
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  this.logout();
                }}
              >
                <i className="fa fa-lock" /> Logout
              </DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { userLogout }
)(withRouter(DefaultHeader));
