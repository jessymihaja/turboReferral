// src/components/ReferralInfo.jsx
import { FaUsers, FaGift, FaShareAlt } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

export default function ReferralInfo() {
  const { t } = useTranslation();
  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI, sans-serif",marginTop:"2rem"}}>
      <h2 style={{ textAlign: "center", color: "#2c3e50", marginBottom: "1.5rem" }}>
        {t('referralInfo.howItWorks')}
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
          <h3 style={{ margin: "0.8rem 0" }}>{t('referralInfo.step1Title')}</h3>
          <p>
            {t('referralInfo.step1Description')}
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
          <h3 style={{ margin: "0.8rem 0" }}>{t('referralInfo.step2Title')}</h3>
          <p>
            {t('referralInfo.step2Description')}
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
          <h3 style={{ margin: "0.8rem 0" }}>{t('referralInfo.step3Title')}</h3>
          <p>
            {t('referralInfo.step3Description')}
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
          <h4 style={{ color: "#27ae60" }}>{t('referralInfo.faq1Question')}</h4>
          <p>
            {t('referralInfo.faq1Answer')}
          </p>
        </div>

        <div>
          <h4 style={{ color: "#2980b9" }}>{t('referralInfo.faq2Question')}</h4>
          <p>
            {t('referralInfo.faq2Answer')}
          </p>
        </div>

        <div>
          <h4 style={{ color: "#e67e22" }}>{t('referralInfo.faq3Question')}</h4>
          <p>
            {t('referralInfo.faq3Answer')}
          </p>
        </div>
      </div>
    </div>
  );
}
