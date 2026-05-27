export default function BrandLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          background: "linear-gradient(135deg, #006B8F, #0F9F9A)",
          color: "white",
          display: "grid",
          placeItems: "center",
          fontWeight: 900,
          boxShadow: "0 10px 22px rgba(0, 107, 143, 0.25)",
        }}
      >
        MV
      </div>

      <div>
        <div style={{ fontWeight: 900, fontSize: 18, color: "#004E68" }}>
          MYOVISION ID
        </div>
        <div style={{ fontSize: 12, color: "#6B8793" }}>
          Khoa Mắt - Bệnh viện Đông Đô
        </div>
      </div>
    </div>
  );
}
