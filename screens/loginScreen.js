import React, {Component} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import Expo from 'expo';
import {SocialIcon} from 'react-native-elements'
import wallScreen from '../assets/images/wallscreen.png';
import {Actions} from 'react-native-router-flux';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    }
    this.doLogin = this
      .doLogin
      .bind(this);
  }

  async doLogin() {
    this.setState({isVisible:true});
    const {type, token} = await Expo
      .Facebook
      .logInWithReadPermissionsAsync('150759392402778', {
        permissions: ['public_profile', 'pages_show_list']
      });
    if (type === 'success') {
      this.setState({isVisible:false});
      const response = await fetch('https://graph.facebook.com/me?access_token=' + token).then((response) => response.json()).then((profile) => {
        Actions.push('listPage', {
          token: token,
          _userName: profile.name
        });
      });

    }
  };

  render() {
    return (
      <ImageBackground style={styles.container} source={wallScreen}>

        <SocialIcon
          button
          title="Đăng nhập"
          style={{
          width: 150
        }}
          onPress={this.doLogin}
          type='facebook'/>
        <OrientationLoadingOverlay
          visible={this.state.isVisible}
          color="white"
          indicatorSize="large"
          messageFontSize={24}
          message="Loading... 😀😀😀"></OrientationLoadingOverlay>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: null,
    height: null
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e'
  }
});
