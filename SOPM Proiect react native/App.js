import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ToDoScreen from './ToDoScreen'; // Asigură-te că calea către fișier este corectă

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.taskListContainer}>
        <Text style={styles.headerText}>Task List</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ToDo', { activeTab: 'ToDo' })}>
          <View style={styles.taskRow}>
            <Text style={styles.taskText}>TO DO →</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ToDo', { activeTab: 'Important' })}>
          <View style={styles.taskRow}>
            <Text style={styles.taskText}>Important →</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ToDo', { activeTab: 'Closed' })}>
          <View style={styles.taskRow}>
            <Text style={styles.taskText}>Closed →</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ToDo" component={ToDoScreen} />
        {/* Nu mai este nevoie să adaugi ecrane separate pentru 'Important' sau 'Closed' */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Stilurile rămân la fel ca în exemplul anterior
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#add8e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskListContainer: {
    width: '80%',
    backgroundColor: '#8470ff',
    padding: 20,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  taskRow: {
    marginBottom: 10,
  },
  taskText: {
    fontSize: 18,
    color: '#ffffff',
  },
});

export default App;

