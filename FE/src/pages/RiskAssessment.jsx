import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  calculateRiskAssessmentApi,
  getRiskAssessmentApi,
  getRiskFactorsApi,
} from "../api/risk.api";

export default function RiskAssessment() {
  const { visitId } = useParams();
  const [risk, setRisk] = useState(null);
  const [factors, setFactors] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRisk();
  }, [visitId]);

  async function loadRisk() {
    try {
      const res = await getRiskAssessmentApi(visitId);
      const data = res.data ?? res;
      setRisk(data);

      const riskId = data?.riskAssessmentId || data?.id;
      if (riskId) {
        const factorRes = await getRiskFactorsApi(riskId);
        const factorData = factorRes.data ?? factorRes;

        if (Array.isArray(factorData)) setFactors(factorData);
        else if (Array.isArray(factorData.items)) setFactors(factorData.items);
        else setFactors([]);
      }
    } catch {
      setRisk(null);
      setFactors([]);
    }
  }

  async function calculateRisk() {
    setMessage("");

    try {
      await calculateRiskAssessmentApi(visitId);
      setMessage("Risk calculated successfully");
      await loadRisk();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Calculate failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to={`/visits/${visitId}`} className="text-blue-600">
            Back to visit
          </Link>
          <h1 className="mt-3 text-3xl font-bold">Risk Assessment</h1>
          <p className="text-slate-500">Visit ID: {visitId}</p>
        </div>

        <button
          onClick={calculateRisk}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          Calculate Risk
        </button>
      </div>

      {message && <p className="mb-5 rounded-xl bg-white p-3 shadow">{message}</p>}

      {!risk ? (
        <div className="rounded-2xl bg-white p-6 shadow">
          No risk assessment yet
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card label="Total Score" value={risk.totalScore ?? "-"} />
            <Card label="Risk Level" value={risk.riskLevel ?? "-"} />
            <Card label="AL/CR Warning" value={risk.alCrWarning ? "Yes" : "No"} />
            <Card label="Progression Warning" value={risk.progressionWarning ? "Yes" : "No"} />
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-3 text-lg font-semibold">Recommendation</h2>
            <p className="whitespace-pre-wrap text-slate-700">
              {risk.recommendation || "No recommendation"}
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left">Factor</th>
                  <th className="px-4 py-3 text-left">Value</th>
                  <th className="px-4 py-3 text-left">Score</th>
                  <th className="px-4 py-3 text-left">Impact</th>
                </tr>
              </thead>
              <tbody>
                {factors.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-10 text-center">
                      No factors
                    </td>
                  </tr>
                ) : (
                  factors.map((factor) => (
                    <tr key={factor.riskFactorId || factor.id} className="border-t">
                      <td className="px-4 py-3">{factor.factorName || factor.factorCode}</td>
                      <td className="px-4 py-3">{factor.factorValue}</td>
                      <td className="px-4 py-3">{factor.score}</td>
                      <td className="px-4 py-3">{factor.impactLevel}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
