import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="rounded-2xl bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold text-red-600">403</h1>
        <p className="mt-2 text-slate-600">B?n không có quy?n truy c?p màn hình này.</p>
        <Link to="/login" className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 text-white">
          Quay l?i dang nh?p
        </Link>
      </div>
    </div>
  );
}
