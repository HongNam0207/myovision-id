import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

export const dashboardByRole = {
  admin: "/admin-dashboard",
  doctor: "/doctor-dashboard",
  reception: "/patients",
  technician: "/clinical-exam",
};

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("myovision_user") || "null");
  } catch {
    return null;
  }
}

export function saveSession(user) {
  const dashboard = dashboardByRole[user.role] || "/patients";
  const sessionUser = { ...user, dashboard };

  localStorage.setItem("myovision_user", JSON.stringify(sessionUser));
  localStorage.setItem("user_authenticated", "true");

  return sessionUser;
}

async function findUserProfile(firebaseUser) {
  const email = firebaseUser.email;

  if (!email) {
    throw new Error("Tài khoản Firebase chưa có email.");
  }

  const userByEmailId = await getDoc(doc(db, "users", email));

  if (userByEmailId.exists()) {
    return {
      id: userByEmailId.id,
      ...userByEmailId.data(),
    };
  }

  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Không tìm thấy thông tin phân quyền của tài khoản này trong collection users.");
  }

  const userDoc = snapshot.docs[0];

  return {
    id: userDoc.id,
    ...userDoc.data(),
  };
}

export async function loginWithEmail(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = credential.user;
  const profile = await findUserProfile(firebaseUser);

  return saveSession({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    ...profile,
  });
}

export async function logoutUser() {
  await signOut(auth);
  localStorage.removeItem("myovision_user");
  localStorage.removeItem("user_authenticated");
}
