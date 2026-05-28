import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPatientsApi } from "../api/patients.api";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const res = await getPatientsApi();
      const data = res.data ?? res;

      if (Array.isArray(data)) {
        setPatients(data);
      } else if (Array.isArray(data.items)) {
        setPatients(data.items);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error(error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Patients</h1>
        <p className="text-slate-500">Patient list</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Full name</th>
              <th className="px-4 py-3 text-left">Gender</th>
              <th className="px-4 py-3 text-left">Date of birth</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center">
                  Loading...
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center">
                  No data
                </td>
              </tr>
            ) : (
              patients.map((patient) => {
                const id = patient.patientId || patient.id;

                return (
                  <tr key={id} className="border-t">
                    <td className="px-4 py-3">{patient.patientCode}</td>
                    <td className="px-4 py-3">{patient.fullName}</td>
                    <td className="px-4 py-3">{patient.gender}</td>
                    <td className="px-4 py-3">{patient.dateOfBirth}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/patients/${id}`}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
