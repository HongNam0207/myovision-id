import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const usersCollection = collection(db, "users");

export function listenUsers(callback, onError) {
  const q = query(usersCollection, orderBy("role", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      callback(data);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

export async function upsertUserProfile(userData) {
  await setDoc(
    doc(db, "users", userData.email),
    {
      ...userData,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function updateUserRole(userId, role) {
  await updateDoc(doc(db, "users", userId), {
    role,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUserProfile(userId) {
  await deleteDoc(doc(db, "users", userId));
}
