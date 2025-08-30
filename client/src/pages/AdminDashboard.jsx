import { useEffect, useState } from "react";
import { useAuthFetch } from "../utils/authFetch";
import ModalUpdateService from "../components/ModalUpdateService";

export default function AdminDashboard() {
  const authFetch = useAuthFetch();

  const [services, setServices] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [servicesRes, referralsRes] = await Promise.all([
          authFetch(`${import.meta.env.VITE_API_URL}/api/admin/services`),
          authFetch(`${import.meta.env.VITE_API_URL}/api/referrals`),
        ]);

        if (!servicesRes.ok) throw new Error("Erreur chargement services");
        if (!referralsRes.ok) throw new Error("Erreur chargement referrals");

        const servicesData = await servicesRes.json();
        const referralsData = await referralsRes.json();

        setServices(servicesData);
        setReferrals(referralsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [authFetch]);

  async function handleValidateService(id) {
    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/admin/services/${id}/validate`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error("Erreur validation service");
      const updated = await res.json();
      setServices(services.map((s) => (s._id === id ? updated.service : s)));
      alert("Service validé avec succès !");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteReferral(id) {
    if (!confirm("Supprimer ce referral ?")) return;
    try {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/referrals/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Erreur suppression referral");
      setReferrals(referrals.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 1100, margin: "2rem auto", fontFamily: "Segoe UI, sans-serif" }}>
      <h2 style={{ color: "#5D4037" }}>Admin Dashboard</h2>

      {/* Services */}
      <section style={{ marginBottom: "2rem" }}>
        <h3>Services</h3>
        {services.length === 0 ? (
          <p>Aucun service</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1rem",
            }}
          >
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Logo</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Nom</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Description</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Statut</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.filter(Boolean).map((service) => (
                <tr key={service._id || service.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                    {service.logo ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${service.logo}`}
                        alt={service.name}
                        style={{ width: 60, height: 60, objectFit: "contain" }}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{service.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {service.description || "—"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {service.isValidated ? "✅ Validé" : "❌ Non validé"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {!service.isValidated && (
                      <button
                        onClick={() => handleValidateService(service._id)}
                        style={{
                          marginRight: "0.5rem",
                          padding: "0.3rem 0.6rem",
                          background: "#27ae60",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Valider
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedService(service)}
                      style={{
                        padding: "0.3rem 0.6rem",
                        background: "#2980b9",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Referrals */}
      <section>
        <h3>Refferals</h3>
        {referrals.length === 0 ? (
          <p>Aucun referral</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1rem",
            }}
          >
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>id</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Service</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Code/Link</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Description</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Créé par</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((ref) => (
                <tr key={ref._id || ref.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{ref._id}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {ref.service?.name || "Service inconnu"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {ref.link ? (
                      <a href={ref.link} target="_blank" rel="noreferrer">
                        {ref.link}
                      </a>
                    ) : (`Code : ${ref.code}`
                    )}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {ref.description || "—"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {ref.user?.username || "Utilisateur inconnu"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      onClick={() => handleDeleteReferral(ref._id)}
                      style={{
                        backgroundColor: "#e74c3c",
                        color: "white",
                        border: "none",
                        padding: "0.3rem 0.6rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          

        )}
        
      </section>

      {/* Modal Update */}
      {selectedService && (
        <ModalUpdateService
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onUpdated={(updatedService) => {
            setServices(
              services.map((s) => (s._id === updatedService._id ? updatedService : s))
            );
          }}
        />
      )}
    </div>
  );
}
