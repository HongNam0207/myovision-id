import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVisitsApi } from "../api/visits.api";

export default function VisitQueue() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVisits();
  }, []);

  async function loadVisits() {
    try {
      const res = await getVisitsApi();
      const data = res.data ?? res;

      if (Array.isArray(data)) {
        setVisits(data);
      } else if (Array.isArray(data.items)) {
        setVisits(data.items);
      } else {
        setVisits([]);
      }
    } catch (error) {
      console.error(error);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Visit Queue</h1>
        <p className="text-slate-500">Visit workflow queue</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Visit Code</th>
              <th className="px-4 py-3 text-left">Patient</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Visit Type</th>
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
            ) : visits.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center">
                  No visits
                </td>
              </tr>
            ) : (
              visits.map((visit) => {
                const id = visit.visitId || visit.id;

                return (
                  <tr key={id} className="border-t">
                    <td className="px-4 py-3">{visit.visitCode}</td>

                    <td className="px-4 py-3">
                      {visit.patientName || visit.patient?.fullName}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {visit.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {visit.visitType}
                    </td>

                    <td className="px-4 py-3">
                      <Link
                        to={`/visits/${id}`}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
                      >
                        Open
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
