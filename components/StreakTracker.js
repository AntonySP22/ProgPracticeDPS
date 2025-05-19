import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useContext } from 'react';
import { GamificationContext } from '../context/GamificationContext';

const StreakTracker = () => {
  const { streak } = useContext(GamificationContext);

  return (
    <View style={styles.container}>
      <Icon name="flame" size={24} color="#FF9500" />
      <Text style={styles.streakText}>{streak} {streak === 1 ? 'día' : 'días'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  streakText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9500',
  },
});

export default StreakTracker;