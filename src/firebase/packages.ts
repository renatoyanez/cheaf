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
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { Roles } from "../enums/auth";
import { Product } from "../types/products";
import { Package } from "../types/package";

export const getPackages = async (userUid: string) => {
  const packageDoc = await getDoc(doc(db, "packages", userUid));
  const packages = packageDoc.exists() ? packageDoc.data() : {};
  return packages;
};

export const createPackage = async (
  user: User,
  packageName: string,
  product: Product
) => {
  const createdPackage = await setDoc(doc(db, "packages", user.uid), {
    packageId: user.uid,
    packageName,
    email: user.email,
    products: [product],
  });

  return createdPackage;
};

const addPackage = async (userId: string, newPackage: Package) => {
  const packagesRef = collection(db, "users", userId, "packages");
  await addDoc(packagesRef, {
    ...newPackage,
    createdAt: serverTimestamp(),
  });
};

export const removePackage = async () => {};

export const saveProductToPackage = async (
  user: User,
  packageName: string,
  product: Product
) => {};

const updatePackage = async (userId: string, packageId: string, updates: Partial<Package>) => {
  const packageRef = doc(db, "users", userId, "packages", packageId);
  await updateDoc(packageRef, updates);
};

const getUserPackages = async (userId: string) => {
  const packagesRef = collection(db, "users", userId, "packages");
  const snapshot = await getDocs(packagesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const deletePackage = async (userId: string, packageId: string) => {
  const packageRef = doc(db, "users", userId, "packages", packageId);
  await deleteDoc(packageRef);
};