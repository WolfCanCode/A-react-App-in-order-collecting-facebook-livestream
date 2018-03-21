import React, {Component} from 'react';
import {Alert, Button, Text, View, StyleSheet} from 'react-native';
import Expo from 'expo';
import LoginScreen from './screens/loginScreen'
import PageListScreen from './screens/pageListScreen'
import MainmenuScreen from './screens/mainMenuScreen'
import {Router, Scene, ActionConst} from 'react-native-router-flux';
import ProductScreen from './screens/product/ProductScreen';
import ClientScreen from './screens/client/ClientScreen';
import OrderScreen from './screens/order/orderScreen';
import HistoryScreen from './screens/history/historyScreen';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="login" component={LoginScreen} initial title='Login'  hideNavBar/>
          <Scene key="listPage" component={PageListScreen} type={ActionConst.RESET}  title='listPage' hideNavBar/>
          <Scene key="mainPage" component={MainmenuScreen}  type={ActionConst.RESET}  title='mainPage' hideNavBar/>

          {/*Product*/}
          <Scene key="productList" component={ProductScreen}  title='productList'  hideNavBar/>
          <Scene key="clientList" component={ClientScreen}  title='clientList'  hideNavBar/>
          <Scene key="orderList" component={OrderScreen}  title='orderList'  hideNavBar/>
          <Scene key="historyList" component={HistoryScreen}  title='historyList'  hideNavBar/>

        </Scene>
        
      </Router>
    )
  }
}
