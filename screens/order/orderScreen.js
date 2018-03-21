import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    ImageBackground,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ImageStore
} from 'react-native';
import {
    Avatar,
    Button,
    Badge,
    Header,
    Icon,
    Divider
} from 'react-native-elements'
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
import PTRView from 'react-native-pull-to-refresh';
import Communications from 'react-native-communications';

//img
const prodImg = require('../../assets/images/avtProd.png');
import SwipeList from 'react-native-smooth-swipe-list';
import {Font, Expo} from 'expo';
import ActionButton from 'react-native-action-button';
import {Actions} from 'react-native-router-flux';
import ListItemButton from '../../components/listItemButtonComponent'
import Modal from "react-native-modal";
import {Kaede} from 'react-native-textinput-effects';
import {ImagePicker} from 'expo';

const SCREEN_WIDTH = Dimensions
    .get('window')
    .width;
const myUrl = 'http://52.41.8.125'

export default class OrderScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: [],
            isVisible: true,
            modalVisible: false,
            imgProduct: prodImg,
            codeProduct: '',
            nameProduct: '',
            priceProduct: 0,
            okModal: false,
            isAdd: false,
            activeOkModal: false,
            upOkModal: false,
            searchText: '',
            loadData: false
        };

    }

    async componentDidMount()
    {
        await this.getData();
    }

    async getData() {
        this.setState({loadData: false});
        await fetch(myUrl + '/product_order?where={"isCheck":false,"page_id":' + this.props.page.id + '}').then((res1) => res1.json()).then((res2) => {
            let list = res2;
            this.rowData = list.map((item, index) => {
                return {
                    id: index,
                    rowView: getRowView(item),
                    rightSubView: this.activeButton(item.id), //optional
                    style: styles.row //optional but recommended to style your rows
                };
            });
            this.setState({rowData: this.rowData});
            this.setState({isVisible: false});
            this.setState({loadData: true});

        });

    }

    _refresh = function () {
        this.getData();
        return new Promise((resolve) => {
            if (this.state.loadData) 
                resolve();
            }
        );
    }

    _cancelModal = () => {
        if (!this.state.modalVisible == false) 
            this.setState({imgProduct: prodImg, codeProduct: '', nameProduct: '', priceProduct: 0, modalVisible: false});
        };
    
    _activeProduct = async(id) => {
        fetch(myUrl + '/product_order/' + id, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({isCheck: true})
        }).then((res1) => res1.json()).then((res2) => {

            this.setState({activeOkModal: true});
            this.getData();

        });

    }

    activeButton(id) {
        return (<ListItemButton
            text="xác nhận"
            color="ORANGE"
            onPress={() => this._activeProduct(id)}/>);
    }

    render() {
        return (

            <View
                style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: '#212121'
            }}>
                <Header
                    placement="left"
                    outerContainerStyles={{
                    borderBottomWidth: 0,
                    paddingBottom: 10,
                    height: 70
                }}
                    backgroundColor="rgb(38,166,154)"
                    statusBarProps={{
                    barStyle: 'light-content'
                }}
                    leftComponent={< Icon type = 'entypo' name = 'chevron-thin-left' color = '#ffffff' onPress = {
                    function () {
                        Actions.pop();
                    }
                } />}
                    centerComponent={{
                    text: 'ĐƠN HÀNG',
                    style: {
                        color: '#fff',
                        fontSize: 25
                    }
                }}
                    rightComponent={{}}/>

                <PTRView
                    onRefresh={this
                    ._refresh
                    .bind(this)}>
                    <ScrollView
                        style={{
                        flex: 1,
                        alignSelf: 'stretch'
                    }}>
                        <SwipeList
                            rowData={this.state.rowData}
                            rowStyle={{
                            marginLeft: 5,
                            marginRight: 5,
                            borderBottomColor: 'black',
                            borderBottomWidth: 1
                        }}/>
                    </ScrollView>
                </PTRView>

                <Modal isVisible={this.state.activeOkModal} style={styles.bottomModal}>
                    <View style={styles.modalContent}>
                        <Text>Xác nhận thành công</Text>
                        <TouchableOpacity
                            onPress={() => {
                            this.setState({activeOkModal: false})
                        }}>
                            <View style={styles.button}>
                                <Text>OK</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </Modal>
                <OrientationLoadingOverlay
                    visible={this.state.isVisible}
                    color="white"
                    indicatorSize="large"
                    messageFontSize={24}
                    message="Tải đơn hàng... 😀😀😀"></OrientationLoadingOverlay>
            </View>
        );
    }
}

function getRowView(item) {
    return <View
        style={{
        marginTop: 15,
        marginBottom: 15,
        flexDirection: "row",
        height: 65
    }}>

        <View
            style={{
            flexDirection: 'column',
            flex: 5
        }}>
            <Text
                style={{
                color: 'white',
                fontSize: 20,
                flex: 1,
                marginLeft: 20
            }}>{item.clientName}</Text>
            <Badge
                value={item.clientPhone}
                onPress={() => Communications.phonecall(item.clientPhone, true)}
                textStyle={{
                color: 'white',
                fontSize: 15
            }}
                style={{
                flex: 1,
                alignItems: 'center'
            }}/>
        </View>
        <View
            style={{
            flexDirection: 'column',
            flex: 3
        }}></View>
        <View
            style={{
            flex: 2,
            flexDirection: 'column'
        }}>
            <Avatar
                medium
                rounded
                source={{
                uri: item.prodImage
            }}
                activeOpacity={0.7}
                style={{
                width: 70,
                height: 70
            }}/>
            <Text
                style={{
                color: 'white',
                fontSize: 15,
                flex: 1
            }}>{item.productName}</Text>
        </View>
        <View
            style={{
            flex: 2,
            flexDirection: 'column'
        }}>

            <Text
                style={{
                color: 'white',
                fontSize: 25,
                flex: 2,
                justifyContent: 'flex-start'
            }}>X {item.quantity}
            </Text>
        </View>

    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white'
    },
    button: {
        backgroundColor: "lightblue",
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    }
});
