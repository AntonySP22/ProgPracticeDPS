import React from 'react';
import { TouchableOpacity, Text, ImageBackground, StyleSheet } from 'react-native';

const GradientButton = ({ image, onPress, text }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <ImageBackground source={image} style={styles.buttonBackground} resizeMode="cover">
        <Text style={styles.buttonText}>{text}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '80%',
    height: 50,
  },
  buttonBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black', // Color del texto
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GradientButton;