// src/components/ReferralInfo.jsx
import { FaUsers, FaGift, FaShareAlt } from "react-icons/fa";

export default function ReferralInfo() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI, sans-serif",marginTop:"2rem"}}>
      <h2 style={{ textAlign: "center", color: "#2c3e50", marginBottom: "1.5rem" }}>
        Comment ça marche ? 🚀
      </h2>

      {/* Étapes principales */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "#f9f9f9",
            padding: "1.5rem",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <FaUsers size={30} color="#27ae60" />
          <h3 style={{ margin: "0.8rem 0" }}>1. Rejoindre des services</h3>
          <p>
            Inscris-toi sur des plateformes qui proposent des programmes de parrainage.
            Découvre les meilleures offres directement sur notre site.
          </p>
        </div>

        <div
          style={{
            background: "#f9f9f9",
            padding: "1.5rem",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <FaGift size={30} color="#2980b9" />
          <h3 style={{ margin: "0.8rem 0" }}>2. Récupérer vos codes</h3>
          <p>
            Rassemble tous tes codes de parrainage, apprends-en plus sur les récompenses
            et les conditions associées.
          </p>
        </div>

        <div
          style={{
            background: "#f9f9f9",
            padding: "1.5rem",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <FaShareAlt size={30} color="#e67e22" />
          <h3 style={{ margin: "0.8rem 0" }}>3. Partager vos codes</h3>
          <p>
            Diffuse tes codes à tes proches ou sur les réseaux sociaux et gagne des
            récompenses pour chaque parrainage validé.
          </p>
        </div>
      </div>

      {/* Section FAQ courte */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        <div>
          <h4 style={{ color: "#27ae60" }}>💰 Combien puis-je gagner ?</h4>
          <p>
            Les gains varient selon les services : réductions, abonnements gratuits,
            cashbacks ou même récompenses en cryptomonnaies.
          </p>
        </div>

        <div>
          <h4 style={{ color: "#2980b9" }}>🏷️ Code promo vs code de parrainage ?</h4>
          <p>
            Le code promo attire de nouveaux clients. Le code de parrainage permet à un
            utilisateur existant d’inviter ses amis et de recevoir une récompense.
          </p>
        </div>

        <div>
          <h4 style={{ color: "#e67e22" }}>📌 Comment partager ?</h4>
          <p>
            Tu peux partager tes codes via ton profil, sur les réseaux sociaux ou
            directement avec tes amis et ta famille.
          </p>
        </div>
      </div>
    </div>
  );
}
