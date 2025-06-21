import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { Roles } from "../enums/auth";

export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string,
  roles?: string[] | string
) => {
  try {
    const createUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = createUser.user;

    await setDoc(doc(db, "users", user.uid), {
      role: roles || Roles.USER,
      email: user.email,
    });

    localStorage.setItem("role", JSON.stringify(roles));

    return createUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const doSignInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  // set this role to the context
  const role = userDoc.exists() ? userDoc.data().role : Roles.USER;

  localStorage.setItem("role", JSON.stringify(role));

  return userCredential;
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result;
};

export const doSignOut = () => {
  localStorage.removeItem("role");
  return auth.signOut();
};
