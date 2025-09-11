import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAuthFetch } from "../utils/authFetch";

export default function PromoteReferralModal({ referral, isOpen, onClose, onCreated }) {
  const authFetch = useAuthFetch();
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/promotions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralId: referral._id,
          dateDebut,
          dateFin,
        }),
      });

      if (!res.ok) throw new Error("Erreur création promotion");
      const data = await res.json();

      if (onCreated) onCreated(data);
      alert("Promotion créée avec succès !");
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div style={{
        background: "#fff",
        borderRadius: "10px",
        padding: "20px",
        width: "400px",
        position: "relative",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            color: "#888",
          }}
        >
          <FaTimes />
        </button>

        <h3 style={{ marginBottom: "1rem", color: "#f39c12" }}>
          Promouvoir : {referral.service?.name || referral._id}
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Date de début
            </label>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              required
              style={{ width: "80%", padding: "8px" ,borderRadius: "10px", border: "1px solid #ccc"}}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Date de fin
            </label>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              required
              style={{ width: "80%", padding: "8px" ,borderRadius: "10px", border: "1px solid #ccc"}}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#f39c12",
              color: "#fff",
              padding: "10px 15px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {loading ? "En cours..." : "Créer la promotion"}
          </button>
        </form>
      </div>
    </div>
  );
}
