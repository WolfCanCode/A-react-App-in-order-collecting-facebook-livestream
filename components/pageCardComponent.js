import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    ImageBackground,
    ScrollView
} from 'react-native';
import Expo from 'expo';
import {RkText, RkTheme, RkCard} from 'react-native-ui-kitten';

export default class PageCardComponent extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {

    }

    render() {
        return (
            <RkCard onPress={select}>
                <View rkCardHeader>
                    <Text>{this.props._pageName}</Text>
                </View>
                <Image
                    rkCardImg
                    source={{
                    uri: 'https://graph.facebook.com/' + this.props._pageId + '/picture?width=100&height=100'
                }}/>
                <View rkCardFooter>
                    <Text>{this.props._pageCategory}</Text>
                </View>
            </RkCard>
        );
    }
}

function select()
{
    alert(this.props._pageId);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
