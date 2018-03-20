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
    Card,
    SearchBar
} from 'react-native-elements'
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';

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

export default class ClientScreen extends Component {
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
            delOkModal: false,
            upOkModal: false,
            searchText: ''
        };

    }

    async componentDidMount()
    {
        await this.getData();
    }

    async getData(search) {
        if(!search) search ='';
        await fetch('http://52.41.8.125/product?where={"code":{"contains":"'+search+'"}}').then((res1) => res1.json()).then((res2) => {
            let list = res2;
            this.rowData = list.map((item, index) => {
                return {
                    id: index,
                    rowView: getRowView(item),
                    leftSubView: this.editButton(item), //optional
                    rightSubView: this.deleteButton(item.id), //optional
                    style: styles.row //optional but recommended to style your rows
                };
            });
            this.setState({rowData: this.rowData});
            this.setState({isVisible: false});
        });
    }

    _pickImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 4]
        });

        if (!result.cancelled) {
            this.setState({imgProduct: result});
        }
    };

    _cancelModal = () => {
        if (!this.state.modalVisible == false) 
            this.setState({imgProduct: prodImg, codeProduct: '', nameProduct: '', priceProduct: 0, modalVisible: false});
        };

    _addProduct = async() => {
        if (!this.state.imgProduct.uri) 
            this.state.imgProduct.uri = null;
        this.setState({isVisible: true});
        let productParam = {
            name: this.state.nameProduct,
            code: this.state.codeProduct,
            price: this.state.priceProduct
        };
        fetch('http://52.41.8.125/product/create', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productParam)
        }).then((res1) => res1.json()).then((res2) => {
            const imgProduct = new FormData();
            imgProduct.append('photo', {
                uri: this.state.imgProduct.uri,
                type: 'image/jpeg', // or photo.type
                name: this.state.codeProduct + '.jpg'
            });

            fetch('http://52.41.8.125/product/img/' + res2.id, {
                method: 'POST',
                body: imgProduct
            }).then((res1) => res1.json()).then((res2) => {
                this.setState({isVisible: false});
                this.setState({okModal: true});
                this.getData();
                this._cancelModal();
            });
        });
    }

    _updateProduct = async() => {
        if (!this.state.imgProduct.uri) 
            this.state.imgProduct.uri = null;
        this.setState({isVisible: true});
        let productParam = {
            name: this.state.nameProduct,
            code: this.state.codeProduct,
            price: this.state.priceProduct
        };
        fetch('http://52.41.8.125/product/'+this.state.idProductUpdate, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productParam)
        }).then((res1) => res1.json()).then((res2) => {
            // const imgProduct = new FormData();
            // imgProduct.append('photo', {
            //     uri: this.state.imgProduct.uri,
            //     type: 'image/jpeg', // or photo.type
            //     name: this.state.codeProduct + '.jpg'
            // });
            this.setState({isVisible: false});
            this.setState({upOkModal: true});
            this.getData();
            this._cancelModal();
            // fetch('http://52.41.8.125/product/img/' + res2.id, {
            //     method: 'POST',
            //     body: imgProduct
            // }).then((res1) => res1.json()).then((res2) => {
                
            // });
        });

    }

    _deleteProduct = async(id) => {
        fetch('http://52.41.8.125/product/'+id, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res1) => res1.json()).then((res2) => {

            this.setState({delOkModal: true});
            this.getData();
        });

    }

    editButton(item) {
        return (<ListItemButton
            text="Sửa sản phẩm"
            color="YELLOW"
            onPress={() => {
            this.setState({
                modalVisible: true,
                isAdd: false,
                imgProduct: {uri:item.prodImg},
                codeProduct: item.code,
                nameProduct: item.name,
                priceProduct: item.price,
                idProductUpdate: item.id
            });
        }}/>);
    }

    deleteButton(id) {
        return (<ListItemButton text="Xóa sản phẩm" color="RED" onPress={() => this._deleteProduct(id)}/>);
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
                    backgroundColor="rgb(92,107,192)"
                    statusBarProps={{
                    barStyle: 'light-content'
                }}
                    leftComponent={< Icon type = 'entypo' name = 'chevron-thin-left' color = '#ffffff' onPress = {
                    function () {
                        Actions.pop();
                    }
                } />}
                    centerComponent={{
                    text: 'CLIENT',
                    style: {
                        color: '#fff',
                        fontSize: 25
                    }
                }}
                    rightComponent={{}}/>

                <SearchBar
                    round
                    onChangeText={(event) => {
                        this.getData(event);
                }}
                    onClear={() => {
                    alert('hihi')
                }}
                    placeholder='Type Here...'/>

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
                        borderBottomWidth: 1,
                        alignSelf: 'stretch'
                    }}/>
                </ScrollView>

                <ActionButton
                    buttonColor="#ef5350"
                    onPress={() => {
                    this.setState({modalVisible: true, isAdd: true})
                }}></ActionButton>
                <OrientationLoadingOverlay
                    visible={this.state.isVisible}
                    color="white"
                    indicatorSize="large"
                    messageFontSize={24}
                    message="Loading... 😀😀😀"></OrientationLoadingOverlay>

                <Modal
                    isVisible={this.state.modalVisible}
                    backdropColor={"#000"}
                    backdropOpacity={0.7}
                    animationIn="zoomInDown"
                    animationOut="fadeOut"
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={100}
                    backdropTransitionOutTiming={100}>

                    <Avatar
                        xlarge
                        rounded
                        source={this.state.imgProduct}
                        onPress={() => this._pickImage()}
                        activeOpacity={1}
                        containerStyle={{
                        alignItems: 'center',
                        backgroundColor: 'gray',
                        alignSelf: 'center'
                    }}/>
                    <Text
                        style={{
                        textAlign: 'center',
                        color: 'white',
                        marginBottom: 15
                    }}>Thêm ảnh sản phẩm</Text>
                    <Kaede
                        label={'Mã sản phẩm'}
                        value={this.state.codeProduct}
                        onChangeText={(text) => {
                        this.setState({codeProduct: text})
                    }}/>
                    <Kaede
                        label={'Tên sản phẩm'}
                        value={this.state.nameProduct}
                        labelStyle={{
                        backgroundColor: 'rgb(229,115,115)',
                        color: 'white'
                    }}
                        onChangeText={(text) => {
                        this.setState({nameProduct: text})
                    }}/>
                    <Kaede
                        label={'Giá tiền'}
                        value={this.state.priceProduct+''}
                        onChangeText={(text) => {
                        this.setState({priceProduct: text})
                    }}/>
                    <View
                        style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'stretch',
                        justifyContent: 'center',
                        paddingTop: 10
                    }}>
                        {this.state.isAdd
                            ? <Button
                                    title='Thêm'
                                    rounded
                                    large
                                    onPress={() => this._addProduct()}
                                    titleStyle={{
                                    fontSize: 50,
                                    fontWeight: "700"
                                }}
                                    buttonStyle={{
                                    width: 140,
                                    height: 60,
                                    backgroundColor: 'rgb(102,187,106)'
                                }}/>
                            : <Button
                                title='Cập nhập'
                                rounded
                                large
                                onPress={() => this._updateProduct()}
                                titleStyle={{
                                fontSize: 50,
                                fontWeight: "700"
                            }}
                                buttonStyle={{
                                width: 140,
                                height: 60,
                                backgroundColor: 'rgb(255,152,0)'
                            }}/>}
                        <Button
                            title='Hủy'
                            rounded
                            large
                            onPress={() => this._cancelModal()}
                            titleStyle={{
                            fontSize: 50,
                            fontWeight: "700"
                        }}
                            buttonStyle={{
                            width: 140,
                            height: 60
                        }}/>
                    </View>

                </Modal>

                <Modal isVisible={this.state.okModal} style={styles.bottomModal}>
                    <View style={styles.modalContent}>
                        <Text>Thêm mới thành công</Text>
                        <TouchableOpacity
                            onPress={() => {
                            this.setState({okModal: false})
                        }}>
                            <View style={styles.button}>
                                <Text>OK</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </Modal>
                <Modal isVisible={this.state.upOkModal} style={styles.bottomModal}>
                    <View style={styles.modalContent}>
                        <Text>Cập nhập thành công</Text>
                        <TouchableOpacity
                            onPress={() => {
                            this.setState({upOkModal: false})
                        }}>
                            <View style={styles.button}>
                                <Text>OK</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </Modal>
                <Modal isVisible={this.state.delOkModal} style={styles.bottomModal}>
                    <View style={styles.modalContent}>
                        <Text>Xóa thành công</Text>
                        <TouchableOpacity
                            onPress={() => {
                            this.setState({delOkModal: false})
                        }}>
                            <View style={styles.button}>
                                <Text>OK</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </Modal>
            </View>
        );
    }
}

function getRowView(item) {
    return <View
        style={{
        flexDirection: 'row',
        flex: 1,
        marginTop: 15,
        marginBottom: 15
    }}>
        <Avatar
            medium
            rounded
            source={{
            uri: item.prodImg
        }}
            activeOpacity={0.7}
            style={{
            flex: 3
        }}/>
        <Text
            style={{
            color: 'white',
            fontSize: 20,
            flex: 5,
            marginLeft: 20
        }}>{item.code}
            - {item.name}</Text>
        <Badge
            value={'giá: ' + item.price}
            textStyle={{
            color: 'yellow',
            fontSize: 20
        }}
            style={{
            flex: 5,
            alignItems: 'center'
        }}/>
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
