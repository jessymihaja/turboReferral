import { FaMedal, FaAward, FaTrophy, FaCheckCircle, FaExclamationTriangle, FaCrown, FaExternalLinkAlt } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

export default function BadgeDisplay({ badges = [], size = "small" }) {
  const { t } = useTranslation();

  const badgeConfig = {
    referral_10: {
      icon: FaMedal,
      color: "#cd7f32",
      bgColor: "rgba(205, 127, 50, 0.15)",
      label: "10 Parrainages",
      title: "10 parrainages publiés"
    },
    referral_50: {
      icon: FaAward,
      color: "#c0c0c0",
      bgColor: "rgba(192, 192, 192, 0.15)",
      label: "50 Parrainages",
      title: "50 parrainages publiés"
    },
    referral_100: {
      icon: FaTrophy,
      color: "#d4af37",
      bgColor: "rgba(212, 175, 55, 0.15)",
      label: "100 Parrainages",
      title: "100 parrainages publiés"
    },
    trusted: {
      icon: FaCheckCircle,
      color: "#27ae60",
      bgColor: "rgba(39, 174, 96, 0.15)",
      label: "Fiable",
      title: "Utilisateur fiable (>50% de votes positifs)"
    },
    risky: {
      icon: FaExclamationTriangle,
      color: "#e74c3c",
      bgColor: "rgba(231, 76, 60, 0.15)",
      label: "Risqué",
      title: "Utilisateur risqué (<50% de votes positifs)"
    },
    promoter: {
      icon: FaCrown,
      color: "#9b59b6",
      bgColor: "rgba(155, 89, 182, 0.15)",
      label: "Promoteur",
      title: "Promoteur officiel"
    },
    external: {
      icon: FaExternalLinkAlt,
      color: "#3498db",
      bgColor: "rgba(52, 152, 219, 0.15)",
      label: "Autre site",
      title: "Provenant d'autres sites"
    }
  };

  const sizeConfig = {
    small: {
      iconSize: 12,
      padding: "4px 8px",
      fontSize: "0.75rem",
      gap: "4px"
    },
    medium: {
      iconSize: 14,
      padding: "6px 10px",
      fontSize: "0.85rem",
      gap: "6px"
    },
    large: {
      iconSize: 16,
      padding: "8px 12px",
      fontSize: "0.9rem",
      gap: "8px"
    }
  };

  const config = sizeConfig[size] || sizeConfig.small;

  if (!badges || badges.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
      {badges.map((badge) => {
        const badgeType = typeof badge === 'string' ? badge : badge.type;
        const badgeInfo = badgeConfig[badgeType];

        if (!badgeInfo) return null;

        const Icon = badgeInfo.icon;

        return (
          <div
            key={badgeType}
            title={badgeInfo.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: config.gap,
              backgroundColor: badgeInfo.bgColor,
              color: badgeInfo.color,
              padding: config.padding,
              borderRadius: "12px",
              fontSize: config.fontSize,
              fontWeight: "600",
              border: `1px solid ${badgeInfo.color}30`,
              transition: "all 0.2s",
              cursor: "default"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = `0 2px 8px ${badgeInfo.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Icon size={config.iconSize} />
            {size !== "small" && <span>{badgeInfo.label}</span>}
          </div>
        );
      })}
    </div>
  );
}
