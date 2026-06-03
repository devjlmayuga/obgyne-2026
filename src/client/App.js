import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

// Components
import DefaultLayout from './components/DefaultLayout';
import Login from './components/Login/Login';

export default class App extends Component {

  render() {    
    return (
      <Switch>            
        <Route path="/login" name="Login" component={Login} />
        <Route path="/" name="Home" component={DefaultLayout} />
      </Switch>
    );
  }

}
