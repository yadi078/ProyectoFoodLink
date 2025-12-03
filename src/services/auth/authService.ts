/**
 * Servicio de Autenticación
 * Capa de lógica de negocio para la autenticación de vendedores
 * Maneja la comunicación segura con Firebase Authentication
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  User,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import type {
  Vendedor,
  Estudiante,
  HorarioServicio,
  Zona,
} from "@/lib/firebase/types";

/**
 * Registro de nuevo usuario (vendedor o estudiante)
 * Crea una cuenta en Firebase Auth y un documento en Firestore
 */
export const registerUser = async (
  tipoUsuario: "alumno" | "vendedor",
  email: string,
  password: string,
  nombre: string,
  zona: Zona,
  telefono?: string,
  institucionEducativa?: string,
  nombreNegocio?: string,
  tipoComida?: string[],
  horario?: HorarioServicio,
  diasDescanso?: string[]
): Promise<UserCredential> => {
  try {
    // 1. Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // 2. Actualizar perfil del usuario
    await updateProfile(user, {
      displayName: nombre,
    });

    // 3. Crear documento según el tipo de usuario
    if (tipoUsuario === "vendedor") {
      const vendedorData: Omit<Vendedor, "uid"> = {
        email,
        nombre,
        telefono,
        zona,
        nombreNegocio,
        tipoComida,
        horario,
        diasDescanso,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(doc(db, "vendedores", user.uid), vendedorData);
    } else {
      const estudianteData: Omit<Estudiante, "uid"> = {
        email,
        nombre,
        telefono,
        zona,
        institucionEducativa,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(doc(db, "estudiantes", user.uid), estudianteData);
    }

    // 4. Firebase maneja automáticamente el token JWT
    // El token se obtiene mediante user.getIdToken()

    return userCredential;
  } catch (error: any) {
    // Mapear errores de Firebase a mensajes más amigables
    throw mapFirebaseError(error);
  }
};

/**
 * Inicio de sesión de usuario (alumno o vendedor)
 * Autentica con Firebase y verifica que el usuario existe en la colección correspondiente
 */
export const loginUser = async (
  tipoUsuario: "alumno" | "vendedor",
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userId = userCredential.user.uid;
    const coleccion = tipoUsuario === "vendedor" ? "vendedores" : "estudiantes";

    // Verificar que el usuario existe en la colección correspondiente
    const userDoc = await getDoc(doc(db, coleccion, userId));

    if (!userDoc.exists()) {
      await signOut(auth);
      const tipoTexto =
        tipoUsuario === "vendedor" ? "vendedor" : "alumno/maestro";
      throw new Error(
        `Esta cuenta no está registrada como ${tipoTexto}. Por favor, regístrate primero.`
      );
    }

    // Firebase maneja automáticamente el token JWT de sesión
    return userCredential;
  } catch (error: any) {
    throw mapFirebaseError(error);
  }
};

/**
 * Cerrar sesión
 */
export const logoutVendedor = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw mapFirebaseError(error);
  }
};

/**
 * Obtener token de sesión del usuario actual
 * Firebase maneja automáticamente tokens JWT seguros
 */
export const getSessionToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    // Firebase proporciona tokens JWT automáticamente
    // Estos tokens son seguros y se renuevan automáticamente
    return await user.getIdToken();
  } catch (error) {
    console.error("Error obteniendo token:", error);
    return null;
  }
};

/**
 * Obtener información del vendedor actual
 */
export const getCurrentVendedor = async (): Promise<Vendedor | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const vendedorDoc = await getDoc(doc(db, "vendedores", user.uid));
    if (!vendedorDoc.exists()) return null;

    return {
      uid: user.uid,
      ...vendedorDoc.data(),
      createdAt: vendedorDoc.data().createdAt?.toDate() || new Date(),
      updatedAt: vendedorDoc.data().updatedAt?.toDate() || new Date(),
    } as Vendedor;
  } catch (error) {
    console.error("Error obteniendo vendedor:", error);
    return null;
  }
};

/**
 * Mapear errores de Firebase a mensajes más amigables
 */
const mapFirebaseError = (error: any): Error => {
  const errorCode = error.code || "";
  const errorMessage = error.message || "Ocurrió un error inesperado";

  // Códigos de error comunes de Firebase Auth
  const errorMap: Record<string, string> = {
    "auth/email-already-in-use":
      "Este correo electrónico ya está registrado. Por favor, inicia sesión.",
    "auth/invalid-email":
      "El correo electrónico no es válido. Por favor, verifica el formato.",
    "auth/operation-not-allowed":
      "Esta operación no está permitida. Contacta al administrador.",
    "auth/weak-password":
      "La contraseña es muy débil. Debe tener al menos 6 caracteres.",
    "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
    "auth/user-not-found": "No existe una cuenta con este correo electrónico.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/invalid-credential":
      "Las credenciales proporcionadas son incorrectas.",
    "auth/too-many-requests":
      "Demasiados intentos fallidos. Por favor, intenta más tarde.",
    "auth/network-request-failed":
      "Error de conexión. Por favor, verifica tu conexión a internet.",
  };

  const friendlyMessage =
    errorMap[errorCode] || `Error de autenticación: ${errorMessage}`;

  return new Error(friendlyMessage);
};
