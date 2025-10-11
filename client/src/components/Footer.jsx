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
      {/* Decorative gradient overlay (light, atténué) */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)",
        pointerEvents: "none"
      }} />

      {/* Overlay sombre pour renforcer le contraste du texte */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0.34) 100%)",
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
            fontWeight: "var(--font-weight-bold)",
            textShadow: "0 1px 2px rgba(0,0,0,0.45)"
          }}>turboReferral</h2>
          <p style={{
            fontSize: "var(--font-size-base)",
            color: "var(--color-text-inverse)",
            lineHeight: "var(--line-height-relaxed)",
            letterSpacing: "0.2px",
            margin: 0,
            textShadow: "0 1px 2px rgba(0,0,0,0.35)"
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
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-text-inverse)",
            textShadow: "0 1px 2px rgba(0,0,0,0.35)"
          }}>{t('footer.links')}</h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2" }}>
            <li>
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link to="/" style={{
                  color: "var(--color-text-inverse)",
                  textDecoration: "none",
                  fontSize: "var(--font-size-base)",
                  fontWeight: "var(--font-weight-medium)",
                  position: "relative",
                  transition: "color var(--transition-base)"
                }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.25)';
                    e.currentTarget.style.borderRadius = '8px';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >{t('footer.home')}</Link>
              </motion.div>
            </li>
            <li>
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link to="/politique-confidentialite" style={{
                  color: "var(--color-text-inverse)",
                  textDecoration: "none",
                  fontSize: "var(--font-size-base)",
                  fontWeight: "var(--font-weight-medium)",
                  position: "relative",
                  transition: "color var(--transition-base)"
                }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.25)';
                    e.currentTarget.style.borderRadius = '8px';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >Confidentialités</Link>
              </motion.div>
            </li>
            <li>
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link to="/mentions-legales" style={{
                  color: "var(--color-text-inverse)",
                  textDecoration: "none",
                  fontSize: "var(--font-size-base)",
                  fontWeight: "var(--font-weight-medium)",
                  position: "relative",
                  transition: "color var(--transition-base)"
                }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.25)';
                    e.currentTarget.style.borderRadius = '8px';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >Mentions légales</Link>
              </motion.div>
            </li>
            <li>
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link to="/conditions-generales" style={{
                  color: "var(--color-text-inverse)",
                  textDecoration: "none",
                  fontSize: "var(--font-size-base)",
                  fontWeight: "var(--font-weight-medium)",
                  position: "relative",
                  transition: "color var(--transition-base)"
                }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.25)';
                    e.currentTarget.style.borderRadius = '8px';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >Conditions Générales d'Utilisation</Link>
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
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-text-inverse)",
            textShadow: "0 1px 2px rgba(0,0,0,0.35)"
          }}>{t('footer.connect')}</h3>
          <div style={{ display: "flex", gap: "var(--space-md)" }}>
            <motion.a
              href="#"
              style={{
                color: "var(--color-text-inverse)",
                opacity: 1,
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
                opacity: 1,
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
                opacity: 1,
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
                opacity: 1,
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
          opacity: 0.95,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--space-xs)",
          letterSpacing: "0.2px",
          textShadow: "0 1px 2px rgba(0,0,0,0.35)"
        }}
      >
        © {new Date().getFullYear()} TurboReferral • Tous droits réservés
      </div>
    </footer>
  );
}
