import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Alert
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GamificationContext } from '../context/GamificationContext';
import Icon from 'react-native-vector-icons/Ionicons';

const CodeBlocksOrderExercise = ({ exercise, onComplete }) => {
  const { decreaseLife, addXp } = useContext(GamificationContext);
  const [blocks, setBlocks] = useState([]);
  
  useEffect(() => {
    // Randomizar el orden inicial de los bloques
    if (exercise && exercise.codeBlocks) {
      const shuffledBlocks = [...exercise.codeBlocks].sort(() => Math.random() - 0.5);
      setBlocks(shuffledBlocks.map((block, index) => ({
        key: `item-${index}`,
        text: block.text,
        correctIndex: block.order
      })));
    }
  }, [exercise]);

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <TouchableOpacity
        style={[styles.blockItem, isActive && styles.activeBlockItem]}
        onLongPress={drag}
      >
        <Icon name="menu" size={20} color="#888" style={styles.dragHandle} />
        <Text style={styles.blockText}>{item.text}</Text>
      </TouchableOpacity>
    );
  };

  const handleCheckAnswer = () => {
    // Verificar si el orden es correcto comparando con el índice correcto de cada bloque
    const isCorrect = blocks.every((block, index) => block.correctIndex === index);
    
    if (isCorrect) {
      // Si está correcto
      Alert.alert(
        '¡Correcto!',
        'Has ordenado los bloques en la secuencia correcta.',
        [{ text: 'Continuar', onPress: () => {
          addXp(exercise.points || 10);
          if (onComplete) onComplete(true);
        }}]
      );
    } else {
      // Si está incorrecto
      decreaseLife();
      Alert.alert(
        'Incorrecto',
        'El orden de los bloques no es correcto. Intenta nuevamente.',
        [{ text: 'Entendido' }]
      );
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>{exercise.title}</Text>
      <Text style={styles.description}>{exercise.description}</Text>
      
      <View style={styles.instructionContainer}>
        <Icon name="information-circle" size={20} color="#3A86FF" />
        <Text style={styles.instructionText}>
          Arrastra los bloques para ordenarlos correctamente
        </Text>
      </View>
      
      <View style={styles.listContainer}>
        <DraggableFlatList
          data={blocks}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          onDragEnd={({ data }) => setBlocks(data)}
          containerStyle={styles.dragContainer}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleCheckAnswer}
      >
        <Text style={styles.submitButtonText}>Comprobar</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
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
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F1FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  instructionText: {
    marginLeft: 8,
    color: '#3A86FF',
    fontSize: 14,
  },
  listContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 8,
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
  },
  dragContainer: {
    minHeight: 200,
  },
  blockItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#B297F1',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  activeBlockItem: {
    backgroundColor: '#F0EBFF',
    elevation: 5,
    shadowOpacity: 0.3,
  },
  blockText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#444',
    flex: 1,
  },
  dragHandle: {
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#B297F1',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CodeBlocksOrderExercise;