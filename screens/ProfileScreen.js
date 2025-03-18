import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Modal } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('El Salvador');
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const navigateTo = (screen) => {
    setIsMenuVisible(false);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#FFFFFF" style={styles.searchIcon}/>
          <TextInput
            placeholder="Buscar..."
            placeholderTextColor="#FFFFFF"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Icon name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isMenuVisible}
        animationType="slide"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('CoursesScreen')}>
              <Text style={styles.menuItemText}>Cursos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Home')}>
              <Text style={styles.menuItemText}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('ProfileScreen')}>
              <Text style={styles.menuItemText}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('HelpScreen')}>
              <Text style={styles.menuItemText}>Ayuda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>INFORMACIÓN PERSONAL</Text>

        <View style={styles.profileContainer}>
          <Image source={require('../assets/usuario.png')} style={styles.profileImage} />
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.changeText}>Cambiar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nombre de usuario</Text>
          <TextInput 
            style={styles.input}
            placeholder="Tu nombre"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Dirección de correo electrónico</Text>
          <TextInput 
            style={styles.input}
            placeholder="correo@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Biografía</Text>
          <TextInput 
            style={[styles.input, styles.bioInput]}
            placeholder="Descríbete..."
            value={bio}
            onChangeText={setBio}
            multiline
          />

          <Text style={styles.label}>País</Text>
          <TextInput 
            style={styles.input}
            value={country}
            editable={false} 
          />

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.navBar}>
      <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home" size={28} color="#B297F1" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Icon name="person" size={28} color="#B297F1" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 120,
    width: '100%',
    backgroundColor: '#B297F1',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    flex: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  menuButton: {
    marginLeft: 10,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: '50%',
    backgroundColor: '#FFFFFF',
    marginTop: 50,
    marginRight: 10,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemText: {
    fontSize: 16,
    color: '#052659',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#052659',
    marginTop: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  changeButton: {
    backgroundColor: '#B297F1',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  changeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#052659',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    marginBottom: 15,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#B297F1',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navBar: {
    height: 70,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    alignItems: 'center',
    padding: 8,
  },
  navText: {
    fontSize: 12,
    color: '#B297F1',
    marginTop: 4,
  },
});

export default ProfileScreen;