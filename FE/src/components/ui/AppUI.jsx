export function Page({ title, sub, actions, children }) {
  return (
    <section>
      <div className="pageHead">
        <div>
          <h1>{title}</h1>
          {sub && <p>{sub}</p>}
        </div>
        {actions && <div className="actions">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

export function Card({ title, children }) {
  return (
    <div className="card">
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}

export function Button({ children, onClick, type = "button", variant = "primary" }) {
  return (
    <button type={type} onClick={onClick} className={`btn ${variant}`}>
      {children}
    </button>
  );
}

export function Field({ label, value, onChange, type = "text", options }) {
  return (
    <label className="field">
      <span>{label}</span>
      {options ? (
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          {options.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      ) : (
        <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

export function TextArea({ label, value, onChange }) {
  return (
    <label className="field wide">
      <span>{label}</span>
      <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function Notice({ type = "info", children }) {
  if (!children) return null;
  return <div className={`notice ${type}`}>{children}</div>;
}

export function Table({ rows = [], columns = [], empty = "Không có dữ liệu" }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            {columns.map((col) => <th key={col.key}>{col.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row, index) => (
            <tr key={row.id || row.patientId || row.visitId || row.userId || index}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : String(row[col.key] ?? "-")}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} className="empty">{empty}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadge({ children }) {
  return <span className="pill">{children}</span>;
}
