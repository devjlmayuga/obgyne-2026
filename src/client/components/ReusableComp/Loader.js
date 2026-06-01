import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Dialog from 'material-ui/Dialog';

export class Loader extends Component {
  static propTypes = {
    open: PropTypes.bool
  };

  static defaultProps = {
    open: true
  };

  render() {
    const { open } = this.props;

    return <div>Loading...</div>;
  }
}

export default Loader;
