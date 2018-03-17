import React, {Component} from 'react';
import {
  Alert,
  Button,
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground
} from 'react-native';
import {Constants} from 'expo';
import Expo from 'expo';
import {RkButton} from 'react-native-ui-kitten';
import imgBtn from '../assets/images/facebook_btn.png';
import wallScreen from '../assets/images/wallscreen.png';
import {Actions} from 'react-native-router-flux';

export default class LoginScreen extends Component {

  render() {
    return (
      <ImageBackground style={styles.container} source={wallScreen}>

        <RkButton
          onPress={doLogin}
          rkType='large'
          style={{
          marginTop: 100
        }}>
          <Image
            style={{
            width: 180,
            height: 80
          }}
            source={imgBtn}/>
        </RkButton>
      </ImageBackground>
    );
  }
}

async function doLogin() {
  const {type, token} = await Expo
    .Facebook
    .logInWithReadPermissionsAsync('150759392402778', {permissions: ['public_profile']});

  if (type === 'success') {
    const response = await fetch('https://graph.facebook.com/me?access_token=' + token).then((response) => response.json()).then((profile) => {
      Actions.reset('listPage', {
        token: token,
        _userName: profile.name
      });
    });

    // Get the user's name using Facebook's Graph API const response = await
    // fetch(`https://graph.facebook.com/me/accounts?access_token=${token}`).then((r
    // e sponse) => response.json()).then((responseJson) => {
    // fetch('https://graph.facebook.com/' + responseJson.data[0].id +
    // '/subscribed_apps', {     method: 'POST',     headers: {       Accept:
    // 'application/json',       'Content-Type': 'application/json'     },     body:
    // JSON.stringify({access_token: responseJson.data[0].access_token})
    // }).then((res1) => res1.json()).then((res2) => {     Alert.alert('success: ' +
    // res2.success);   }); }).catch((error) => {   console.error(error); });

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

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
