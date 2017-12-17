import React from 'react';
import { StyleSheet, Text, View, ListView, Button, TouchableHighlight, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
//import Markdown from 'react-native-easy-markdown';
import base64 from 'base-64';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const HomeScreen = class App extends React.Component {
  constructor(props){
    super(props);
    fetch("https://api.github.com/search/repositories?q=stars%3A>0&sort=stars&per_page=30")
      .then((response) => response.json())
      .then((json) => {
        this.setState({dataSource: ds.cloneWithRows(json.items)})
    });
    this.state = {
      dataSource: ds.cloneWithRows(['']),
    };
  }

  renderRow = (data) => {
    if((typeof data) == 'string'){
      return (
        <View>
          <TouchableHighlight>
            <View style={{borderBottomWidth:1,borderColor:"#f3f3f3",paddingLeft:10,paddingRight:10,paddingTop:20,paddingBottom:20}}>
              <Text>...</Text>
            </View>
          </TouchableHighlight>
        </View>
      )
    }
    return (
      <View>
        <TouchableHighlight onPress={()=>this.props.navigation.navigate('Details', data)}>
          <View style={{borderBottomWidth:1,borderColor:"#f3f3f3",paddingLeft:10,paddingRight:10,paddingTop:20,paddingBottom:20}}>
            <Text>{data.name}</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  render(){
    return (
      <View style={styles.container}>
        <ListView dataSource={this.state.dataSource} renderRow={this.renderRow}>a</ListView>
      </View>
    );
  }
};

const DetailsScreen = class DetailsScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      subscribers_count: "...",
      mk: '',
    };
    fetch(this.props.navigation.state.params.url)
    .then((response) => response.json())
    .then((json) => {
      this.setState({subscribers_count: json.subscribers_count});
    });
    /*
    fetch(this.props.navigation.state.params.url+"/readme")
    .then((response) => response.json())
    .then((json) => {
      //console.log(this.props.navigation.state.params.url+'/readme');
      //console.log(json.encoding);
      //console.log(json.content);
      //console.log(typeof json);
      if(json.encoding!="base64"){return;}
      //console.log(base64.decode(json.content)+'');
      //this.setState({mk: base64.decode(json.content)});
      this.state.mk=base64.decode(json.content);

      this.forceUpdate();
    });*/
  }
  render(){
    const params = this.props.navigation.state.params;
    return (
      <View style={{paddingTop:10,paddingLeft:10,paddingRight:10,paddingBottom:10}}>
        <ScrollView horizontal={true}>
          <Text style={{fontSize:30}}><Text style={{color:"#0645ad"}}>{params.owner.login}</Text> / <Text style={{color:"#0645ad"}}>{params.name}</Text></Text>
        </ScrollView>
        <View style={{borderBottomWidth:1,borderColor:"#000",opacity:0.1,marginBottom:10,marginTop:10}}></View>
        <View style={{flexDirection:'row'}}>
          <View style={{justifyContent:'center',alignItems:'center',width:30}}>
            <Icon name="star" color="#333" size={30}/>
          </View>
          <Text style={{paddingLeft:10,fontSize:30}}>{params.stargazers_count}</Text>
        </View>
        <View style={{borderBottomWidth:1,borderColor:"#000",opacity:0.1,marginBottom:10,marginTop:10}}></View>
        <View style={{flexDirection:'row'}}>
          <View style={{justifyContent:'center',alignItems:'center',width:30}}>
            <Icon name="eye" color="#333" size={30}/>
          </View>
          <Text style={{paddingLeft:10,fontSize:30}}>{this.state.subscribers_count}</Text>
        </View>
        <View style={{borderBottomWidth:1,borderColor:"#000",opacity:0.1,marginBottom:10,marginTop:10}}></View>
        <View style={{flexDirection:'row'}}>
          <View style={{justifyContent:'center',alignItems:'center',width:30}}>
            <Icon name="code-fork" color="#333" size={30}/>
          </View>
          <Text style={{paddingLeft:10,fontSize:30}}>{params.forks_count}</Text>
        </View>
        <View style={{borderBottomWidth:1,borderColor:"#000",opacity:0.1,marginBottom:10,marginTop:10}}></View>
      </View>
    );
  }
}

const RootNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      //title: "Home",
      headerTitle: (<View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',paddingLeft:7}}>
        <Icon name="github" size={50}/><Text style={{paddingLeft:20,fontWeight:'bold',fontSize:20}}>Home</Text>
      </View>),
    },
  },
  Details: {
    screen: DetailsScreen,
    navigationOptions: {
      title: "Details",
      /*headerTitle: (<View style={{backgroundColor: '#ccc',flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',paddingLeft:7}}>
        <Icon name="github" size={50}/><Text style={{paddingLeft:20,fontWeight:'bold',fontSize:20}}>Home</Text>
      </View>),*/
    },
  },
}, {
  initialRouteName: 'Home',
  headerMode: 'screen',
});

export default RootNavigator;

const styles = StyleSheet.create({
  container: {
    //paddingTop: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
});
