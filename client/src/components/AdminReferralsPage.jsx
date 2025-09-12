// src/pages/AdminReferralsPage.jsx
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaCrown } from "react-icons/fa";
import PromoteReferralModal from "./PromoteReferralModal";
export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredReferrals, setFilteredReferrals] = useState([]); // liste filtrée
  const [search, setSearch] = useState("");
  const [selectedReferral, setSelectedReferral] = useState(null); // referral sélectionné pour promotion

  // Fetch des referrals
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/referrals/with-status`);
        const data = await res.json();
        setReferrals(data);
        setFilteredReferrals(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const result = referrals.filter((ref) =>
      (ref.user.username?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (ref.code?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (ref.service.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (ref.link?.toLowerCase() || "").includes(search.toLowerCase())
    );
    setFilteredReferrals(result);
  }, [search, referrals]);



  // Définition des colonnes
  const columns = [
    {
      name: "Nom",
      selector: (row) => row.user.username,
      sortable: true,
    },
    {
      name: "Code/link",
      selector: (row) => row.code || row.link,
      sortable: true,
    },
    {
      name: "service",
      selector: (row) => row.service.name,
      sortable: true,
    },
    {
      name: "Statut Prom",
      cell: (row) => (
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "600",
            color: row.isPromoted ? "#155724" : "#721c24",
            backgroundColor: row.isPromoted ? "#d4edda" : "#f8d7da",
            border: `1px solid ${row.isPromoted ? "#c3e6cb" : "#f5c6cb"}`,
          }}
        >
          {row.isPromoted ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Créé le",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
   {
    name: "Actions",
    cell: (row) => (
        <button
        style={{
            padding: "6px 10px",
            background: "#f39c12", // couleur dorée "royale"
            border: "none",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
        }}
        onClick={() => setSelectedReferral(row)}
        >
        <FaCrown size={16} />
        Promouvoir
        </button>
    ),
    }

  ];

  // Style personnalisé
  const customStyles = {
    headCells: {
      style: {
        fontSize: "15px",
        fontWeight: "600",
        backgroundColor: "#2c3e50",
        color: "#ecf0f1",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        padding: "12px",
      },
    },
    rows: {
      style: {
        minHeight: "55px",
        "&:hover": {
          backgroundColor: "#ecf0f1",
          cursor: "pointer",
        },
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #ccc",
        padding: "10px",
      },
    },
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI, sans-serif" }}>
      <h1 style={{ marginBottom: "1rem", color: "#2c3e50" }}>Gestion des Referrals</h1>
      <DataTable
        columns={columns}
        data={filteredReferrals}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
        fixedHeader
        fixedHeaderScrollHeight="500px"
        customStyles={customStyles}
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Rechercher..."
            onChange={(e) => {
                setSearch(e.target.value);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              width: "250px",
            }}
          />
        }
      />
      <PromoteReferralModal
        referral={selectedReferral}
        isOpen={!!selectedReferral}
        onClose={() => setSelectedReferral(null)}
        onCreated={(newPromo) => {
          console.log("Promo créée :", newPromo);
        }}
      />
    </div>
  );
}
