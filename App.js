import React from 'react';

import { 
  StyleSheet, 
  Text, 
  ScrollView,
  View, 
  Button, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';

import { 
  createAppContainer,
  createStackNavigator 
} from "react-navigation";

import axios from 'axios';

const regex = /<\/?[^>]+(>|$)/g;

class Home extends React.Component {

  static navigationOptions = {
    title: '',
  };

  constructor(props){
    super(props);
    this.state = {
      key: '',
    };
  }

  render() {
    return (

      <View style={{flex: 1,alignItems: "center",justifyContent: "center" }}>
        <Text style={{fontSize:18,textAlign:'right',marginBottom:30}}>
          Job Search
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder={'search'}
          onChangeText={(txt) => this.setState({key: txt})}
          value={this.state.key}
        />
        <Button
          style={styles.button}
          title="Button"
          onPress={ () => this.props.navigation.navigate('ListS',{keywords: this.state.key})}
        />
      </View>
    );
  }
}

class List extends React.Component {
  static navigationOptions = {
    title: 'List of Jobs',
  };

  constructor(props){
    super(props);
    this.state = {
      keywords: this.props.navigation.getParam('keywords', ''),
      array: []
    }
  }

  componentDidMount() {
    this.getJobs();
  }

  getJobs = () => {
    axios
      .get(`https://jobs.github.com/positions.json?search=${this.state.keywords}`)
      .then(resp => {
        this.setState({array: resp.data});
      })
  }

  render() {
    return (
      <View style={{flex: 1,alignItems: "center",justifyContent: "center" }}>
        <ScrollView contentContainerStyle={{paddingVertical: 20,width: 400}}>{this.state.array.map((data) =>
          <TouchableOpacity 
            style={styles.box} 
            key={data.id}
            onPress={ () => this.props.navigation.navigate('DetailS',{data: data})}
          >
            <Text style={{fontSize: 18,fontWeight: 'bold'}}>{data.title}</Text>
            <Text style={{fontSize: 16}}>{data.company}</Text>
            <Text style={{fontSize: 14,color:'gray'}}>{data.type}</Text>
          </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }
}

class Detail extends React.Component {

  static navigationOptions = {
    title: 'Job Detail',
  };

  constructor(props){
    super(props);
    let temp = this.props.navigation.getParam('data', '');
    let desc = temp.description.replace(regex, '');
    this.state = {
      job: temp,
      description: desc,
    }
  }

  render() {
    return (
      <View style={{flex: 1,alignItems: "center",justifyContent: "center",width:400}}>
        <ScrollView contentContainerStyle={{paddingVertical: 20,width: 380}}>
          <Text style={{fontSize: 20,fontWeight: 'bold',marginBottom:15}}>
            {this.state.job.title}
          </Text>
          <Text style={{fontSize: 18,fontWeight: 'bold',marginBottom:15}}>
            {this.state.job.company}
          </Text>
          <Text style={{fontSize: 16,fontWeight: 'bold',marginBottom:15}}>
            {this.state.job.type}
          </Text>
          <Text style={{fontSize: 15,marginBottom:15}}>
            {this.state.description}
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    HomeS: Home,ListS: List,DetailS: Detail
  },
  {
    initialRouteName: "HomeS"
  }
);

const styles = StyleSheet.create({
  textInput: {
    height:40,
    width:280,
    borderColor: 'transparent',
    backgroundColor: '#f1f4f3',
    textAlign:'center',
    marginHorizontal:20,
    paddingHorizontal:10,
    marginBottom:30,
  },
  button: {
    height: 30,
    width: 100,
    backgroundColor: '#435650',
  },
  box: {
    height: 100,
    width: 350,
    borderBottomWidth: 1,
    alignSelf:'center',
    paddingVertical: 20,
    borderColor: 'black',
  },
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return (
      <AppContainer/>
    );
  }
}