/**
 * Configuración de Firebase
 * Utiliza variables de entorno para mantener las credenciales seguras
 * 
 * ⚠️ IMPORTANTE: Firebase maneja automáticamente HTTPS en todas las comunicaciones
 * Todas las peticiones a Firebase Authentication y Firestore usan HTTPS seguro,
 * incluso cuando la aplicación se ejecuta en localhost:3000 (desarrollo).
 * 
 * Firebase SDK se conecta a:
 * - https://identitytoolkit.googleapis.com (Authentication)
 * - https://firestore.googleapis.com (Firestore)
 * - https://firebase.googleapis.com (otros servicios)
 * 
 * Todas estas URLs usan HTTPS automáticamente ✅
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Validación de variables de entorno (seguridad)
const getFirebaseConfig = (): FirebaseConfig => {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Validar que todas las variables estén presentes
  const missingVars = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Faltan variables de entorno de Firebase: ${missingVars.join(', ')}\n` +
      'Por favor, crea un archivo .env.local con las credenciales de Firebase.'
    );
  }

  return config as FirebaseConfig;
};

// Inicializar Firebase solo una vez (Singleton pattern)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined') {
  // Solo ejecutar en el cliente
  if (getApps().length === 0) {
    app = initializeApp(getFirebaseConfig());
  } else {
    app = getApps()[0];
  }

  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
export type { FirebaseConfig };

