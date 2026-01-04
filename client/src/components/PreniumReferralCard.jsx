import { FaComment, FaThumbsUp, FaThumbsDown, FaCrown, FaCopy, FaCheck, FaExternalLinkAlt, FaGlobe } from "react-icons/fa";
import TimeAgo from "./TimeAgo";
import ReferralVoteForm from "./ReferralVoteForm";
import ReportReferral from "./ReportReferral";
import BadgeDisplay from "./BadgeDisplay";
import { useEffect, useState } from "react";
import { voteService, badgeService } from '../services';
import { useTranslation } from 'react-i18next';
import { getDescriptionInLanguage } from '../utils/languages';

export default function PremiumReferralCard({ ref, onComment, user }) {
  const { t, i18n } = useTranslation();
  const [voteData, setVoteData] = useState({ upvotes: 0, downvotes: 0, totalVotes: 0 });
  const [copiedCode, setCopiedCode] = useState(false);
  const [openVoteForm, setOpenVoteForm] = useState(null);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    async function fetchVotes() {
      try {
        const data = await voteService.getAverage(ref._id);
        const result = data.data || data;
        setVoteData({
          upvotes: result.upvotes || 0,
          downvotes: result.downvotes || 0,
          totalVotes: result.totalVotes || 0
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des votes :", error);
      }
    }

    async function fetchBadges() {
      try {
        if (ref.user && ref.user._id) {
          const data = await badgeService.getUserBadges(ref.user._id);
          const badgesArray = data.data || [];
          setBadges(badgesArray);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des badges :", error);
      }
    }

    fetchVotes();
    fetchBadges();
  }, [ref._id, ref.user]);

  async function refreshVotes() {
    try {
      const data = await voteService.getAverage(ref._id);
      const result = data.data || data;
      setVoteData({
        upvotes: result.upvotes || 0,
        downvotes: result.downvotes || 0,
        totalVotes: result.totalVotes || 0
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des votes :", error);
    }
  }

  function renderVoteButtons() {
    const handleVoteClick = (voteType) => {
      if (!user) {
        alert(t('auth.loginRequired'));
        return;
      }
      
      // Toggle: if clicking the same vote type, close the form
      if (openVoteForm === voteType) {
        setOpenVoteForm(null);
      } else {
        setOpenVoteForm(voteType);
      }
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => handleVoteClick('good')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: openVoteForm === 'good' ? '2px solid var(--color-success)' : '1.5px solid #e6d9a8',
            backgroundColor: openVoteForm === 'good' ? 'rgba(39, 174, 96, 0.15)' : 'transparent',
            color: 'var(--color-success)',
            fontSize: '0.9rem',
            fontWeight: openVoteForm === 'good' ? '700' : '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            transform: openVoteForm === 'good' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseEnter={e => {
            if (openVoteForm !== 'good') {
              e.currentTarget.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
              e.currentTarget.style.borderColor = 'var(--color-success)';
            }
          }}
          onMouseLeave={e => {
            if (openVoteForm !== 'good') {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#e6d9a8';
            }
          }}
        >
          <FaThumbsUp size={16} />
          <span>{voteData.upvotes}</span>
        </button>
        <button
          onClick={() => handleVoteClick('bad')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: openVoteForm === 'bad' ? '2px solid var(--color-error)' : '1.5px solid #e6d9a8',
            backgroundColor: openVoteForm === 'bad' ? 'rgba(231, 76, 60, 0.15)' : 'transparent',
            color: 'var(--color-error)',
            fontSize: '0.9rem',
            fontWeight: openVoteForm === 'bad' ? '700' : '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            transform: openVoteForm === 'bad' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseEnter={e => {
            if (openVoteForm !== 'bad') {
              e.currentTarget.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
              e.currentTarget.style.borderColor = 'var(--color-error)';
            }
          }}
          onMouseLeave={e => {
            if (openVoteForm !== 'bad') {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#e6d9a8';
            }
          }}
        >
          <FaThumbsDown size={16} />
          <span>{voteData.downvotes}</span>
        </button>
      </div>
    );
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #fff9e6 0%, #fffef5 50%, #fff9e6 100%)",
        border: "2px solid #d4af37",
        borderRadius: "16px",
        padding: "1.5rem",
        width: "100%",
        boxShadow: "0 8px 24px rgba(212, 175, 55, 0.2), 0 4px 8px rgba(0,0,0,0.1)",
        marginBottom: "1rem",
        position: "relative",
        overflow: "visible",
        animation: "premiumPulse 0.6s ease-out",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(212, 175, 55, 0.3), 0 6px 12px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(212, 175, 55, 0.2), 0 4px 8px rgba(0,0,0,0.1)";
      }}
    >
      {/* Gold shine effect */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, transparent, #f1c40f, #d4af37, #f1c40f, transparent)",
        borderTopLeftRadius: "14px",
        borderTopRightRadius: "14px",
        animation: "shimmer 2s ease-in-out infinite"
      }}></div>
      
      <style>{`
        @keyframes premiumPulse {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes shimmer {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
      
      {/* Header : avatar + user + couronne */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {ref.user?.profilePhoto ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${ref.user.profilePhoto}`}
              alt={ref.user.username}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <span
              style={{
                backgroundColor: ref.source ? "var(--color-success)" : "#3498db",
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
              {ref.source ? <FaGlobe size={18} /> : (ref.user?.username?.charAt(0).toUpperCase() || "?")}
            </span>
          )}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {ref.source ? (
                <a
                  href={ref.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontWeight: "600",
                    color: "var(--color-primary)",
                    textDecoration: "none"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                >
                  De {new URL(ref.source).hostname.replace('www.', '')}
                </a>
              ) : (
                <span style={{ fontWeight: "600", color: "#2c3e50" }}>
                  {ref.user?.username
                    ? ref.user.username.charAt(0).toUpperCase() +
                      ref.user.username.slice(1).toLowerCase()
                    : ref.user}
                </span>
              )}
              <BadgeDisplay badges={badges} size="small" />
              {ref.source && (
                <BadgeDisplay badges={[{ type: 'external' }]} size="small" />
              )}
            </div>
            <small style={{ color: "#7f8c8d" }}>
              <TimeAgo isoDateString={ref.createdAt} />
            </small>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Badge Prime - Only crown */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "linear-gradient(135deg, #d4af37 0%, #f1c40f 50%, #d4af37 100%)",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: "700",
              boxShadow: "0 2px 8px rgba(212, 175, 55, 0.4)",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            <FaCrown style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }} />
          </div>
          <ReportReferral referralId={ref._id} iconOnly />
        </div>
      </div>

      {/* Code ou lien */}
       {(ref.link || ref.code) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(135deg, #fdfbf3 0%, #fff9e6 100%)",
            border: "1px solid #e6d9a8",
            borderRadius: "10px",
            padding: "0.9rem 1.2rem",
            marginBottom: "0.8rem",
            boxShadow: "0 2px 6px rgba(212, 175, 55, 0.1)"
          }}
        >
          <span style={{ fontWeight: "600", color: "#2c3e50", flex: 1, wordBreak: "break-all" }}>
            {ref.link || ref.code}
          </span>
          <div style={{ display: "flex", gap: "8px", marginLeft: "8px" }}>
            {ref.code && (
              <button
                style={{
                  background: copiedCode ? "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)" : "linear-gradient(135deg, #d4af37 0%, #f1c40f 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "all 0.3s",
                  boxShadow: copiedCode ? "0 2px 8px rgba(39, 174, 96, 0.3)" : "0 2px 8px rgba(212, 175, 55, 0.3)",
                }}
                onClick={() => copyToClipboard(ref.code)}
                title={t('service.copyCode')}
              >
                {copiedCode ? <FaCheck /> : <FaCopy />}
              </button>
            )}
            {ref.link && (
              <button
                style={{
                  background: "linear-gradient(135deg, #d4af37 0%, #f1c40f 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 2px 8px rgba(212, 175, 55, 0.3)",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
                onClick={() => {
                  if (ref.link) window.open(ref.link, "_blank");
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(212, 175, 55, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(212, 175, 55, 0.3)";
                }}
                title={t('service.open')}
              >
                <FaExternalLinkAlt />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      <p style={{ marginBottom: "0.8rem", color: "#2c3e50" }}>
        {getDescriptionInLanguage(ref.description, i18n.language)}
      </p>

      {/* Votes + Commentaires */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {renderVoteButtons()}
        </div>
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
            padding: "6px 12px",
          }}
        >
          <FaComment /> {t('service.comments')}
        </button>
      </div>

      {/* Vote Form - Only show if open */}
      {openVoteForm && (
        <div
          style={{
            marginTop: "0.8rem",
            width: "100%"
          }}
        >
          <ReferralVoteForm 
            referralId={ref._id} 
            initialVoteType={openVoteForm}
            onVoteSuccess={() => {
              refreshVotes();
              setOpenVoteForm(null);
            }}
            onClose={() => setOpenVoteForm(null)}
          />
        </div>
      )}
    </div>
  );
}
