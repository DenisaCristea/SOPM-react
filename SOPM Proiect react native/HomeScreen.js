// HomeScreen.js

import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
  title="To Do"
  onPress={() => navigation.navigate('ToDo', { activeTab: 'ToDo' })}
/>
<Button
  title="Important"
  onPress={() => navigation.navigate('ToDo', { activeTab: 'Important' })}
/>
<Button
  title="Closed"
  onPress={() => navigation.navigate('ToDo', { activeTab: 'Closed' })}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;