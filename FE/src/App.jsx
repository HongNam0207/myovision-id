import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import api, { API_BASE_URL, toItems, unwrap } from "./api/client";
import "./App.css";

const roleLabels = {
  ADMIN: "Admin",
  OPHTHALMOLOGIST: "Bác sĩ nhãn khoa",
  OPTOMETRIST: "Khúc xạ nhãn khoa",
  NURSE: "Điều dưỡng",
  PARENT: "Phụ huynh",
};

const menu = [
  { path: "/screen-catalog", label: "All Screens", roles: ["ADMIN", "OPHTHALMOLOGIST", "OPTOMETRIST", "NURSE", "PARENT"] },
  { path: "/admin/dashboard", label: "Admin Dashboard", roles: ["ADMIN"] },
  { path: "/admin/users", label: "Users", roles: ["ADMIN"] },
  { path: "/admin/roles", label: "Roles & Permissions", roles: ["ADMIN"] },
  { path: "/admin/clinics", label: "Clinics", roles: ["ADMIN"] },
  { path: "/doctor/dashboard", label: "Doctor Dashboard", roles: ["OPHTHALMOLOGIST"] },
  { path: "/nurse/dashboard", label: "Nurse Dashboard", roles: ["NURSE"] },
  { path: "/optometrist/dashboard", label: "Optometrist Dashboard", roles: ["OPTOMETRIST"] },
  { path: "/parent/dashboard", label: "Parent Dashboard", roles: ["PARENT"] },
  { path: "/patients", label: "Patients", roles: ["ADMIN", "NURSE", "OPHTHALMOLOGIST", "OPTOMETRIST"] },
  { path: "/parents", label: "Parents", roles: ["ADMIN", "NURSE"] },
  { path: "/visits", label: "Visit Queue", roles: ["ADMIN", "NURSE", "OPHTHALMOLOGIST", "OPTOMETRIST"] },
  { path: "/appointments", label: "Appointments", roles: ["ADMIN", "NURSE", "OPHTHALMOLOGIST", "PARENT"] },
  { path: "/notifications", label: "Notifications", roles: ["ADMIN", "PARENT"] },
  { path: "/parent/children", label: "My Children", roles: ["PARENT"] },
  { path: "/reports", label: "Reports", roles: ["ADMIN", "OPHTHALMOLOGIST", "PARENT"] },
];

function getStoredUser() {
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
}
function getRole(user = getStoredUser()) {
  const r = user?.roleCode || user?.role || user?.roles?.[0]?.roleCode || user?.roles?.[0];
  return typeof r === "string" ? r : "";
}
function firstDashboard(role) {
  return role === "ADMIN" ? "/admin/dashboard" : role === "OPHTHALMOLOGIST" ? "/doctor/dashboard" : role === "OPTOMETRIST" ? "/optometrist/dashboard" : role === "NURSE" ? "/nurse/dashboard" : role === "PARENT" ? "/parent/dashboard" : "/login";
}
function normalizeUser(payload) {
  const data = unwrap(payload) || payload || {};
  const token = data.accessToken || data.token || data.access_token || data.jwt;
  const user = data.user || data.currentUser || data;
  const role = data.roleCode || data.role || user.roleCode || user.role || user.roles?.[0]?.roleCode || user.roles?.[0];
  return { token, user: { ...user, roleCode: role } };
}
function errMsg(e) { return e?.response?.data?.message || e?.response?.data?.title || e?.message || "Có lỗi xảy ra"; }
function dateText(v) { return v ? new Date(v).toLocaleString("vi-VN") : "-"; }

function Guard({ roles, children }) {
  const token = localStorage.getItem("access_token");
  const role = getRole();
  if (!token) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return children;
}

function Layout({ children }) {
  const nav = useNavigate();
  const user = getStoredUser() || {};
  const role = getRole(user);
  const menus = menu.filter((x) => !x.roles || x.roles.includes(role));
  return <div className="shell">
    <aside className="sidebar">
      <Link to={firstDashboard(role)} className="brand">MYOVISION ID</Link>
      <div className="userBox"><b>{user.fullName || user.full_name || user.username || "User"}</b><span>{roleLabels[role] || role}</span></div>
      <nav>{menus.map((m) => <NavLink key={m.path} to={m.path} className={({isActive}) => `navItem ${isActive ? "active" : ""}`}>{m.label}</NavLink>)}</nav>
      <button className="logout" onClick={() => { localStorage.clear(); nav("/login"); }}>Đăng xuất</button>
    </aside>
    <main className="main"><div className="top"><div><b>Khoa Mắt - Bệnh viện Đông Đô</b><span>API: {API_BASE_URL}</span></div><span className="pill">{role}</span></div>{children}</main>
  </div>;
}
function Page({ title, sub, actions, children }) { return <section><div className="pageHead"><div><h1>{title}</h1>{sub && <p>{sub}</p>}</div><div className="actions">{actions}</div></div>{children}</section>; }
function Card({ children }) { return <div className="card">{children}</div>; }
function Button({ children, onClick, type="button", variant="primary" }) { return <button type={type} onClick={onClick} className={`btn ${variant}`}>{children}</button>; }
function Field({ label, value, onChange, type="text", options }) { return <label className="field"><span>{label}</span>{options ? <select value={value ?? ""} onChange={(e)=>onChange(e.target.value)}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select> : <input type={type} value={value ?? ""} onChange={(e)=>onChange(e.target.value)} />}</label>; }
function TextArea({ label, value, onChange }) { return <label className="field wide"><span>{label}</span><textarea value={value ?? ""} onChange={(e)=>onChange(e.target.value)} /></label>; }
function Status({ loading, error, ok }) { return <>{loading && <div className="notice">Đang tải dữ liệu...</div>}{error && <div className="notice error">{error}</div>}{ok && <div className="notice ok">{ok}</div>}</>; }
function Table({ rows, columns, empty="Không có dữ liệu" }) { return <div className="tableWrap"><table><thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}</tr></thead><tbody>{rows.length ? rows.map((r,i)=><tr key={r.id || r.patientId || r.visitId || r.userId || r.clinicId || r.appointmentId || i}>{columns.map(c=><td key={c.key}>{c.render ? c.render(r) : String(r[c.key] ?? "-")}</td>)}</tr>) : <tr><td colSpan={columns.length} className="empty">{empty}</td></tr>}</tbody></table></div>; }

function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ usernameOrEmail: "admin", password: "123456" });
  const [error, setError] = useState("");

  async function submit(e) {
    if (e) e.preventDefault();

    setError("");

    try {
      const payload = {
        usernameOrEmail: form.usernameOrEmail,
        password: form.password,
      };

      console.log("CALL LOGIN API", payload);

      const res = await api.post("/auth/login", payload);
      const body = res?.data ?? res;

      console.log("LOGIN RESPONSE", body);

      const { token, user } = normalizeUser(body);

      if (!token) {
        throw new Error("API login không trả accessToken/token");
      }

      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      nav(firstDashboard(getRole(user)), { replace: true });
    } catch (e) {
      console.error("LOGIN ERROR", e);
      setError(errMsg(e));
    }
  }

  return (
    <div className="login">
      <Card>
        <h1>MYOVISION ID</h1>
        <p>Đăng nhập để test FE ghép Backend.</p>

        <form onSubmit={submit} className="form one">
          <Field
            label="Username hoặc Email"
            value={form.usernameOrEmail}
            onChange={(v) => setForm({ ...form, usernameOrEmail: v })}
          />

          <Field
            label="Mật khẩu"
            type="password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
          />

          <Status error={error} />

          <button
            type="button"
            className="btn primary"
            onClick={submit}
          >
            Đăng nhập
          </button>

          <p className="hint">
            Demo: admin / doctor01 / optometrist01 / nurse01 / parent01 — mật khẩu 123456
          </p>
        </form>
      </Card>
    </div>
  );
}
function Dashboard({ kind }) {
  const map = {
    admin: ["/dashboard/admin/overview", "Tổng quan Admin"],
    doctor: ["/dashboard/doctor/today-visits", "Lượt khám hôm nay"],
    nurse: ["/dashboard/nurse/waiting-intake", "Chờ tiếp nhận"],
    optometrist: ["/dashboard/optometrist/waiting-measurement", "Chờ đo mắt"],
    parent: ["/dashboard/parent/children-summary", "Con của tôi"],
  };
  const [data, setData] = useState(null), [error,setError]=useState(""), [loading,setLoading]=useState(true);
  useEffect(()=>{ setLoading(true); api.get(map[kind][0]).then(r=>setData(unwrap(r))).catch(e=>setError(errMsg(e))).finally(()=>setLoading(false)); },[kind]);
  const cards = typeof data === "object" && data ? Object.entries(data).slice(0,12) : [];
  return <Layout><Page title={map[kind][1]} sub="Dashboard đọc trực tiếp từ API Backend"><Status loading={loading} error={error}/><div className="grid cards">{cards.map(([k,v])=><Card key={k}><span className="metricLabel">{k}</span><b className="metric">{typeof v === "object" ? JSON.stringify(v) : String(v ?? "-")}</b></Card>)}</div><JsonBlock data={data}/></Page></Layout>;
}

function ResourceList({ title, endpoint, columns, createForm, createEndpoint, transformCreate }) {
  const [rows,setRows]=useState([]), [loading,setLoading]=useState(true), [error,setError]=useState(""), [ok,setOk]=useState(""), [show,setShow]=useState(false);
  const [form,setForm]=useState(createForm?.initial || {});
  async function load(){ setLoading(true); setError(""); try{ const r=await api.get(endpoint); setRows(toItems(r)); }catch(e){setError(errMsg(e));} finally{setLoading(false);} }
  useEffect(()=>{load();},[endpoint]);
  async function save(e){ e.preventDefault(); setOk(""); setError(""); try{ await api.post(createEndpoint || endpoint, transformCreate ? transformCreate(form) : form); setOk("Đã lưu thành công"); setShow(false); setForm(createForm.initial); load(); }catch(e){setError(errMsg(e));} }
  return <Layout><Page title={title} sub={endpoint} actions={createForm && <Button onClick={()=>setShow(!show)}>{show ? "Đóng form" : "Tạo mới"}</Button>}><Status loading={loading} error={error} ok={ok}/>{show && <Card><form className="form" onSubmit={save}>{createForm.fields.map(f => f.type === "textarea" ? <TextArea key={f.name} label={f.label} value={form[f.name]} onChange={(v)=>setForm({...form,[f.name]:v})}/> : <Field key={f.name} label={f.label} type={f.type || "text"} options={f.options} value={form[f.name]} onChange={(v)=>setForm({...form,[f.name]:v})}/>) }<Button type="submit">Lưu</Button></form></Card>}<Table rows={rows} columns={columns}/></Page></Layout>;
}

function Patients() { return <ResourceList title="Patient List" endpoint="/patients" columns={[{key:"patientCode",label:"Mã"},{key:"fullName",label:"Họ tên",render:r=><Link className="link" to={`/patients/${r.patientId}`}>{r.fullName}</Link>},{key:"dateOfBirth",label:"Ngày sinh"},{key:"gender",label:"Giới tính"},{key:"status",label:"Status"}]} createForm={{initial:{patientCode:"BN"+Date.now().toString().slice(-5),fullName:"",dateOfBirth:"2015-01-01",gender:"Nam",clinicId:1,address:"Hà Nội"},fields:[{name:"patientCode",label:"Mã BN"},{name:"fullName",label:"Họ tên"},{name:"dateOfBirth",label:"Ngày sinh",type:"date"},{name:"gender",label:"Giới tính",options:["Nam","Nữ"]},{name:"clinicId",label:"Clinic ID",type:"number"},{name:"address",label:"Địa chỉ"}]}} transformCreate={(f)=>({...f,clinicId:Number(f.clinicId)})}/>; }
function Parents() { return <ResourceList title="Parent Management" endpoint="/parents" columns={[{key:"parentId",label:"ID"},{key:"fullName",label:"Họ tên"},{key:"relationship",label:"Quan hệ"},{key:"phone",label:"Phone"},{key:"email",label:"Email"}]} createForm={{initial:{fullName:"",relationship:"Bố",phone:"0900000000",email:"",address:"Hà Nội"},fields:[{name:"fullName",label:"Họ tên"},{name:"relationship",label:"Quan hệ"},{name:"phone",label:"Phone"},{name:"email",label:"Email"},{name:"address",label:"Địa chỉ"}]}}/>; }
function Visits() { return <ResourceList title="Visit Queue" endpoint="/visits" columns={[{key:"visitCode",label:"Mã visit",render:r=><Link className="link" to={`/visits/${r.visitId}`}>{r.visitCode}</Link>},{key:"patientName",label:"Bệnh nhi",render:r=>r.patientName||r.patient?.fullName||r.patientId},{key:"visitType",label:"Loại"},{key:"status",label:"Status"},{key:"visitDate",label:"Ngày",render:r=>dateText(r.visitDate)}]} createForm={{initial:{visitCode:"VISIT-"+Date.now().toString().slice(-5),patientId:1,clinicId:1,visitType:"INITIAL",chiefComplaint:"Khám kiểm soát cận thị",assignedDoctorId:2},fields:[{name:"visitCode",label:"Mã visit"},{name:"patientId",label:"Patient ID",type:"number"},{name:"clinicId",label:"Clinic ID",type:"number"},{name:"visitType",label:"Loại",options:["INITIAL","FOLLOW_UP"]},{name:"assignedDoctorId",label:"Doctor ID",type:"number"},{name:"chiefComplaint",label:"Lý do khám",type:"textarea"}]}} transformCreate={(f)=>({...f,patientId:Number(f.patientId),clinicId:Number(f.clinicId)||null,assignedDoctorId:Number(f.assignedDoctorId)||null})}/>; }
function Users() { return <ResourceList title="User Management" endpoint="/users" columns={[{key:"userId",label:"ID"},{key:"username",label:"Username"},{key:"fullName",label:"Họ tên"},{key:"email",label:"Email"},{key:"status",label:"Status"}]} createForm={{initial:{username:"user"+Date.now().toString().slice(-4),password:"123456",fullName:"",email:"",phone:"0900000000",gender:"Nam",roleIds:[]},fields:[{name:"username",label:"Username"},{name:"password",label:"Password",type:"password"},{name:"fullName",label:"Họ tên"},{name:"email",label:"Email"},{name:"phone",label:"Phone"},{name:"gender",label:"Giới tính",options:["Nam","Nữ"]}]}}/>; }
function Roles() { return <Layout><Page title="Role & Permission" sub="/roles + /permissions"><SplitFetch left={{title:"Roles",endpoint:"/roles"}} right={{title:"Permissions",endpoint:"/permissions"}}/></Page></Layout>; }
function Clinics() { return <ResourceList title="Clinic Management" endpoint="/clinics" columns={[{key:"clinicCode",label:"Code"},{key:"clinicName",label:"Tên"},{key:"address",label:"Địa chỉ"},{key:"phone",label:"Phone"},{key:"isActive",label:"Active",render:r=>String(r.isActive)}]} createForm={{initial:{clinicCode:"CL"+Date.now().toString().slice(-4),clinicName:"",address:"",phone:"",email:""},fields:[{name:"clinicCode",label:"Code"},{name:"clinicName",label:"Tên clinic"},{name:"address",label:"Địa chỉ"},{name:"phone",label:"Phone"},{name:"email",label:"Email"}]}}/>; }
function Appointments() { return <ResourceList title="Appointment Management" endpoint="/appointments" columns={[{key:"appointmentId",label:"ID"},{key:"patientName",label:"Bệnh nhi",render:r=>r.patientName||r.patientId},{key:"doctorName",label:"Bác sĩ",render:r=>r.doctorName||r.doctorId},{key:"appointmentDatetime",label:"Thời gian",render:r=>dateText(r.appointmentDatetime)},{key:"status",label:"Status"}]} createForm={{initial:{patientId:1,clinicId:1,doctorId:2,appointmentDatetime:new Date(Date.now()+86400000).toISOString().slice(0,16),appointmentType:"FOLLOW_UP",reason:"Tái khám"},fields:[{name:"patientId",label:"Patient ID",type:"number"},{name:"clinicId",label:"Clinic ID",type:"number"},{name:"doctorId",label:"Doctor ID",type:"number"},{name:"appointmentDatetime",label:"Thời gian",type:"datetime-local"},{name:"appointmentType",label:"Loại",options:["FOLLOW_UP","INITIAL"]},{name:"reason",label:"Lý do"}]}} transformCreate={(f)=>({...f,patientId:Number(f.patientId),clinicId:Number(f.clinicId)||null,doctorId:Number(f.doctorId)||null,appointmentDatetime:new Date(f.appointmentDatetime).toISOString()})}/>; }
function Notifications() { return <ResourceList title="Notification Center" endpoint="/parent-notifications" columns={[{key:"notificationId",label:"ID"},{key:"title",label:"Tiêu đề"},{key:"notificationType",label:"Loại"},{key:"isRead",label:"Đã đọc",render:r=>String(r.isRead)},{key:"createdAt",label:"Ngày",render:r=>dateText(r.createdAt)}]}/>; }
function Reports() { return <Layout><Page title="Reports" sub="Nhập Visit ID để xem/generate report"><VisitReport /></Page></Layout>; }

function PatientDetail() {
  const { patientId } = useParams();
  return <Layout><Page title={`Patient Detail #${patientId}`} sub="Summary, timeline, history, treatment, progress"><SplitFetch left={{title:"Thông tin",endpoint:`/patients/${patientId}`}} right={{title:"Timeline",endpoint:`/patients/${patientId}/timeline`}}/><div className="grid two"><ApiPanel title="Summary" endpoint={`/patients/${patientId}/summary`}/><ApiPanel title="Progress Chart" endpoint={`/patients/${patientId}/progress-chart`}/><ApiPanel title="Treatment Plans" endpoint={`/patients/${patientId}/treatment-plans`}/><ApiPanel title="Measurement History" endpoint={`/patients/${patientId}/measurement-history`}/></div></Page></Layout>;
}
function VisitDetail() {
  const { visitId } = useParams();
  return <Layout><Page title={`Visit Full Record #${visitId}`} sub="Điều hướng toàn bộ workflow lượt khám"><div className="quick">{[["Clinical Intake","intake"],["Refraction","refraction"],["Biometric","biometric"],["Binocular Vision","binocular-vision"],["Risk","risk"],["Diagnosis","diagnosis"],["Treatment Plan","treatment-plan"],["Reports","reports"]].map(([a,b])=><Link key={b} className="btn ghost" to={`/visits/${visitId}/${b}`}>{a}</Link>)}</div><Workflow visitId={visitId}/><SplitFetch left={{title:"Visit",endpoint:`/visits/${visitId}`}} right={{title:"Full record",endpoint:`/visits/${visitId}/full-record`}}/><ApiPanel title="Status logs" endpoint={`/visits/${visitId}/status-logs`}/></Page></Layout>;
}
function Workflow({ visitId }) { const actions=["start-intake","finish-intake","start-measurement","finish-measurement","start-diagnosis","finish-diagnosis","complete","cancel"]; const [msg,setMsg]=useState(""); async function run(a){try{await api.post(`/visits/${visitId}/${a}`); setMsg(`Đã chạy ${a}`);}catch(e){setMsg(errMsg(e));}} return <Card><h3>Workflow actions</h3><div className="quick">{actions.map(a=><Button key={a} variant="ghost" onClick={()=>run(a)}>{a}</Button>)}</div>{msg&&<div className="notice">{msg}</div>}</Card>; }

function ClinicalIntake() { const { visitId }=useParams(); return <VisitForm title="Clinical Intake" getEndpoint={`/visits/${visitId}/clinical-intake`} postEndpoint={`/visits/${visitId}/clinical-intake`} completeEndpoint={`/visits/${visitId}/clinical-intake/complete`} back={`/visits/${visitId}`} initial={{heightCm:"",weightKg:"",bloodPressure:"",reasonForVisit:"",ageMyopiaDetected:"",nearWorkHoursPerDay:"",outdoorHoursPerDay:"",screenTimeHoursPerDay:"",readingDistanceCm:"",familyHistoryNote:"",allergyHistory:"",systemicDiseaseHistory:"",eyeDiseaseHistory:""}} fields={["heightCm","weightKg","bloodPressure","reasonForVisit","ageMyopiaDetected","nearWorkHoursPerDay","outdoorHoursPerDay","screenTimeHoursPerDay","readingDistanceCm","familyHistoryNote","allergyHistory","systemicDiseaseHistory","eyeDiseaseHistory"]}/>; }
function Refraction() { const { visitId }=useParams(); return <VisitListForm title="Refraction" getEndpoint={`/visits/${visitId}/refractions`} postEndpoint={`/visits/${visitId}/refractions`} back={`/visits/${visitId}`} initial={{eyeSide:"OD",measurementType:"AUTO",sph:"-1.00",cyl:"-0.50",axisDegree:"90",va:"8/10",bcva:"10/10",note:""}} fields={[{name:"eyeSide",options:["OD","OS"]},{name:"measurementType",options:["AUTO","SUBJECTIVE","CYCLOPLEGIC","RETINOSCOPY"]},"sph","cyl","axisDegree","va","bcva","note"]}/>; }
function Biometric() { const { visitId }=useParams(); return <VisitListForm title="Biometric" getEndpoint={`/visits/${visitId}/biometrics`} postEndpoint={`/visits/${visitId}/biometrics`} back={`/visits/${visitId}`} initial={{eyeSide:"OD",axialLengthMm:"24.10",k1:"43",k2:"44",kmax:"45",pachymetryUm:"540",pupilSizeMm:"4",tbutSeconds:"10",iopMmhg:"15",cornealRadiusMm:"7.8",alCrRatio:"3.1",deviceName:"Demo device",note:""}} fields={[{name:"eyeSide",options:["OD","OS"]},"axialLengthMm","k1","k2","kmax","pachymetryUm","pupilSizeMm","tbutSeconds","iopMmhg","cornealRadiusMm","alCrRatio","deviceName","note"]}/>; }
function BinocularVision() { const { visitId }=useParams(); return <VisitForm title="Binocular Vision" getEndpoint={`/visits/${visitId}/binocular-vision`} postEndpoint={`/visits/${visitId}/binocular-vision`} back={`/visits/${visitId}`} initial={{aaOd:"",aaOs:"",memOd:"",memOs:"",facilityOd:"",facilityOs:"",coverTestDistance:"",coverTestNear:"",acARatio:"",npcCm:"",note:""}} fields={["aaOd","aaOs","memOd","memOs","facilityOd","facilityOs","coverTestDistance","coverTestNear","acARatio","npcCm","note"]}/>; }
function Diagnosis() { const { visitId }=useParams(); return <VisitForm title="Diagnosis" getEndpoint={`/visits/${visitId}/diagnosis`} postEndpoint={`/visits/${visitId}/diagnosis`} back={`/visits/${visitId}`} initial={{diagnosisCode:"MYOPIA",diagnosisName:"Cận thị",clinicalConclusion:"",myopiaType:"",severityLevel:"MEDIUM",progressionStatus:"STABLE"}} fields={["diagnosisCode","diagnosisName","clinicalConclusion","myopiaType",{name:"severityLevel",options:["LOW","MEDIUM","HIGH"]},{name:"progressionStatus",options:["STABLE","PROGRESSING"]}]}/>; }
function RiskAssessment() { const { visitId }=useParams(); const [data,setData]=useState(null),[msg,setMsg]=useState(""); async function calc(){try{setData(unwrap(await api.post(`/visits/${visitId}/risk-assessment/calculate`,{}))); setMsg("Đã tính nguy cơ");}catch(e){setMsg(errMsg(e));}} return <Layout><Page title="Risk Assessment" sub={`Visit #${visitId}`} actions={<Link className="btn ghost" to={`/visits/${visitId}`}>Back</Link>}><Button onClick={calc}>Calculate Risk</Button>{msg&&<div className="notice">{msg}</div>}<ApiPanel title="Risk result" endpoint={`/visits/${visitId}/risk-assessment`} refreshKey={msg}/><JsonBlock data={data}/></Page></Layout>; }
function TreatmentPlan() { const { visitId }=useParams(); return <VisitForm title="Treatment Plan" getEndpoint={`/visits/${visitId}/full-record`} postEndpoint={`/visits/${visitId}/treatment-plans`} back={`/visits/${visitId}`} initial={{planName:"Kiểm soát cận thị",treatmentGoal:"Giảm tốc độ tăng AL",startDate:new Date().toISOString().slice(0,10),endDate:"",status:"ACTIVE",complianceTarget:"Tuân thủ 80%",followUpIntervalDays:"90",doctorInstruction:""}} fields={["planName","treatmentGoal",{name:"startDate",type:"date"},{name:"endDate",type:"date"},{name:"status",options:["ACTIVE","INACTIVE","COMPLETED"]},"complianceTarget","followUpIntervalDays","doctorInstruction"]}/>; }
function ParentChildren() { return <Layout><Page title="Parent Portal - My Children" sub="Các API dành cho phụ huynh"><ApiPanel title="My children" endpoint="/parent-portal/my-children"/></Page></Layout>; }
function VisitReport() { const [visitId,setVisitId]=useState("1"), [msg,setMsg]=useState(""); return <><Card><div className="form inline"><Field label="Visit ID" value={visitId} onChange={setVisitId}/><Button onClick={async()=>{try{await api.post(`/visits/${visitId}/reports/generate`,{}); setMsg("Đã generate report");}catch(e){setMsg(errMsg(e));}}}>Generate</Button></div>{msg&&<div className="notice">{msg}</div>}</Card><ApiPanel title="Visit reports" endpoint={`/visits/${visitId}/reports`} refreshKey={msg}/></>; }

function VisitForm({ title, getEndpoint, postEndpoint, completeEndpoint, back, initial, fields }) {
  const [form,setForm]=useState(initial), [old,setOld]=useState(null), [error,setError]=useState(""), [ok,setOk]=useState("");
  useEffect(()=>{api.get(getEndpoint).then(r=>{setOld(unwrap(r)); if(unwrap(r)) setForm(f=>({...f,...unwrap(r)}));}).catch(()=>{});},[getEndpoint]);
  async function save(e){e.preventDefault(); setError(""); setOk(""); try{ await api.post(postEndpoint, clean(form)); setOk("Đã lưu thành công"); }catch(e){setError(errMsg(e));}}
  return <Layout><Page title={title} sub={postEndpoint} actions={<Link className="btn ghost" to={back}>Back</Link>}><Status error={error} ok={ok}/><Card><form className="form" onSubmit={save}>{fields.map(renderField(form,setForm))}<Button type="submit">Lưu</Button>{completeEndpoint&&<Button variant="ghost" onClick={async()=>{try{await api.post(completeEndpoint);setOk("Đã complete");}catch(e){setError(errMsg(e));}}}>Complete</Button>}</form></Card><JsonBlock data={old}/></Page></Layout>;
}
function VisitListForm({ title, getEndpoint, postEndpoint, back, initial, fields }) { const [items,setItems]=useState([]),[form,setForm]=useState(initial),[error,setError]=useState(""),[ok,setOk]=useState(""); async function load(){try{setItems(toItems(await api.get(getEndpoint)));}catch(e){setError(errMsg(e));}} useEffect(()=>{load();},[getEndpoint]); async function save(e){e.preventDefault();setError("");setOk("");try{await api.post(postEndpoint, clean(form));setOk("Đã lưu thành công");load();}catch(e){setError(errMsg(e));}} return <Layout><Page title={title} sub={postEndpoint} actions={<Link className="btn ghost" to={back}>Back</Link>}><Status error={error} ok={ok}/><Card><form className="form" onSubmit={save}>{fields.map(renderField(form,setForm))}<Button type="submit">Thêm dữ liệu</Button></form></Card><JsonBlock data={items}/></Page></Layout>; }
function renderField(form,setForm){ return (f)=>{ const cfg=typeof f==="string"?{name:f}:f; const value=form[cfg.name]; return cfg.name.toLowerCase().includes("note") || cfg.name.toLowerCase().includes("conclusion") || cfg.name.toLowerCase().includes("instruction") ? <TextArea key={cfg.name} label={cfg.name} value={value} onChange={(v)=>setForm({...form,[cfg.name]:v})}/> : <Field key={cfg.name} label={cfg.name} type={cfg.type || (cfg.name.toLowerCase().includes("date")?"date":"text")} options={cfg.options} value={value} onChange={(v)=>setForm({...form,[cfg.name]:v})}/>; }; }
function clean(obj){ const out={}; Object.entries(obj).forEach(([k,v])=>{ if(v==="") out[k]=null; else if(["Id","Cm","Kg","Mm","Um","Ratio","Days","Degree","sph","cyl","k1","k2","kmax","aa","mem","facility","iop","tbut","pupil","axial"].some(x=>k.toLowerCase().includes(x.toLowerCase())) && !isNaN(Number(v))) out[k]=Number(v); else out[k]=v; }); return out; }

function ApiPanel({ title, endpoint, refreshKey }) { const [data,setData]=useState(null),[error,setError]=useState(""),[loading,setLoading]=useState(true); useEffect(()=>{setLoading(true);setError("");api.get(endpoint).then(r=>setData(unwrap(r))).catch(e=>setError(errMsg(e))).finally(()=>setLoading(false));},[endpoint,refreshKey]); return <Card><h3>{title}</h3><small>{endpoint}</small><Status loading={loading} error={error}/><JsonBlock data={data}/></Card>; }
function SplitFetch({ left, right }) { return <div className="grid two"><ApiPanel {...left}/><ApiPanel {...right}/></div>; }
function JsonBlock({ data }) { return <pre className="json">{JSON.stringify(data ?? null, null, 2)}</pre>; }

function ScreenCatalog(){
  const screens = [
    ["Login","POST /api/auth/login","All"],["My Profile","GET /api/auth/me","All"],["User Management","GET/POST /api/users","ADMIN"],["Role & Permission","GET /api/roles, /api/permissions","ADMIN"],["Clinic Management","GET/POST /api/clinics","ADMIN"],
    ["Patient List","GET /api/patients","NURSE/DOCTOR/ADMIN"],["Patient Detail","GET /api/patients/{id}","Clinical roles"],["Parent Management","GET/POST /api/parents","NURSE/ADMIN"],["Visit Queue","GET /api/visits","Clinical roles"],["Visit Detail","GET /api/visits/{id}/full-record","Clinical roles"],
    ["Workflow Actions","POST /api/visits/{id}/start-*","NURSE/OPTOMETRIST/DOCTOR"],["Clinical Intake","GET/POST /api/visits/{id}/clinical-intake","NURSE"],["Refraction","GET/POST /api/visits/{id}/refractions","OPTOMETRIST"],["Biometric","GET/POST /api/visits/{id}/biometrics","OPTOMETRIST"],["Binocular Vision","GET/POST /api/visits/{id}/binocular-vision","OPTOMETRIST"],
    ["Risk Assessment","POST /api/visits/{id}/risk-assessment/calculate","DOCTOR"],["Diagnosis","GET/POST /api/visits/{id}/diagnosis","DOCTOR"],["Doctor Notes","GET/POST /api/visits/{id}/doctor-notes","DOCTOR"],["Treatment Plan","GET/POST /api/treatment-plans","DOCTOR"],["Progress Snapshot","GET/POST /api/patients/{id}/progress-snapshots","DOCTOR/PARENT"],
    ["Appointment","GET/POST /api/appointments","NURSE/DOCTOR/PARENT"],["Notification Center","GET /api/parent-notifications","PARENT/ADMIN"],["Parent Portal Children","GET /api/parent-portal/my-children","PARENT"],["Medical Report","GET/POST /api/visits/{id}/reports","DOCTOR/PARENT"],["Dashboard by Role","GET /api/dashboard/...","All roles"]
  ];
  return <Layout><Page title="All Screens Catalog" sub="Danh mục màn hình FE đã map theo API Backend hiện có"><Table rows={screens.map((s,i)=>({id:i+1,name:s[0],api:s[1],role:s[2]}))} columns={[{key:"id",label:"#"},{key:"name",label:"Màn hình"},{key:"api",label:"API"},{key:"role",label:"Role"}]}/></Page></Layout>;
}

function Unauthorized(){return <div className="login"><Card><h1>403</h1><p>Tài khoản không có quyền vào màn này.</p><Link className="btn" to={firstDashboard(getRole())}>Về dashboard</Link></Card></div>}

export default function App() {
  return <Routes>
    <Route path="/" element={<Navigate to={localStorage.getItem("access_token") ? firstDashboard(getRole()) : "/login"} replace />} />
    <Route path="/login" element={<Login/>}/><Route path="/unauthorized" element={<Unauthorized/>}/><Route path="/screen-catalog" element={<Guard roles={["ADMIN","OPHTHALMOLOGIST","OPTOMETRIST","NURSE","PARENT"]}><ScreenCatalog/></Guard>}/>
    <Route path="/admin/dashboard" element={<Guard roles={["ADMIN"]}><Dashboard kind="admin"/></Guard>}/>
    <Route path="/doctor/dashboard" element={<Guard roles={["OPHTHALMOLOGIST"]}><Dashboard kind="doctor"/></Guard>}/>
    <Route path="/nurse/dashboard" element={<Guard roles={["NURSE"]}><Dashboard kind="nurse"/></Guard>}/>
    <Route path="/optometrist/dashboard" element={<Guard roles={["OPTOMETRIST"]}><Dashboard kind="optometrist"/></Guard>}/>
    <Route path="/parent/dashboard" element={<Guard roles={["PARENT"]}><Dashboard kind="parent"/></Guard>}/>
    <Route path="/admin/users" element={<Guard roles={["ADMIN"]}><Users/></Guard>}/><Route path="/admin/roles" element={<Guard roles={["ADMIN"]}><Roles/></Guard>}/><Route path="/admin/clinics" element={<Guard roles={["ADMIN"]}><Clinics/></Guard>}/>
    <Route path="/patients" element={<Guard roles={["ADMIN","NURSE","OPHTHALMOLOGIST","OPTOMETRIST"]}><Patients/></Guard>}/><Route path="/patients/:patientId" element={<Guard roles={["ADMIN","NURSE","OPHTHALMOLOGIST","OPTOMETRIST"]}><PatientDetail/></Guard>}/><Route path="/parents" element={<Guard roles={["ADMIN","NURSE"]}><Parents/></Guard>}/>
    <Route path="/visits" element={<Guard roles={["ADMIN","NURSE","OPHTHALMOLOGIST","OPTOMETRIST"]}><Visits/></Guard>}/><Route path="/visits/:visitId" element={<Guard roles={["ADMIN","NURSE","OPHTHALMOLOGIST","OPTOMETRIST"]}><VisitDetail/></Guard>}/>
    <Route path="/visits/:visitId/intake" element={<Guard roles={["ADMIN","NURSE","OPHTHALMOLOGIST"]}><ClinicalIntake/></Guard>}/><Route path="/visits/:visitId/refraction" element={<Guard roles={["OPTOMETRIST","OPHTHALMOLOGIST","ADMIN"]}><Refraction/></Guard>}/><Route path="/visits/:visitId/biometric" element={<Guard roles={["OPTOMETRIST","OPHTHALMOLOGIST","ADMIN"]}><Biometric/></Guard>}/><Route path="/visits/:visitId/binocular-vision" element={<Guard roles={["OPTOMETRIST","OPHTHALMOLOGIST","ADMIN"]}><BinocularVision/></Guard>}/><Route path="/visits/:visitId/risk" element={<Guard roles={["OPHTHALMOLOGIST","ADMIN"]}><RiskAssessment/></Guard>}/><Route path="/visits/:visitId/diagnosis" element={<Guard roles={["OPHTHALMOLOGIST","ADMIN"]}><Diagnosis/></Guard>}/><Route path="/visits/:visitId/treatment-plan" element={<Guard roles={["OPHTHALMOLOGIST","ADMIN"]}><TreatmentPlan/></Guard>}/><Route path="/visits/:visitId/reports" element={<Guard roles={["OPHTHALMOLOGIST","ADMIN","PARENT"]}><Reports/></Guard>}/>
    <Route path="/appointments" element={<Guard roles={["ADMIN","NURSE","OPHTHALMOLOGIST","PARENT"]}><Appointments/></Guard>}/><Route path="/notifications" element={<Guard roles={["ADMIN","PARENT"]}><Notifications/></Guard>}/><Route path="/parent/children" element={<Guard roles={["PARENT"]}><ParentChildren/></Guard>}/><Route path="/reports" element={<Guard roles={["ADMIN","OPHTHALMOLOGIST","PARENT"]}><Reports/></Guard>}/>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
