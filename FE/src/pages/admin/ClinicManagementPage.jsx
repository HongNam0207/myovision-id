import { useEffect, useState } from "react";
import { clinicApi } from "../../api/clinics.api";

export default function ClinicManagementPage() {
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    clinicApi.getAll()
      .then((res) => setClinics(res.data?.data?.items || res.data?.data || []))
      .catch(() => setClinics([]));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Clinic Management</h1>
      <p className="mt-1 text-gray-500">Qu?n lý phòng khám / chi nhánh.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {clinics.map((c) => (
          <div key={c.clinicId || c.id} className="rounded-xl border bg-white p-4">
            <div className="font-semibold">{c.clinicName}</div>
            <div className="text-sm text-gray-500">{c.clinicCode}</div>
            <div className="mt-3 text-sm">{c.address}</div>
            <div className="mt-2 text-sm text-gray-500">{c.phone} {c.email}</div>
          </div>
        ))}

        {!clinics.length && (
          <div className="rounded-xl border bg-white p-6 text-gray-500">
            Chua có d? li?u clinic.
          </div>
        )}
      </div>
    </div>
  );
}
