import { initializeApp } from "firebase/app";
import {
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqz13lcjSIIXaV7Zwe-miPf1dzZdTAPZQ",
  authDomain: "myovision-demo.firebaseapp.com",
  projectId: "myovision-demo",
  storageBucket: "myovision-demo.firebasestorage.app",
  messagingSenderId: "317132422436",
  appId: "1:317132422436:web:53a522788be65d67b9c7b1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedCollection(collectionName, items) {
  for (const item of items) {
    const { id, ...data } = item;

    await setDoc(
      doc(db, collectionName, id),
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}

async function seed() {
  console.log("Seeding Firebase...");

  await seedCollection("users", [
    {
      id: "admin@myovision.com",
      name: "Admin Đồng Đội",
      email: "admin@myovision.com",
      role: "admin",
      status: "Đang hoạt động",
    },
    {
      id: "doctor@myovision.com",
      name: "Bác sĩ Minh",
      email: "doctor@myovision.com",
      role: "doctor",
      status: "Đang hoạt động",
    },
    {
      id: "reception@myovision.com",
      name: "Lễ tân Hoa",
      email: "reception@myovision.com",
      role: "reception",
      status: "Đang hoạt động",
    },
    {
      id: "technician@myovision.com",
      name: "KTV Nam",
      email: "technician@myovision.com",
      role: "technician",
      status: "Đang hoạt động",
    },
  ]);

  await seedCollection("patients", [
    {
      id: "patient-nguyen-minh-anh",
      fullName: "Nguyễn Minh Anh",
      age: 12,
      gender: "Nam",
      status: "Đang điều trị",
      createdBy: "seedFirestore.js",
      createdAt: serverTimestamp(),
    },
    {
      id: "patient-tran-gia-han",
      fullName: "Trần Gia Hân",
      age: 10,
      gender: "Nữ",
      status: "Đang theo dõi",
      createdBy: "seedFirestore.js",
      createdAt: serverTimestamp(),
    },
  ]);

  await seedCollection("treatments", [
    {
      id: "treatment-nguyen-minh-anh",
      patientId: "patient-nguyen-minh-anh",
      patientName: "Nguyễn Minh Anh",
      method: "Ortho-K",
      status: "Đang điều trị",
      note: "Phác đồ demo ban đầu.",
    },
  ]);

  await seedCollection("clinicalExams", [
    {
      id: "exam-nguyen-minh-anh-001",
      patientId: "patient-nguyen-minh-anh",
      patientName: "Nguyễn Minh Anh",
      age: 12,
      visionRight: "7/10",
      visionLeft: "6/10",
      note: "Dữ liệu khám lâm sàng mẫu.",
      createdAt: serverTimestamp(),
    },
  ]);

  await seedCollection("riskAssessments", [
    {
      id: "risk-nguyen-minh-anh-001",
      patientId: "patient-nguyen-minh-anh",
      patientName: "Nguyễn Minh Anh",
      riskLevel: "Cao",
      score: 82,
      recommendation: "Theo dõi AL/SER định kỳ và tuân thủ phác đồ.",
      createdAt: serverTimestamp(),
    },
  ]);

  await seedCollection("followUps", [
    {
      id: "followup-nguyen-minh-anh-001",
      patientId: "patient-nguyen-minh-anh",
      patientName: "Nguyễn Minh Anh",
      appointmentDate: "2026-06-01",
      status: "Đã lên lịch",
      note: "Kiểm tra lại AL và thị lực.",
    },
  ]);

  await seedCollection("reports", [
    {
      id: "report-nguyen-minh-anh-001",
      patientId: "patient-nguyen-minh-anh",
      patientName: "Nguyễn Minh Anh",
      type: "Báo cáo tiến triển cận thị",
      status: "Đã tạo",
      createdAt: serverTimestamp(),
    },
  ]);

  console.log("Seed completed.");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
