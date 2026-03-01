'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface BusinessProfile {
  name: string;
  email: string;
  type: 'restaurant' | 'hotel' | 'gym' | 'events' | 'transport' | 'other';
  address: string;
  theme: 'dark' | 'light';
  createdAt: string;
}

export async function registerBusiness(
  email: string,
  password: string,
  businessName: string,
  businessType: BusinessProfile['type'],
  theme: 'dark' | 'light'
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const profile: BusinessProfile = {
    name: businessName,
    email,
    type: businessType,
    address: '',
    theme,
    createdAt: new Date().toISOString(),
  };
  await setDoc(doc(db, 'businesses', cred.user.uid), profile);
  return cred.user;
}

export async function loginBusiness(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const docRef = doc(db, 'businesses', cred.user.uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    await setDoc(docRef, {
      name: cred.user.displayName || 'Mi Negocio',
      email: cred.user.email,
      type: 'other',
      address: '',
      theme: 'dark',
      createdAt: new Date().toISOString(),
    });
  }
  return cred.user;
}

export async function logoutBusiness() {
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getBusinessProfile(uid: string): Promise<BusinessProfile | null> {
  const docSnap = await getDoc(doc(db, 'businesses', uid));
  if (docSnap.exists()) {
    return docSnap.data() as BusinessProfile;
  }
  return null;
}
