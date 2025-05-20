import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useContext } from 'react';
import { GamificationContext } from '../context/GamificationContext';

const LivesDisplay = () => {
  const { lives, timeToNextLife } = useContext(GamificationContext);

  return (
    <View style={styles.container}>
      <View style={styles.livesContainer}>
        {[...Array(5)].map((_, index) => (
          <Icon
            key={index}
            name="heart"
            size={22}
            color={index < lives ? '#FF3B30' : '#E0E0E0'}
            style={styles.heartIcon}
          />
        ))}
      </View>
      {lives < 5 && timeToNextLife && (
        <Text style={styles.rechargeText}>
          Próxima vida: {timeToNextLife}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    marginBottom: 15,
  },
  livesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  heartIcon: {
    marginHorizontal: 3,
  },
  rechargeText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
});

export default LivesDisplay;