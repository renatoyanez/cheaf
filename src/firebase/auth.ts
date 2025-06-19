import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Roles } from "../enums/auth";

export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string,
  roles?: string[] | string
) => {
  const createUser = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = createUser.user;

  // Assign default role (e.g., 'USER')
  await setDoc(doc(db, "users", user.uid), {
    role: roles || Roles.USER,
    email: user.email,
  });
  // localStorage.removeItem("products_data");
  localStorage.setItem("role", JSON.stringify(roles));
  return createUserWithEmailAndPassword(auth, email, password);
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

  // localStorage.removeItem("products_data");
  localStorage.setItem("role", JSON.stringify(role));

  return userCredential;
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  // const user = result.user;
  return result;
  // add user to firestore
};

export const doSignOut = () => {
  localStorage.removeItem("role");
  // localStorage.removeItem("products_data");
  return auth.signOut();
};

export const doPasswordReset = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password: string) => {
  return updatePassword(auth.currentUser as User, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser as User, {
    url: `${window.location.origin}/home`,
  });
};
