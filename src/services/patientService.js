import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const patientsCollection = collection(db, "patients");

export function listenPatients(callback, onError) {
  return onSnapshot(
    patientsCollection,
    (snapshot) => {
      const data = snapshot.docs
        .map((document) => ({
          id: document.id,
          ...document.data(),
        }))
        .sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

      callback(data);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

export async function addPatient(patientData, user) {
  await addDoc(patientsCollection, {
    ...patientData,
    createdBy: user?.email || "unknown",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updatePatient(patientId, patientData) {
  await updateDoc(doc(db, "patients", patientId), {
    ...patientData,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePatient(patientId) {
  await deleteDoc(doc(db, "patients", patientId));
}
