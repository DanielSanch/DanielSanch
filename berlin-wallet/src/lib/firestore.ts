import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// --- Loyalty Cards ---

export interface LoyaltyCard {
  id?: string;
  name: string;
  type: 'stamps' | 'points' | 'visits' | 'event';
  requiredCount: number;
  reward: string;
  color: string;
  description: string;
  isActive: boolean;
  createdAt?: Timestamp;
}

export async function createLoyaltyCard(businessId: string, card: Omit<LoyaltyCard, 'id' | 'createdAt'>) {
  const ref = collection(db, 'businesses', businessId, 'loyaltyCards');
  const docRef = await addDoc(ref, { ...card, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function getLoyaltyCards(businessId: string): Promise<LoyaltyCard[]> {
  const ref = collection(db, 'businesses', businessId, 'loyaltyCards');
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as LoyaltyCard));
}

export async function updateLoyaltyCard(businessId: string, cardId: string, data: Partial<LoyaltyCard>) {
  const ref = doc(db, 'businesses', businessId, 'loyaltyCards', cardId);
  await updateDoc(ref, data);
}

export async function deleteLoyaltyCard(businessId: string, cardId: string) {
  const ref = doc(db, 'businesses', businessId, 'loyaltyCards', cardId);
  await deleteDoc(ref);
}

// --- Client Cards (customer instances of loyalty cards) ---

export interface ClientCard {
  id?: string;
  clientName: string;
  clientEmail: string;
  cardId: string;
  cardName: string;
  currentCount: number;
  requiredCount: number;
  type: 'stamps' | 'points' | 'visits' | 'event';
  isRedeemed: boolean;
  isRegistered: boolean; // for events: marked as attended
  interactions: { date: string; note: string }[];
  createdAt?: Timestamp;
}

export async function createClientCard(
  businessId: string,
  data: Omit<ClientCard, 'id' | 'createdAt'>
) {
  const ref = collection(db, 'businesses', businessId, 'clientCards');
  const docRef = await addDoc(ref, { ...data, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function getClientCards(businessId: string): Promise<ClientCard[]> {
  const ref = collection(db, 'businesses', businessId, 'clientCards');
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientCard));
}

export async function getClientCardById(businessId: string, cardId: string): Promise<ClientCard | null> {
  const ref = doc(db, 'businesses', businessId, 'clientCards', cardId);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...snap.data() } as ClientCard;
  return null;
}

export async function getClientCardsByLoyaltyCard(businessId: string, loyaltyCardId: string): Promise<ClientCard[]> {
  const ref = collection(db, 'businesses', businessId, 'clientCards');
  const q = query(ref, where('cardId', '==', loyaltyCardId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientCard));
}

export async function updateClientCard(businessId: string, clientCardId: string, data: Partial<ClientCard>) {
  const ref = doc(db, 'businesses', businessId, 'clientCards', clientCardId);
  await updateDoc(ref, data);
}

export async function addInteraction(
  businessId: string,
  clientCardId: string,
  currentCard: ClientCard,
  note: string
) {
  const newCount = currentCard.currentCount + 1;
  const isRedeemed = newCount >= currentCard.requiredCount;
  const interactions = [
    ...(currentCard.interactions || []),
    { date: new Date().toISOString(), note },
  ];
  await updateClientCard(businessId, clientCardId, {
    currentCount: newCount,
    isRedeemed,
    interactions,
  });
  return { newCount, isRedeemed };
}

export async function markEventRegistered(businessId: string, clientCardId: string) {
  await updateClientCard(businessId, clientCardId, { isRegistered: true });
}

export async function searchClientsByName(businessId: string, name: string): Promise<ClientCard[]> {
  const all = await getClientCards(businessId);
  const lower = name.toLowerCase();
  return all.filter(c => c.clientName.toLowerCase().includes(lower));
}
