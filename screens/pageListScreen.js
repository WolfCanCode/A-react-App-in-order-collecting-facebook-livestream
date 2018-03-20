import React, {Component} from 'react';
import {
    Alert,
    Text,
    View,
    StyleSheet,
    Image,
    ScrollView
} from 'react-native';
import Expo from 'expo';
import {RkText, RkTheme, RkCard, RkChoice, RkButton} from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';

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
        // subscibe page for using facebook app
        fetch('https://graph.facebook.com/' + page.id + '/subscribed_apps', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({access_token: page.access_token})
        }).then((res1) => res1.json()).then((res2) => {
            Actions.mainPage({page:page});
        });

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
            uri: 'https://graph.facebook.com/' + page.id + '/picture?type=large'
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
                uri: 'https://graph.facebook.com/' + page.id + '/picture?type=large'
            }}/>
        <View rkCardFooter>
            <Text style={{
                fontWeight: 'bold'
            }}>{page.category}</Text>
        </View>
    </RkCard>
}
}

RkTheme
.setType('RkText', 'hero', {
fontSize: 35,
marginTop: 50
});

RkTheme
.setType('RkText', 'normal', {
fontSize: 20,
marginTop: 30
});

const styles = StyleSheet
.create({
container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121'
},
paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e'
}
});
