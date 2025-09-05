// src/components/Footer.jsx
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#2c3e50",
        color: "#ecf0f1",
        padding: "2rem 1rem",
        marginTop: "20rem",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Contenu principal */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Logo + description */}
        <div>
          <h2 style={{ color: "#1abc9c", marginBottom: "0.8rem" }}>TurboReferral 🚀</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
            La plateforme moderne de gestion et de partage de vos codes de parrainage.  
            Maximisez vos récompenses et simplifiez vos connexions !
          </p>
        </div>

        {/* Navigation rapide */}
        <div>
          <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Navigation</h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
            <li><a href="/" style={{ color: "#bdc3c7", textDecoration: "none" }}>Accueil</a></li>
            <li><a href="#" style={{ color: "#bdc3c7", textDecoration: "none" }}>Contact</a></li>
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div>
          <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Suivez-nous</h3>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <a href="#" style={{ color: "#ecf0f1" }}><FaFacebookF size={20} /></a>
            <a href="#" style={{ color: "#ecf0f1" }}><FaTwitter size={20} /></a>
            <a href="#" style={{ color: "#ecf0f1" }}><FaLinkedinIn size={20} /></a>
            <a href="#" style={{ color: "#ecf0f1" }}><FaGithub size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div
        style={{
          borderTop: "1px solid #34495e",
          marginTop: "2rem",
          paddingTop: "1rem",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#95a5a6",
        }}
      >
        © {new Date().getFullYear()} TurboReferral — Tous droits réservés.
      </div>
    </footer>
  );
}
