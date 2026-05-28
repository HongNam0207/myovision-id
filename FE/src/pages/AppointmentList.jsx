import { useEffect, useState } from "react";
import { getAppointmentsApi } from "../api/appointments.api";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      const res = await getAppointmentsApi();
      const data = res.data ?? res;

      if (Array.isArray(data)) setAppointments(data);
      else if (Array.isArray(data.items)) setAppointments(data.items);
      else setAppointments([]);
    } catch (error) {
      console.error(error);
      setAppointments([]);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p className="text-slate-500">Appointment management</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Patient</th>
              <th className="px-4 py-3 text-left">Doctor</th>
              <th className="px-4 py-3 text-left">Datetime</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center">
                  No appointments
                </td>
              </tr>
            ) : (
              appointments.map((item) => (
                <tr key={item.appointmentId || item.id} className="border-t">
                  <td className="px-4 py-3">{item.patientName || item.patient?.fullName}</td>
                  <td className="px-4 py-3">{item.doctorName || item.doctor?.fullName}</td>
                  <td className="px-4 py-3">{item.appointmentDatetime}</td>
                  <td className="px-4 py-3">{item.appointmentType}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
