import { FaComment, FaStar, FaRegStar, FaStarHalfAlt, FaCrown } from "react-icons/fa";
import TimeAgo from "./TimeAgo";
import ReferralVoteForm from "./ReferralVoteForm";
import ReportReferral from "./ReportReferral";
import { useEffect, useState } from "react";

export default function PremiumReferralCard({ ref, onComment }) {
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    async function fetchAverageRating() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/referralVotes/averages/${ref._id}`
        );
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
        background: "linear-gradient(145deg, #fffbe6, #fff)",
        border: "2px solid #f1c40f",
        borderRadius: "12px",
        padding: "1rem",
        width: "80%",
        boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
        marginBottom: "1rem",
      }}
    >
      {/* Header : avatar + user + couronne */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Avatar rond */}
          <span
            style={{
              backgroundColor: "#3498db",
              color: "white",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {(ref.user?.username?.charAt(0).toUpperCase() || "?")}
          </span>
          <div>
            <div style={{ fontWeight: "600", color: "#2c3e50" }}>
              {ref.user?.username
                ? ref.user.username.charAt(0).toUpperCase() +
                  ref.user.username.slice(1).toLowerCase()
                : ref.user}
            </div>
            <small style={{ color: "#7f8c8d" }}>
              <TimeAgo isoDateString={ref.createdAt} />
            </small>
          </div>
        </div>

        {/* Badge Prime */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f1c40f",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "16px",
            fontSize: "0.8rem",
            fontWeight: "600",
          }}
        >
          <FaCrown style={{ marginRight: "4px" }} /> Promo
        </div>
      </div>

      {/* Code ou lien */}
       {(ref.link || ref.code) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f4f6f7",
            borderRadius: "8px",
            padding: "0.7rem 1rem",
            marginBottom: "0.8rem",
          }}
        >
          <span style={{ fontWeight: "600", color: "#2c3e50" }}>
            {ref.link || ref.code}
          </span>
          {ref.link && (
          <button
            style={{
              background: "#2980b9",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: "500",
            }}
            onClick={() => {
              if (ref.link) window.open(ref.link, "_blank");
            }}
          >
            Ouvrir le lien
          </button>
          )}

        </div>
      )}

      {/* Description */}
      <p style={{ marginBottom: "0.8rem", color: "#2c3e50" }}>
        {ref.description}
      </p>

      {/* Stars + Commentaires */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>{averageRating && renderStars(averageRating * 5)}</div>
        <button
          onClick={() => onComment(ref)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#2980b9",
            fontWeight: "500",
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
          marginTop: "0.8rem",
          padding: "0.6rem",
          borderTop: "1px solid #ecf0f1",
        }}
      >
        <ReferralVoteForm referralId={ref._id} />
        <ReportReferral referralId={ref._id} />
      </div>
    </div>
  );
}
