import _ from 'lodash';
import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Components
const DefaultLayout = Loadable({
  loader: () => import('./components/DefaultLayout'),
  loading
});

const Login = Loadable({
  loader: () => import('./components/Login/Login'),
  loading
});

export default class App extends Component {

  render() {    
    return (
      <HashRouter>
          <Switch>            
            <Route path="/login" name="Login" component={Login} />
            <Route path="/" name="Home" component={DefaultLayout} />
          </Switch>
      </HashRouter>
    );
  }

}
