import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="rounded-2xl bg-white p-8 text-center shadow">
        <h1 className="text-3xl font-bold text-red-600">403</h1>
        <p className="mt-2 text-gray-600">Ban khong co quyen truy cap man hinh nay.</p>
        <Link to="/dashboard" className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white">
          Ve Dashboard
        </Link>
      </div>
    </div>
  );
}
