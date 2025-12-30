import { motion } from 'framer-motion';

export default function ConditionsGenerales() {
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
            background: 'linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-info-50) 100%)',
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
              Conditions Générales d'Utilisation
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
                  color: 'var(--color-info-700)'
                }}>
                  1. Objet
                </h2>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation du site RefPush, ainsi que les droits et obligations des parties dans ce cadre.
                </p>
              </section>

              <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-md)',
                  color: 'var(--color-info-700)'
                }}>
                  2. Accès au service
                </h2>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  Le service est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. L'utilisateur s'engage à utiliser le service de manière responsable et conforme aux présentes CGU.
                </p>
              </section>

              <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-md)',
                  color: 'var(--color-info-700)'
                }}>
                  3. Utilisation du service
                </h2>
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <p style={{ marginBottom: 'var(--space-sm)' }}>
                    L'utilisateur s'engage à :
                  </p>
                  <ul style={{ marginLeft: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Ne pas utiliser le service à des fins illégales ou frauduleuses</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Fournir des informations exactes et à jour</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Respecter les droits de propriété intellectuelle</li>
                    <li style={{ marginBottom: 'var(--space-sm)' }}>Ne pas porter atteinte à l'ordre public et aux bonnes mœurs</li>
                  </ul>
                </div>
              </section>

              <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-md)',
                  color: 'var(--color-info-700)'
                }}>
                  4. Parrainage et commissions
                </h2>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  Les utilisateurs peuvent partager des liens de parrainage sur la plateforme. RefPush n'est pas responsable des conditions de parrainage proposées par les services tiers. Les utilisateurs sont invités à vérifier les conditions de chaque service avant de s'inscrire.
                </p>
              </section>

              <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-md)',
                  color: 'var(--color-info-700)'
                }}>
                  5. Données personnelles
                </h2>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  Les données personnelles collectées font l'objet d'un traitement informatique destiné à la gestion du service. Conformément au RGPD, l'utilisateur dispose d'un droit d'accès, de rectification et de suppression de ses données personnelles.
                </p>
              </section>

              <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-md)',
                  color: 'var(--color-info-700)'
                }}>
                  6. Responsabilité
                </h2>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  RefPush ne saurait être tenu responsable des dommages directs ou indirects causés au matériel de l'utilisateur lors de l'accès au site, ou résultant de l'utilisation du service.
                </p>
              </section>

              <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-md)',
                  color: 'var(--color-info-700)'
                }}>
                  7. Modification des CGU
                </h2>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  RefPush se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prendront effet dès leur publication sur le site.
                </p>
              </section>

              <section>
                <h2 style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--space-md)',
                  color: 'var(--color-info-700)'
                }}>
                  8. Droit applicable
                </h2>
                <p>
                  Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
                </p>
              </section>

              <div style={{
                marginTop: 'var(--space-2xl)',
                padding: 'var(--space-lg)',
                backgroundColor: 'var(--color-info-50)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-info-200)'
              }}>
                <p style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-info-700)',
                  textAlign: 'center',
                  margin: 0
                }}>
                  <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}