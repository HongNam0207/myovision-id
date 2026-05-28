import { useEffect, useState } from "react";
import { getMyChildrenApi } from "../api/parentPortal.api";

export default function ParentChildren() {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    loadChildren();
  }, []);

  async function loadChildren() {
    try {
      const res = await getMyChildrenApi();
      const data = res.data ?? res;

      if (Array.isArray(data)) setChildren(data);
      else if (Array.isArray(data.items)) setChildren(data.items);
      else setChildren([]);
    } catch (error) {
      console.error(error);
      setChildren([]);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Children</h1>
        <p className="text-slate-500">Parent portal child list</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {children.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow">No children</div>
        ) : (
          children.map((child) => (
            <div key={child.patientId || child.id} className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-bold">{child.fullName}</h2>
              <p className="mt-2 text-slate-500">Code: {child.patientCode}</p>
              <p>Gender: {child.gender}</p>
              <p>Date of birth: {child.dateOfBirth}</p>
              <p>Status: {child.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
