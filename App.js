import React, {Component} from 'react';
import {Alert, Button, Text, View, StyleSheet} from 'react-native';
import Expo from 'expo';
import LoginScreen from './screens/loginScreen'
import PageListScreen from './screens/pageListScreen'

import {Router, Scene} from 'react-native-router-flux';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="login" component={LoginScreen} title='Login' initial hideNavBar/>
          <Scene key="listPage" component={PageListScreen} title='listPage' hideNavBar/>
        </Scene>

      </Router>
    )
  }
}
