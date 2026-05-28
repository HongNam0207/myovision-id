import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  generateVisitReportApi,
  getVisitReportsApi,
  updateReportVisibilityApi,
} from "../api/reports.api";

export default function MedicalReport() {
  const { visitId } = useParams();
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadReports();
  }, [visitId]);

  async function loadReports() {
    try {
      const res = await getVisitReportsApi(visitId);
      const data = res.data ?? res;

      if (Array.isArray(data)) setReports(data);
      else if (Array.isArray(data.items)) setReports(data.items);
      else setReports([]);
    } catch (error) {
      console.error(error);
      setReports([]);
    }
  }

  async function generateReport() {
    setMessage("");

    try {
      await generateVisitReportApi(visitId);
      setMessage("Report generated successfully");
      await loadReports();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Generate failed");
    }
  }

  async function toggleVisibility(report) {
    const id = report.reportId || report.id;
    const next = !report.isVisibleToParent;

    try {
      await updateReportVisibilityApi(id, next);
      await loadReports();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Update visibility failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to={`/visits/${visitId}`} className="text-blue-600">
            Back to visit
          </Link>
          <h1 className="mt-3 text-3xl font-bold">Medical Reports</h1>
          <p className="text-slate-500">Visit ID: {visitId}</p>
        </div>

        <button
          onClick={generateReport}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          Generate Report
        </button>
      </div>

      {message && <p className="mb-5 rounded-xl bg-white p-3 shadow">{message}</p>}

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow">No reports</div>
        ) : (
          reports.map((report) => {
            const id = report.reportId || report.id;

            return (
              <div key={id} className="rounded-2xl bg-white p-6 shadow">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      {report.reportTitle || "Visit Summary"}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Type: {report.reportType} | Generated: {report.generatedAt}
                    </p>

                    <div className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                      {report.reportContent || "No content preview"}
                    </div>
                  </div>

                  <div className="min-w-40 text-right">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      report.isVisibleToParent
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {report.isVisibleToParent ? "Visible" : "Hidden"}
                    </span>

                    <button
                      onClick={() => toggleVisibility(report)}
                      className="mt-3 block w-full rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"
                    >
                      Toggle visibility
                    </button>

                    {report.pdfUrl && (
                      <a
                        href={report.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm text-white"
                      >
                        Open PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
