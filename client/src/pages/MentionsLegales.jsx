import { motion } from 'framer-motion';

export default function MentionsLegales() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-main)',
      paddingTop: '80px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: 'var(--space-xl)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            background: 'linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-primary-50) 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-2xl)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border-light)'
          }}>
            <h1 style={{
              fontSize: 'var(--font-size-4xl)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--space-xl)',
              color: 'var(--color-text-primary)',
              textAlign: 'center'
            }} className="gradient-text">
              Mentions Légales
            </h1>

            <div style={{
              lineHeight: 'var(--line-height-relaxed)',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-base)'
            }}>
              <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-md)',
                  color: 'var(--color-primary-700)'
                }}>
                  1. Informations légales
                </h2>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  <strong>Nom du site :</strong> RefPush
                </p>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  <strong>Adresse :</strong> [Adresse à compléter]
                </p>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  <strong>Téléphone :</strong> [Numéro à compléter]
                </p>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  <strong>Email :</strong> contact@refpush.com
                </p>
              </section>

              <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-md)',
                  color: 'var(--color-primary-700)'
                }}>
                  2. Responsable de la publication
                </h2>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  Le responsable de la publication est [Nom du responsable], en sa qualité de [Fonction].
                </p>
              </section>

              <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-md)',
                  color: 'var(--color-primary-700)'
                }}>
                  3. Hébergement
                </h2>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  Le site RefPush est hébergé par [Nom de l'hébergeur], situé [Adresse de l'hébergeur].
                </p>
              </section>

              <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-md)',
                  color: 'var(--color-primary-700)'
                }}>
                  4. Propriété intellectuelle
                </h2>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                </p>
              </section>

              <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-md)',
                  color: 'var(--color-primary-700)'
                }}>
                  5. Responsabilité
                </h2>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions.
                </p>
              </section>

              <section>
                <h2 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-md)',
                  color: 'var(--color-primary-700)'
                }}>
                  6. Contact
                </h2>
                <p>
                  Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à l'adresse suivante : contact@refpush.com
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}