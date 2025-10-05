// src/components/Footer.jsx
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, var(--color-primary) 0%, #D4A574 100%)",
        color: "var(--color-text-inverse)",
        padding: "var(--space-2xl) var(--space-lg)",
        marginTop: "auto",
        borderTop: "2px solid var(--color-primary-dark)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative gradient overlay */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
        pointerEvents: "none"
      }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--space-2xl)",
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "var(--space-xl)",
          position: "relative",
          zIndex: 1
        }}
      >
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{
            color: "var(--color-text-inverse)",
            marginBottom: "var(--space-sm)",
            fontSize: "var(--font-size-xl)",
            fontWeight: "var(--font-weight-bold)"
          }}>turboReferral</h2>
          <p style={{
            fontSize: "var(--font-size-sm)",
            opacity: 0.9,
            lineHeight: "var(--line-height-relaxed)"
          }}>
            {t('footer.tagline')}
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 style={{
            marginBottom: "var(--space-md)",
            fontSize: "var(--font-size-base)",
            fontWeight: "var(--font-weight-semibold)"
          }}>{t('footer.links')}</h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2" }}>
            <li>
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link to="/" style={{
                  color: "var(--color-text-inverse)",
                  textDecoration: "none",
                  opacity: 0.8,
                  fontSize: "var(--font-size-sm)",
                  transition: "opacity var(--transition-base)"
                }}>{t('footer.home')}</Link>
              </motion.div>
            </li>
            <li>
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link to="/politique-confidentialite" style={{
                  color: "var(--color-text-inverse)",
                  textDecoration: "none",
                  opacity: 0.8,
                  fontSize: "var(--font-size-sm)",
                  transition: "opacity var(--transition-base)"
                }}>{t('footer.privacy')}</Link>
              </motion.div>
            </li>
          </ul>
        </motion.div>

        {/* Social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 style={{
            marginBottom: "var(--space-md)",
            fontSize: "var(--font-size-base)",
            fontWeight: "var(--font-weight-semibold)"
          }}>{t('footer.connect')}</h3>
          <div style={{ display: "flex", gap: "var(--space-md)" }}>
            <motion.a
              href="#"
              style={{
                color: "var(--color-text-inverse)",
                opacity: 0.8,
                transition: "opacity var(--transition-base)"
              }}
              whileHover={{ scale: 1.2, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              title="Facebook"
            >
              <FaFacebookF size={18} />
            </motion.a>
            <motion.a
              href="#"
              style={{
                color: "var(--color-text-inverse)",
                opacity: 0.8,
                transition: "opacity var(--transition-base)"
              }}
              whileHover={{ scale: 1.2, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              title="Twitter"
            >
              <FaTwitter size={18} />
            </motion.a>
            <motion.a
              href="#"
              style={{
                color: "var(--color-text-inverse)",
                opacity: 0.8,
                transition: "opacity var(--transition-base)"
              }}
              whileHover={{ scale: 1.2, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              title="LinkedIn"
            >
              <FaLinkedinIn size={18} />
            </motion.a>
            <motion.a
              href="#"
              style={{
                color: "var(--color-text-inverse)",
                opacity: 0.8,
                transition: "opacity var(--transition-base)"
              }}
              whileHover={{ scale: 1.2, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              title="GitHub"
            >
              <FaGithub size={18} />
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          marginTop: "var(--space-xl)",
          paddingTop: "var(--space-lg)",
          textAlign: "center",
          fontSize: "var(--font-size-sm)",
          opacity: 0.8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--space-xs)"
        }}
      >
        © {new Date().getFullYear()} TurboReferral • {t('footer.madeWith')} <FaHeart style={{ color: "var(--color-error)" }} />
      </div>
    </footer>
  );
}
