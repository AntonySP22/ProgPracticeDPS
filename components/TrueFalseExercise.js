import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { GamificationContext } from '../context/GamificationContext';

const TrueFalseExercise = ({ exercise, onComplete }) => {
  const { decreaseLife, addXp } = useContext(GamificationContext);
  const [answers, setAnswers] = useState(
    Object.fromEntries(exercise.statements.map(stmt => [stmt.id, null]))
  );
  
  const handleAnswerSelect = (statementId, value) => {
    setAnswers(prev => ({
      ...prev,
      [statementId]: value
    }));
  };
  
  const checkAnswers = () => {
    // Verificar que todas las preguntas estén respondidas
    const unanswered = Object.values(answers).some(answer => answer === null);
    if (unanswered) {
      Alert.alert('Respuestas incompletas', 'Por favor responde todas las preguntas.');
      return;
    }
    
    // Verificar si las respuestas son correctas
    const isCorrect = exercise.statements.every(
      statement => answers[statement.id] === statement.isCorrect
    );
    
    if (isCorrect) {
      // Si todas las respuestas son correctas
      Alert.alert('¡Correcto!', 'Has respondido correctamente a todas las preguntas.');
      addXp(exercise.points || 10);
      if (onComplete) onComplete(true);
    } else {
      // Si hay respuestas incorrectas
      decreaseLife();
      Alert.alert('Incorrecto', 'Hay respuestas incorrectas. Revisa tus respuestas e intenta de nuevo.');
    }
  };

  const renderStatement = (statement, index) => {
    return (
      <View key={statement.id} style={styles.statementContainer}>
        <Text style={styles.statementText}>
          {index + 1}. {statement.text}
        </Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              answers[statement.id] === true && styles.selectedOption
            ]}
            onPress={() => handleAnswerSelect(statement.id, true)}
          >
            <Text style={styles.optionText}>Verdadero</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              answers[statement.id] === false && styles.selectedOption
            ]}
            onPress={() => handleAnswerSelect(statement.id, false)}
          >
            <Text style={styles.optionText}>Falso</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{exercise.title}</Text>
      <Text style={styles.description}>{exercise.description}</Text>
      
      <View style={styles.statementsContainer}>
        {exercise.statements.map(renderStatement)}
      </View>
      
      <TouchableOpacity style={styles.submitButton} onPress={checkAnswers}>
        <Text style={styles.submitButtonText}>Comprobar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  statementsContainer: {
    marginBottom: 20,
  },
  statementContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  statementText: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#B297F1',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#B297F1',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TrueFalseExercise;