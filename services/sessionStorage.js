// Almacenamiento simple en memoria para la sesión actual
const sessionStorage = {
  _data: {},
  
  setItem(key, value) {
    console.log(`Guardando datos en sessionStorage: ${key}`);
    this._data[key] = value;
    return Promise.resolve();
  },
  
  getItem(key) {
    console.log(`Recuperando datos de sessionStorage: ${key}`);
    return Promise.resolve(this._data[key] || null);
  },
  
  removeItem(key) {
    console.log(`Eliminando datos de sessionStorage: ${key}`);
    delete this._data[key];
    return Promise.resolve();
  },
  
  clear() {
    console.log('Limpiando sessionStorage');
    this._data = {};
    return Promise.resolve();
  }
};

export default sessionStorage;