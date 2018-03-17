import React, {Component} from 'react';
import {
    Alert,
    Button,
    Text,
    View,
    StyleSheet,
    Image,
    ImageBackground,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import Expo from 'expo';
import {RkText, RkTheme, RkCard, RkChoice, RkButton} from 'react-native-ui-kitten';
import imgBtn from '../assets/images/facebook_btn.png';
import wallScreen from '../assets/images/wallscreen.png';

export default class PageListScreen extends Component {
    constructor(props) {
        super(props);
        this.elements = null;
        this.state = {
            elements: []
        };
        this.pageListItem = null;

    }

    componentDidMount() {
        fetch('https://graph.facebook.com/me/accounts?access_token=' + this.props.token).then((response) => response.json()).then((pageList) => {
            this.pageListItem = pageList.data;
            this.elements = this
                .pageListItem
                .map((page, index) => {
                    return <RkChoice
                        style={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                        paddingBottom: 15,
                        alignItems: 'stretch'
                    }}
                        key={index}
                        renderContentFunction={(args) => _renderCustomContent(args, page)}/>
                });
            this.setState({elements: this.elements});
        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <RkText rkType='primary hero'>Chào {this.props._userName}</RkText>
                <RkText rkType='primary normal'>Hãy chọn page mà bạn muốn quản lý:</RkText>
                <ScrollView style={{
                    marginTop: 20
                }}>
                    {/* {this.state.elements} */}

                    {this.state.elements}

                </ScrollView>
            </View>
        );
    }
}

function _renderCustomContent(args, page) {
    if (args.isSelected) {
        alert(page.name);
        return <RkCard style={{
            width: 300,
            height: 300
        }}>
            <View rkCardHeader>
                <Text>{page.name}</Text>
            </View>
            <Image
                rkCardImg
                source={{
                uri: 'https://graph.facebook.com/' + page.id + '/picture?width=100&height=100'
            }}/>
            <View rkCardFooter>
                <Text>{page.category}</Text>
            </View>
        </RkCard>
    } else {
        return <RkCard style={{
            width: 300,
            height: 300
        }}>
            <View rkCardHeader>
                <Text style={{
                    fontWeight: 'bold'
                }}>{page.name}</Text>
            </View>
            <Image
                rkCardImg
                source={{
                uri: 'https://graph.facebook.com/' + page.id + '/picture?width=100&height=100'
            }}/>
            <View rkCardFooter>
                <Text style={{
                    fontWeight: 'bold'
                }}>{page.category}</Text>
            </View>
        </RkCard>
    }
}

RkTheme.setType('RkText', 'hero', {
    fontSize: 35,
    marginTop: 50
});

RkTheme.setType('RkText', 'normal', {
    fontSize: 20,
    marginTop: 30
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e'
    }
});
