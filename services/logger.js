const logger = {
  debug: (...args) => {
    if (__DEV__) {
      console.debug('[DEBUG]', ...args);
    }
  },
  info: (...args) => {
    if (__DEV__) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args) => {
    if (__DEV__) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (error, userMessage = null) => {
    if (__DEV__) {
      console.error('[ERROR]', error.code, error.message, error);
    }
    return userMessage || 'Ha ocurrido un error inesperado';
  },
  // Para registrar errores de autenticación específicamente
  authError: (error) => {
    
    if (__DEV__) {
      console.error('[AUTH ERROR]', error.code, error.message);
    }
    
    // Mapea códigos de error a mensajes amigables para el usuario
    const errorMessages = {
      'auth/user-not-found': {
        title: 'Usuario no encontrado',
        message: 'No existe una cuenta con este correo.',
        action: 'signUp'
      },
      'auth/wrong-password': {
        title: 'Contraseña incorrecta',
        message: 'La contraseña ingresada no es correcta. Por favor, verifica e intenta nuevamente.'
      },
      'auth/invalid-email': {
        title: 'Formato de correo inválido',
        message: 'Por favor ingresa una dirección de correo válida (ejemplo@dominio.com).'
      },
      'auth/user-disabled': {
        title: 'Cuenta deshabilitada',
        message: 'Esta cuenta ha sido deshabilitada. Por favor, contacta al soporte.'
      },
      'auth/network-request-failed': {
        title: 'Error de conexión',
        message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
      },
      'auth/invalid-credential': {
        title: 'Credenciales incorrectas',
        message: 'El correo electrónico o la contraseña son incorrectos. Por favor, verifica tus datos.'
      },
      'auth/too-many-requests': {
        title: 'Demasiados intentos',
        message: 'Has realizado demasiados intentos fallidos. Por favor, intenta más tarde.'
      }
    };
    
    // Retorna el mensaje apropiado o uno genérico
    return errorMessages[error.code] || {
      title: 'Error de inicio de sesión',
      message: 'No se pudo iniciar sesión. Por favor, verifica tus credenciales e intenta nuevamente.'
    };
  }
};

export default logger;