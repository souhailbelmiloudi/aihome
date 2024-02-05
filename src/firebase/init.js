import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import {
  getFirestore,
	collection,
	getDocs,
	onSnapshot,
	addDoc,
	deleteDoc,
	doc,
  getDoc,
  setDoc,
	updateDoc, } from 'firebase/firestore'





const firebaseConfig = {
  apiKey: "AIzaSyBSmdnrNIBFyjJXg28yx_e8LXTUjREHmNs",
  authDomain: "smart-home-a1400.firebaseapp.com",
  projectId: "smart-home-a1400",
  storageBucket: "smart-home-a1400.appspot.com",
  messagingSenderId: "452139768210",
  appId: "1:452139768210:web:3df26c1ac97ed79b0e094b"
};

initializeApp(firebaseConfig); 
const auth = getAuth()
const signIn = signInWithEmailAndPassword
const db = getFirestore()
//const createUser = createUserWithEmailAndPassword

const createUser = createUserWithEmailAndPassword

/**
 * Agrega un nuevo documento a una colección específica 
 * @param {string} ref - La referencia a la colección donde se agregará el documento.
 * @param {Object} objeto - Los datos a agregar como un objeto.
 * @returns {Promise} - Una promesa que se resuelve cuando se agrega el documento.
 */
export const saveData = (ref, objeto) => addDoc(collection(db, ref), objeto);

/**
 * Obtiene todos los documentos de una colección específica en Firestore.
 * @param {string} ref - La referencia a la colección de la cual obtener los documentos.
 * @returns {Promise} - Una promesa que devuelve un snapshot con los datos de la colección.
 */
export const getDataCollection = (ref) => getDocs(collection(db, ref));

/**
 * Establece un listener para detectar cambios en una colección y ejecuta una función callback.
 * @param {string} ref - La referencia a la colección a observar.
 * @param {Function} callBack - La función que se ejecutará cuando haya cambios en la colección.
 * @returns {Function} - La función de desactivación del listener.
 */
export const getDataChanged_collection = (ref, callBack) => onSnapshot(collection(db, ref), callBack);

/**
 * Elimina un documento específico de una colección en Firestore.
 * @param {string} id - El ID del documento a eliminar.
 * @param {string} ref - La referencia a la colección donde se encuentra el documento.
 * @returns {Promise} - Una promesa que se resuelve cuando se elimina el documento.
 */
export const deleteData = (id, ref) => deleteDoc(doc(db, ref, id));

/**
 * Obtiene un documento específico de una colección en Firestore por su ID.
 * @param {string} id - El ID del documento a obtener.
 * @param {string} ref - La referencia a la colección donde se encuentra el documento.
 * @returns {Promise} - Una promesa que devuelve un snapshot con los datos del documento.
 */
export const getDataDocument = (id, ref) => getDoc(doc(db, ref, id));

/**
 * Actualiza un documento específico de una colección en Firestore por su ID.
 * @param {string} id - El ID del documento a actualizar.
 * @param {string} ref - La referencia a la colección donde se encuentra el documento.
 * @param {Object} objeto - Los datos con los que actualizar el documento.
 * @returns {Promise} - Una promesa que se resuelve cuando se actualiza el documento.
 */
export const updateData = (id, ref, objeto) => updateDoc(doc(db, ref, id), objeto);

/**
 * Establece un listener para detectar cambios en un documento específico y ejecuta una función callback(recibe un snapshot que es un objeto que contiene los datos del documento)
 * @param {string} ref - La referencia a la colección donde se encuentra el documento.
 * @param {string} document - El ID del documento a observar.
 * @param {Function} callBack - La función que se ejecutará cuando haya cambios en el documento.
 * @returns {Function} - La función de desactivación del listener.
 */
export const getDataChanged_document = (ref, document, callBack) => onSnapshot(doc(db, ref, document), callBack);

/**
 * Obtiene un documento específico de una colección en Firestore por su ID.
 * @param {string} id - El ID del documento a obtener.
 * @param {string} ref - La referencia a la colección donde se encuentra el documento.
 * @returns {Promise} - Una promesa que devuelve un snapshot con los datos del documento.
 */
// export const getData = (id, ref) => getDoc(doc(db, ref, id));


/**
 * Añade un documento con un ID específico a una colección en Firestore.
 * @param {string} docId - El ID del documento a añadir.
 * @param {string} collectionRef - La referencia a la colección donde se añadirá el documento.
 * @param {Object} data - Los datos a añadir como un objeto.
 * @returns {Promise} - Una promesa que se resuelve cuando se añade el documento.
 */
export const addDataWithCustomId = async (docId, collectionRef, data) => {
  try {
    const documentRef = doc(db, collectionRef, docId);
    await setDoc(documentRef, data);
    console.log('Documento añadido con éxito con ID personalizado.');
  } catch (error) {
    console.error('Error al añadir el documento:', error);
    throw error;
  }
};





export { auth, signIn, createUser }
