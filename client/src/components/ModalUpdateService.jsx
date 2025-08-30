import { useState } from "react";
import { useAuthFetch } from "../utils/authFetch";
import CustomToast from "./CustomToast";

export default function ModalUpdateService({ service, onClose, onUpdated }) {
  const authFetch = useAuthFetch();
  const [name, setName] = useState(service.name);
  const [description, setDescription] = useState(service.description || "");
  const [logo, setLogo] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

async function handleUpdate(e) {
  e.preventDefault();

  if (!service || !service._id) {
    alert("Aucun service sélectionné");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (logo) formData.append("logo", logo);

    const res = await authFetch(
      `${import.meta.env.VITE_API_URL}/api/services/${service._id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Erreur mise à jour service");

    const updated = await res.json();
    onUpdated(updated); // le backend retourne directement le service, pas "updated.service"
    setToast({ message: 'Service mis à jour avec succès !', type: 'success' });
    setTimeout(() => {
        onClose();
    }, 1500);
  } catch (err) {
    setToast({ message: err.message, type: 'error' });
    alert(err.message);
  }
}


  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        {toast.message && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}
      <div style={{ background: "white", padding: "2rem", borderRadius: "8px", width: "400px" }}>
        <h3>Modifier le service</h3>
        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Logo</label>
            <input type="file" onChange={(e) => setLogo(e.target.files[0])} />
            {service.logo && (
              <div style={{ marginTop: "0.5rem" }}>
                <img
                  src={`${import.meta.env.VITE_API_URL}${service.logo}`}
                  alt="logo"
                  style={{ width: 60, height: 60, objectFit: "contain" }}
                />
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <button type="button" onClick={onClose} style={{ padding: "0.4rem 0.8rem" }}>
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: "0.4rem 0.8rem",
                background: "#27ae60",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
