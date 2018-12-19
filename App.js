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
      search: '',
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
          onChangeText={(txt) => this.setState({search: txt})}
          value={this.state.search}
        />
        <Button
          style={styles.button}
          title="Button"
          onPress={ () => this.props.navigation.navigate('ListS',{keywords: this.state.search})}
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
      jobs: []
    }
  }

  componentDidMount() {
    this.getJobs();
  }

  getJobs = () => {
    axios
      .get(`https://jobs.github.com/positions.json?search=${this.state.keywords}`)
      .then(resp => {
        this.setState({jobs: resp.data});
      })
      .catch(err => {console.warn(err.message);})
  }

  render() {
    return (
      <View style={{flex: 1,alignItems: "center",justifyContent: "center" }}>
        <ScrollView contentContainerStyle={{paddingVertical: 20,width: 400}}>{this.state.jobs.map((job) =>
          <TouchableOpacity 
            style={styles.box} 
            key={job.id}
            onPress={ () => this.props.navigation.navigate('DetailS',{job: job})}
          >
            <Text style={{fontSize: 18,fontWeight: 'bold'}}>{job.title}</Text>
            <Text style={{fontSize: 16}}>{job.company}</Text>
            <Text style={{fontSize: 14,color:'gray'}}>{job.type}</Text>
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
    let temp = this.props.navigation.getParam('job', '');
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
    HomeS: Home,
    ListS: List,
    DetailS: Detail
  },
  {
    initialRouteName: "HomeS"
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textInput: {
    height:40,
    width:280,
    borderColor: 'transparent',
    backgroundColor: '#f1f4f3',
    borderWidth: 1,
    marginHorizontal:20,
    paddingHorizontal:10,
    marginBottom:30,
    textAlign:'center',
  },
  button: {
    height: 30,
    width: 100,
    backgroundColor: '#435650',
  },
  box: {
    height: 100,
    width: 350,
    alignSelf:'center',
    borderBottomWidth: 1,
    borderColor: 'black',
    paddingVertical: 20,
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