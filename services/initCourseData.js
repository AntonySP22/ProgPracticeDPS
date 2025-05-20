// services/initCourseData.js
import { db, firebaseTimestamp } from './firebase';

export const initializeCoursesData = async () => {
  try {
    // Verificar si ya hay datos inicializados
    const coursesSnapshot = await db.collection('courses').get();
    const achievementsSnapshot = await db.collection('achievements').get();
    
    if (!coursesSnapshot.empty && !achievementsSnapshot.empty) {
      // Si ya existen cursos, verificar si necesitan fecha de creación
      await updateMissingCreationDates();
      return;
    }
    
    // Inicializar logros
    await initializeAchievements();
    
    // Inicializar cursos (código existente)
    console.log('Inicializando datos de cursos en Firestore...');
    
    // Curso de Python
    await db.collection('courses').doc('python').set({
      title: "Python",
      description: "Aprende a crear programas con Python desde cero",
      icon: "python.png",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/5968/5968350.png",
      level: "Principiante",
      duration: "8 horas",
      order: 1,
      creationDate: firebaseTimestamp(), // Agrega la fecha actual como timestamp
      lessons: [
        {
          id: "intro",
          title: "Hola mundo en Python",
          content: "Python es un lenguaje de programación potente y fácil de aprender. Tiene estructuras de datos de alto nivel eficientes y un simple pero efectivo sistema de programación orientado a objetos.",
          codeExample: "print(\"Hola Mundo\")",
          order: 1
        },
        {
          id: "variables",
          title: "Crear variables",
          content: "Las variables en Python se pueden crear asignando un valor a un nombre sin necesidad de declararla antes.",
          codeExample: "x = 10\ny = \"Nombre\"\nz = 3.9",
          order: 2
        },
        {
          id: "sum",
          title: "Sumando variables en Python",
          content: "Vamos a sumar dos variables e imprimir su valor. Lo primero vamos a declararlas, con nombres a y b. Declarar una variable significa \"crearla\".",
          codeExample: "a = 3\nb = 7\nprint(a + b)",
          order: 3
        },
        {
          id: "data_types",
          title: "Tipos de datos en Python",
          content: "Python tiene varios tipos de datos integrados que son fundamentales para la programación: enteros (int), flotantes (float), cadenas de texto (str), booleanos (bool), listas (list), tuplas (tuple), conjuntos (set) y diccionarios (dict).",
          codeExample: "# Tipos de datos básicos\nentero = 42          # int\nflotante = 3.14159    # float\ntexto = \"Hola\"       # str\nbooleano = True      # bool\n\n# Tipos de datos compuestos\nlista = [1, 2, 3]     # list\ntupla = (1, 2, 3)     # tuple\nconjunto = {1, 2, 3}  # set\ndiccionario = {'a': 1, 'b': 2}  # dict",
          order: 4
        },
      ],
      exercises: [
        {
          id: "ex1",
          lessonId: "intro",
          title: "Hola Mundo",
          description: "Escribe un programa que imprima 'Hola Mundo' en la consola.",
          correctAnswer: "print('Hola Mundo')",
          multiline: false,
          order: 1,
          points: 10
        },
        {
          id: "ex3",
          lessonId: "data_types",
          title: "Tipos de datos",
          description: "Indica si los siguientes enunciados son verdaderos o falsos",
          exerciseType: "true_false",
          statements: [
            {
              id: "stmt1",
              text: "En Python, el tipo de dato 'int' se utiliza para representar números enteros.",
              isCorrect: true
            },
            {
              id: "stmt2",
              text: "La expresión 3.0 == 3 devuelve False en Python.",
              isCorrect: false
            },
            {
              id: "stmt3",
              text: "Las listas en Python son inmutables.",
              isCorrect: false
            },
            {
              id: "stmt4",
              text: "El tipo de dato 'dict' permite almacenar pares clave-valor.",
              isCorrect: true
            },
            {
              id: "stmt5",
              text: "El operador '+' puede usarse tanto para sumar números como para concatenar cadenas.",
              isCorrect: true
            }
          ],
          order: 2,
          points: 20
        },
        {
          id: "ex2",
          lessonId: "sum",
          title: "Suma de Variables",
          description: "Se han declarado las siguientes variables: a = 10, b = 3, imprime la suma de alla dos haciendo uso de las variables",
          correctAnswer: "print(a + b)",
          multiline: false,
          order: 3,
          points: 15
        },
         {
          id: "ex4",
          lessonId: "data_types",
          title: "Ordenar el código",
          description: "Organiza los bloques de código para crear un programa que defina una lista de números, los ordene y muestre el resultado.",
          exerciseType: "order_blocks",
          codeBlocks: [
            {
              text: "numeros = [5, 2, 8, 1, 10]",
              order: 0
            },
            {
              text: "numeros.sort()",
              order: 1
            },
            {
              text: "print('Lista ordenada:')",
              order: 2
            },
            {
              text: "for numero in numeros:",
              order: 3
            },
            {
              text: "    print(numero)",
              order: 4
            }
          ],
          order: 4,
          points: 25
        } 
      ]
    });
    
    // Curso de Java
    await db.collection('courses').doc('java').set({
      title: "Java",
      description: "Domina la programación orientada a objetos con Java",
      icon: "java.png",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/5968/5968282.png",
      level: "Intermedio",
      duration: "10 horas",
      order: 2,
      creationDate: firebaseTimestamp(), // Agregamos fecha de creación
      lessons: [
        {
          id: "intro",
          title: "Hola mundo en Java",
          content: "Java es un lenguaje de programación orientado a objetos que es ampliamente utilizado para desarrollar aplicaciones empresariales y móviles.",
          codeExample: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hola Mundo\");\n  }\n}",
          order: 1
        },
        {
          id: "variables",
          title: "Crear variables",
          content: "Las variables en Java deben ser declaradas con un tipo específico antes de su uso.",
          codeExample: "int numero = 3;\nString cadena = \"Hola Mundo\";\ndouble decimal = 4.5;\nboolean verdad = true;",
          order: 2
        },
        {
          id: "sum",
          title: "Sumando variables en Java",
          content: "Vamos a sumar dos variables e imprimir su valor. Lo primero vamos a declararlas, con nombres a y b.",
          codeExample: "int a = 3;\nint b = 7;\nSystem.out.println(a + b);",
          order: 3
        }
      ],
      exercises: [
        {
          id: "ex1",
          lessonId: "intro",
          title: "Declaración del método main",
          description: "¿Es correcta la declaración del método main?",
          codeTemplate: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hola Mundo\");\n  }\n}",
          correctAnswer: "Verdadero",
          multiline: false,
          order: 1,
          points: 10
        },
        {
          id: "ex2",
          lessonId: "variables",
          title: "Corrección de código",
          description: "Encuentra y corrige el error en el siguiente código.",
          codeTemplate: "public class Main {\n  public static void main(String[] args) {\n    double precio = 19.99;\n    int precioEntero = precio;\n    System.out.println(precioEntero);\n  }\n}",
          correctAnswer: "int precioEntero = (int) precio;",
          multiline: false,
          order: 2
        },
        {
          id: "ex3",
          lessonId: "sum",
          title: "Bucle for",
          description: "Escribe un programa que imprima los números del 1 al 5 usando un bucle for.",
          correctAnswer: "for (int i = 1; i <= 5; i++) {\n  System.out.println(i);\n}",
          multiline: true,
          order: 3
        }
      ]
    });

    // HTML con contenido completo
    await db.collection('courses').doc('html').set({
      title: "HTML",
      description: "Aprende a crear estructuras web desde cero",
      icon: "html.png",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/1216/1216733.png",
      level: "Principiante",
      duration: "6 horas",
      order: 3,
      creationDate: firebaseTimestamp(), // Agregamos fecha de creación
      lessons: [
        {
          id: "intro",
          title: "Anatomía de un archivo HTML",
          content: "El Lenguaje de Marcado de Hipertexto (HTML) es el código que se utiliza para estructurar y desplegar una página web y sus contenidos. Ahora verás cómo los elementos individuales son combinados para formar una página HTML entera.",
          codeExample: "<!doctype html>\n<html>\n<head>\n    <meta charset=\"utf-8\" />\n    <title>Mi pagina de prueba</title>\n</head>\n<body>\n    <img src=\"images/firefox-icon.png\" alt=\"Mi imagen de prueba\"/>\n</body>\n</html>",
          order: 1
        },
        {
          id: "tags",
          title: "Etiquetas de Texto",
          content: "- <h1> a <h6>: Encabezados (de mayor a menor importancia).\n- <p>: Párrafo de texto.\n- <strong>: Texto en negrita (importancia semántica).\n- <em>: Texto en cursiva (énfasis semántico).\n- <br>: Salto de línea.\n- <hr>: Línea horizontal (separador).",
          order: 2
        }
      ],
      exercises: [
        {
          id: "ex1",
          title: "Verdadero o Falso",
          description: "Indica si las siguientes afirmaciones son verdaderas (V) o falsas (F):\n- <html> es la etiqueta que indica el inicio de un documento HTML. ___\n- <head> contiene el contenido principal de la página web. ___\n- <h1> se utiliza para crear un encabezado de nivel 1. ___\n- <p> se utiliza para crear un enlace. ___\n- <!DOCTYPE html> define el tipo de documento como HTML5. ___",
          correctAnswer: "V",
          multiline: false,
          order: 1
        },
        {
          id: "ex2",
          title: "Lista no ordenada",
          description: "Escribe el código HTML para crear una lista no ordenada con tres elementos: \"Manzana\", \"Banana\" y \"Naranja\".",
          correctAnswer: "<ul>\n  <li>Manzana</li>\n  <li>Banana</li>\n  <li>Naranja</li>\n</ul>",
          multiline: true,
          order: 2
        },
        {
          id: "ex3",
          title: "Ordenar líneas para crear una tabla",
          description: "Ordena las siguientes líneas para crear una tabla básica.",
          codeTemplate: "<td>Dato 1</td>\n<tr>\n<table>\n</tr>\n<td>Dato 2</td>\n</table>",
          correctAnswer: "<table>\n  <tr>\n    <td>Dato 1</td>\n    <td>Dato 2</td>\n  </tr>\n</table>",
          multiline: true,
          order: 3
        }
      ]
    });

    // Swift con contenido completo
    await db.collection('courses').doc('swift').set({
      title: "Swift",
      description: "Aprende a desarrollar aplicaciones para iOS",
      icon: "swift.png",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/919/919833.png", // Nueva URL de PNG
      level: "Intermedio",
      duration: "12 horas",
      order: 4,
      creationDate: firebaseTimestamp(), // Agregamos fecha de creación
      lessons: [
        {
          id: "intro",
          title: "Variables y constantes",
          content: "Swift es un lenguaje de programación relativamente nuevo diseñado por Apple Inc. que inicialmente se puso a disposición de los desarrolladores de Apple en 2014. Las variables son espacios de memoria en los que se pueden almacenar datos. En Swift, puedes declarar una variable usando la palabra clave var.",
          codeExample: "var nombre = \"Juan\"\nvar edad = 27",
          order: 1
        },
        {
          id: "types",
          title: "Tipos de datos",
          content: "Swift admite varios tipos de datos, incluyendo:\n- Int: números enteros\n- Float y Double: números de punto flotante\n- Bool: valores booleanos verdadero o falso\n- String: cadenas de texto\n- Array: colecciones ordenadas de elementos del mismo tipo de datos",
          order: 2
        },
        {
          id: "ifelse",
          title: "Estructura if-else",
          content: "La estructura if-else se usa para ejecutar una sección de código si se cumple una condición y otra sección de código si no se cumple.",
          codeExample: "if edad > 18 {\n    print(\"Eres mayor de edad\")\n} else {\n    print(\"Eres menor de edad\")\n}",
          order: 3
        }
      ],
      exercises: [
        {
          id: "ex1",
          title: "Declarar una constante y una variable",
          description: "Completa el código para declarar una constante y una variable.",
          codeTemplate: "let __ = 10\nvar __ = \"Hola\"",
          correctAnswer: "let constante = 10\nvar variable = \"Hola\"",
          multiline: true,
          order: 1
        },
        {
          id: "ex2",
          title: "Bucle for",
          description: "Arrastra las palabras correctas para completar el código que implementa un bucle for para imprimir los números del 1 al 5.",
          codeTemplate: "for ______ in 1...5 {\n  ______(____);\n}",
          correctAnswer: "for numero in 1...5 {\n  print(numero)\n}",
          multiline: true,
          order: 2
        },
        {
          id: "ex3",
          title: "Array y bucle for",
          description: "Crea un array de números enteros y escribe un bucle for para imprimir cada número.",
          correctAnswer: "let numeros = [1, 2, 3, 4, 5]\nfor numero in numeros {\n  print(numero)\n}",
          multiline: true,
          order: 3
        }
      ]
    });

    // SQL con contenido completo
    await db.collection('courses').doc('sql').set({
      title: "SQL",
      description: "Aprende a gestionar bases de datos con SQL",
      icon: "sql.png",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/4248/4248443.png", // URL actualizada
      level: "Principiante",
      duration: "8 horas",
      order: 5,
      creationDate: firebaseTimestamp(), // Agregamos fecha de creación
      lessons: [
        {
          id: "intro",
          title: "Consulta básica en SQL",
          content: "SQL (Structured Query Language) es un lenguaje estándar para interactuar con bases de datos relacionales. Permite realizar operaciones de consulta, actualización, eliminación e inserción de datos.",
          codeExample: "SELECT * FROM empleados;",
          order: 1
        },
        {
          id: "create",
          title: "Crear una tabla",
          content: "SQL también se utiliza para definir la estructura de las bases de datos, como la creación de tablas.",
          codeExample: "CREATE TABLE empleados (\n  id INT PRIMARY KEY,\n  nombre VARCHAR(50),\n  salario DECIMAL(10, 2)\n);",
          order: 2
        },
        {
          id: "insert",
          title: "Insertar datos",
          content: "Una vez que tenemos una tabla, podemos insertar datos en ella utilizando la instrucción `INSERT`.",
          codeExample: "INSERT INTO empleados (id, nombre, salario) VALUES (1, 'Juan Perez', 3000.00);",
          order: 3
        },
        {
          id: "update",
          title: "Actualizar datos",
          content: "Con SQL también podemos actualizar datos que ya existen en una tabla.",
          codeExample: "UPDATE empleados SET salario = 3500.00 WHERE id = 1;",
          order: 4
        },
        {
          id: "delete",
          title: "Eliminar datos",
          content: "También es posible eliminar registros de una tabla usando la instrucción `DELETE`.",
          codeExample: "DELETE FROM empleados WHERE id = 1;",
          order: 5
        }
      ],
      exercises: [
        {
          id: "ex1",
          title: "Consulta básica",
          description: "Escribe una consulta que seleccione todos los campos de la tabla empleados",
          correctAnswer: "SELECT * FROM empleados;",
          multiline: false,
          order: 1
        },
        {
          id: "ex2",
          title: "Filtrar resultados",
          description: "Escribe una consulta que filtre empleados con salario mayor a 3000",
          correctAnswer: "SELECT * FROM empleados WHERE salario > 3000;",
          multiline: false,
          order: 2
        }
      ]
    });

    console.log('Inicialización completada con éxito');
  } catch (error) {
    console.error('Error en la inicialización de datos:', error);
  }
};

export const updateMissingCreationDates = async () => {
  try {
    const coursesSnapshot = await db.collection('courses').get();
    
    if (coursesSnapshot.empty) {
      console.log('No hay cursos para actualizar fechas');
      return;
    }
    
    const batch = db.batch();
    let updatesNeeded = 0;
    
    coursesSnapshot.forEach(doc => {
      const courseData = doc.data();
      
      // Si no tiene fecha de creación, establecerla
      if (!courseData.creationDate) {
        updatesNeeded++;
        const courseRef = db.collection('courses').doc(doc.id);
        batch.update(courseRef, { creationDate: firebaseTimestamp() });
      }
    });
    
    if (updatesNeeded > 0) {
      await batch.commit();
      console.log(`Se actualizaron fechas de creación para ${updatesNeeded} cursos`);
    } else {
      console.log('Todos los cursos ya tienen fecha de creación');
    }
    
    return updatesNeeded;
  } catch (error) {
    console.error('Error actualizando fechas de creación:', error);
    throw error;
  }
};

const initializeAchievements = async () => {
  try {
    console.log('Inicializando logros en Firestore...');
    
    const achievements = [
      {
        id: 'first_login',
        title: 'Primer Inicio',
        description: 'Iniciaste sesión por primera vez en la app',
        icon: 'trophy',
        points: 10,
        category: 'general'
      },
      {
        id: 'first_exercise',
        title: 'Primer Paso',
        description: 'Completaste tu primer ejercicio',
        icon: 'star',
        points: 20,
        category: 'exercises'
      },
      {
        id: 'five_exercises',
        title: 'Constancia',
        description: 'Completaste 5 ejercicios',
        icon: 'flame',
        points: 50,
        category: 'exercises'
      },
      {
        id: 'twenty_exercises',
        title: 'Experto',
        description: 'Completaste 20 ejercicios',
        icon: 'school',
        points: 100,
        category: 'exercises'
      },
      {
        id: 'streak_3days',
        title: 'Hábito',
        description: 'Usaste la app 3 días seguidos',
        icon: 'flame',
        points: 30,
        category: 'streak'
      },
      {
        id: 'streak_7days',
        title: 'Perseverancia',
        description: 'Usaste la app 7 días seguidos',
        icon: 'flame',
        points: 70,
        category: 'streak'
      },
      {
        id: 'streak_30days',
        title: 'Imparable',
        description: 'Usaste la app 30 días seguidos',
        icon: 'flame',
        points: 200,
        category: 'streak'
      },
      {
        id: 'complete_python',
        title: 'Pythonista',
        description: 'Completaste el curso de Python',
        icon: 'code',
        points: 100,
        category: 'courses'
      },
      {
        id: 'complete_java',
        title: 'Maestro Java',
        description: 'Completaste el curso de Java',
        icon: 'code-slash',
        points: 100,
        category: 'courses'
      },
      {
        id: 'complete_html',
        title: 'Desarrollador Web',
        description: 'Completaste el curso de HTML',
        icon: 'globe',
        points: 100,
        category: 'courses'
      }
    ];
    
    // Guardar cada logro como un documento
    for (const achievement of achievements) {
      await db.collection('achievements').doc(achievement.id).set(achievement);
    }
    
    console.log('Logros inicializados correctamente');
    return true;
  } catch (error) {
    console.error('Error inicializando logros:', error);
    return false;
  }
};