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
import { Product } from "../types/products";

export const createPackage = async (user: User, packageName: string, products: Product[]) => {
  await setDoc(doc(db, "packages", user.uid), {
    packageId: user.uid,
    packageName,
    email: user.email,
    products: [...products],
  });
};
export const removePackage = async () => {};

export const saveProductToPackage = async () => {};
export const removeProductToPackage = async () => {};
export const editPackage = async () => {};
