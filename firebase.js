// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-7t7AbLPMOz5UYl9UWOPJpwH4P2YucFA",
  authDomain: "to-do-list-84c34.firebaseapp.com",
  projectId: "to-do-list-84c34",
  storageBucket: "to-do-list-84c34.appspot.com",
  messagingSenderId: "729318907430",
  appId: "1:729318907430:web:39dfdc75d7d1ae9aa910e7",
  measurementId: "G-EPSJH3MJQ5"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export async function getTasks() {

    const allTasks = []
    const querySnapshot = await getDocs(collection(db, "Tasks"));
    querySnapshot.forEach((doc) => {
        //console.log(`${doc.id} => ${doc.data()}`);
        allTasks.push({
            ...doc.data(),
            id: doc.id
        })
    });

    return allTasks
}

export async function addTask(taskTitle) {
    try {
        const docRef = await addDoc(collection(db, "Tasks"), {
            title: taskTitle,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export async function addUserToDb(userInfo, id) {
    try {
        await setDoc(doc(db, "users", id), userInfo);
        console.log("user written with ID: ", id);
    } catch (e) {
        console.error("Error adding user: ", e);
    }
}

export async function editDocument(title, id) {
    await setDoc(doc(db, "Tasks", id), {
        title: title,
        completed: true,
    });
}

export async function createUser(userInfo) {
    try {
        //Sign up
        const userCredential = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
        const user = userCredential.user
        console.log(user)

        //Subir Imagen
        const url = await uploadFile(user.id + userInfo.picture.name, userInfo.picture, 'profilePicture')

        //Crear usuario en DB
        const dbInfo = {
            url,
            email: userInfo.email,
            birthday: userInfo.birthday,
            username: userInfo.username
        }
        addUserToDb(dbInfo, user.id)
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(error.message)
        // ..
    }
}

export async function uploadFile(name, file, folder) {
    const taskImgRef = ref(storage, `${folder}/${name}`);

    try {
        await uploadBytes(taskImgRef, file);
        const url = await getDownloadURL(taskImgRef);
        return url;
    } catch (error) {
        console.log("error creando imagen ->", error);
    }
}

export async function logInUser(email, password) {

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        return {status: true, info: user.id}

    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {status: false, info: errorMessage}
    };
}