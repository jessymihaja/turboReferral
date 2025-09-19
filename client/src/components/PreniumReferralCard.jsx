import { FaComment } from "react-icons/fa";
import TimeAgo from "./TimeAgo";
import ReferralVoteForm from "./ReferralVoteForm";
import ReportReferral from "./ReportReferral";
import { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";



export default function PremiumReferralCard({ ref, onComment }) {
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    async function fetchAverageRating() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/referralVotes/averages/${ref._id}`);
        const data = await response.json();
        setAverageRating(data.average);
      } catch (error) {
        console.error("Erreur lors de la récupération de la note moyenne :", error);
      }
    }
    fetchAverageRating();
  }, [ref._id]);
    function renderStars(average) {
      const stars = [];
      const rounded = Math.round(average * 2) / 2;
      for (let i = 1; i <= 5; i++) {
        if (i <= rounded) {
          stars.push(<FaStar key={i} color="#f1c40f" />);
        } else if (i - 0.5 === rounded) {
          stars.push(<FaStarHalfAlt key={i} color="#f1c40f" />);
        } else {
          stars.push(<FaRegStar key={i} color="#f1c40f" />);
        }
      }
      return stars;
    }

  return (
    <div
      style={{
        border: "2px solid #f1c40f",
        borderRadius: "12px",
        background: "linear-gradient(145deg, #fff8e1, #fff)",
        padding: "1rem",
        width: "78%",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        transition: "transform 0.2s",
      }}
    >
      {/* Code ou lien */}
      {ref.link && (
        <div
          style={{
            color: "#b38666",
            backgroundColor: "#fff",
            borderRadius: "28px",
            padding: "0.6rem",
            textAlign: "center",
            fontWeight: "600",
            marginBottom: "0.5rem",
          }}
        >
          <a href={ref.link} target="_blank" rel="noreferrer" style={{ color: "#b38666" }}>
            {ref.link}
          </a>
        </div>
      )}
      {ref.code && (
        <div
          style={{
            color: "#b38666",
            backgroundColor: "#fff",
            borderRadius: "28px",
            padding: "0.6rem",
            textAlign: "center",
            fontWeight: "600",
            marginBottom: "0.5rem",
          }}
        >
          {ref.code}
        </div>
      )}

      {/* Description */}
      <p style={{ fontStyle: "italic", marginBottom: "0.5rem" }}>{ref.description}</p>

      {/* Utilisateur + date */}
      <span style={{ color: "#2c3e50", display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            backgroundColor: "#f39c12",
            color: "white",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {(ref.user?.username?.charAt(0).toUpperCase() || "?")}
        </span>
        <span>
          {ref.user?.username
            ? ref.user.username.charAt(0).toUpperCase() + ref.user.username.slice(1).toLowerCase()
            : ref.user}
        </span>
        <TimeAgo isoDateString={ref.createdAt} />
      </span>

      {/* Votes + Commentaires */}
      <div
        style={{
          marginTop: "0.5rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
        }}
      >
        {averageRating && (
          renderStars(averageRating*5)
        )}

        <button
          onClick={() => onComment(ref)}
          style={{
            padding: "0.5rem 1rem",
            background: "transparent",
            border: "0px solid #ccc",
            cursor: "pointer",
            
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <FaComment /> Commentaires
        </button>
      </div>

      {/* Vote + Report */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "0.5rem",
          backgroundColor: "white",
          padding: "0.5rem",
          borderRadius: "8px",
        }}
      >
        <ReferralVoteForm referralId={ref._id} />
        <ReportReferral referralId={ref._id} />
      </div>
    </div>
  );
}
