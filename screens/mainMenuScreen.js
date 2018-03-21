import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    ImageBackground,
    Image,
    TouchableOpacity
} from 'react-native';
import {
    Avatar,
    Button,
    Badge,
    Header,
    Icon,
    Card
} from 'react-native-elements'

//img
import cover from '../assets/images/cover.jpg';
import iconProduct from '../assets/images/product.icon.png';
import iconClient from '../assets/images/client.icon.png';
import iconOrder from '../assets/images/order.icon.png';
import iconMayLove from '../assets/images/maylove.icon.png';
import iconHistory from '../assets/images/history.icon.png';
import iconStatistic from '../assets/images/statistic.icon.png';

import GridView from 'react-native-super-grid';
import {Font, Expo, Permissions, Notifications} from 'expo';
import {Actions} from 'react-native-router-flux';

//push noti
const PUSH_ENDPOINT = 'http://52.41.8.125/page/token';

const SCREEN_WIDTH = Dimensions
    .get('window')
    .width;

const product = 'product';
const client = 'client';
const order = 'order';
const maylove = 'maylove';
const history = 'history';
const statistic = 'statistic';

export default class MainMenuScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            likes: 25,
            notification: {
                origin: '',
                data: {}
            }
        };
    }

    async componentDidMount()
    {
        await fetch('https://graph.facebook.com/v2.12/' + this.props.page.id + '?fields=fan_count&&access_token=' + this.props.page.access_token).then((res1) => res1.json()).then((res2) => {
            this.setState({likes: res2.fan_count});
        });
    }

    componentWillMount() {
        this.registerForPushNotificationsAsync();
        // Handle notifications that are received or selected while the app is open. If
        // the app was closed and then opened by tapping the notification (rather than
        // just tapping the app icon to open it), this function will fire on the next
        // tick after the app starts with thenotification
        this._notificationSubscription = Notifications.addListener(this._handleNotification);

    }

    _handleNotification = (notification) => {
        this.setState({notification: notification});
    };

    registerForPushNotificationsAsync = async() => {
        const {status: existingStatus} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because iOS won't
        // necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app install,
            // so this will only ask on iOS
            const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        // POST the token to your backend server from where you can retrieve it to send
        // push notifications.
        return fetch(PUSH_ENDPOINT, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({page_id: this.props.page.id, tokenPush: token})
        });
    }

    render() {
        return (

            <View
                style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: '#212121'
            }}>
                {/* <Header
                    placement="left"
                    statusBarProps={{
                    barStyle: 'light-content'
                }}
                    leftComponent={< Icon name = 'menu' color = '#ffffff' onPress = {
                    function () {
                        alert('hihi')
                    }
                } />}
                    centerComponent={{
                    text: 'Menu',
                    style: {
                        color: '#fff',
                        fontSize: 25
                    }
                }}
                    rightComponent={{
                    icon: 'home',
                    color: '#fff'
                }}/> */}

                <ImageBackground
                    source={cover}
                    style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: 180
                }}>
                    <View
                        style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginTop: 50
                    }}>
                        <View
                            style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View
                                style={{
                                flex: 1,
                                marginTop: 10,
                                justifyContent: 'flex-end'
                            }}>
                                <Badge
                                    containerStyle={{
                                    backgroundColor: '#1E88E5'
                                }}>
                                    <Text
                                        style={{
                                        color: 'white',
                                        fontSize: 16
                                    }}>Likes: {this.state.likes}
                                    </Text>
                                </Badge>
                            </View>
                        </View>
                        <View
                            style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}>
                            <Avatar
                                width={100}
                                height={100}
                                source={{
                                uri: 'https://graph.facebook.com/' + this.props.page.id + '/picture?type=large'
                            }}
                                activeOpacity={0.7}
                                avatarStyle={{
                                borderRadius: 145 / 2
                            }}
                                overlayContainerStyle={{
                                backgroundColor: 'transparent'
                            }}/>

                        </View>
                        <View
                            style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center'
                        }}>
                            <View
                                style={{
                                flex: 1,
                                marginTop: 10,
                                justifyContent: 'flex-end'
                            }}>
                                <Badge
                                    containerStyle={{
                                    backgroundColor: '#FF8A65'
                                }}>
                                    <Text
                                        style={{
                                        color: 'white',
                                        fontSize: 16
                                    }}>Todays: 125</Text>
                                </Badge>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>
                        <View
                            style={{
                            flex: 1,
                            marginTop: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text
                                style={{
                                fontSize: 25,
                                color: 'white',
                                fontWeight: 'bold'
                            }}>
                                {this.props.page.name}
                            </Text>
                        </View>
                    </View>
                </ImageBackground>
                <ScrollView
                    style={{
                    marginBottom: 20,
                    marginTop: 10,
                    marginLeft: 0,
                    flexDirection: 'column'
                }}
                    contentContainerStyle={{
                    alignItems: 'center'
                }}>
                    <GridView
                        spacing={0}
                        itemDimension={130}
                        items={[
                        {
                            title: 'Sản phẩm',
                            code: product,
                            img: iconProduct
                        }, {
                            title: 'Khách hàng',
                            code: client,
                            img: iconClient
                        }, {
                            title: 'Đơn hàng',
                            code: order,
                            img: iconOrder
                        }, {
                            title: 'Quan tâm',
                            code: maylove,
                            img: iconMayLove
                        }, {
                            title: 'lịch sử',
                            code: history,
                            img: iconHistory
                        }, {
                            title: 'Thống kê',
                            code: statistic,
                            img: iconStatistic
                        }
                    ]}
                        renderItem={item => (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                            switch (item.code) {
                                case product:
                                    Actions.productList({page: this.props.page});
                                    break;
                                case client:
                                    Actions.clientList({page: this.props.page});
                                    break;
                                case order:
                                    Actions.orderList({page: this.props.page});
                                    break;
                                case maylove:
                                    alert(maylove);
                                    break;
                                case history:
                                Actions.historyList({page: this.props.page});
                                    break;
                                case statistic:
                                    alert(statistic);
                                    break;
                            };
                        }}>
                            <Image
                                source={item.img}
                                style={{
                                width: 140,
                                height: 120,
                                borderRadius: 10
                            }}/>
                        </TouchableOpacity>
                    )}/>
                </ScrollView>
                <View
                    style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {/* <Text>Origin: {this.state.notification.origin}</Text>
                    <Text>Data: {JSON.stringify(this.state.notification.data)}</Text> */}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paragraph: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e'
    },

    navBar: {
        height: 60,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignContent: 'center'
    },
    nameHeader: {
        color: 'black',
        fontSize: 25,
        marginLeft: 20
    },
    button: {
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        shadowColor: '#303838',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowRadius: 10,
        shadowOpacity: 0.35,
        height: 130
    }
});
