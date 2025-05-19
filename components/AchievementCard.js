import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AchievementCard = ({ achievement, earnedAt }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="trophy" size={24} color="#FFD700" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={styles.description}>{achievement.description}</Text>
        {earnedAt && (
          <Text style={styles.pointsText}>+{achievement.points} puntos</Text>
        )}
      </View>
      {earnedAt ? (
        <Icon name="checkmark-circle" size={24} color="#4CD964" style={styles.earnedIcon} />
      ) : (
        <Icon name="lock-closed" size={24} color="#999" style={styles.earnedIcon} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF9E6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  pointsText: {
    fontSize: 12,
    color: '#4CD964',
    marginTop: 4,
    fontWeight: 'bold',
  },
  earnedIcon: {
    marginLeft: 10,
  },
});

export default AchievementCard;