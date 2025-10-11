import { FaTools, FaSync } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../assets/css/error-pages.css';

export default function Maintenance() {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon maintenance-icon">
          <FaTools />
        </div>
        <h1 className="error-title">Site en Maintenance</h1>
        <p className="error-description">
          Nous effectuons actuellement une maintenance sur notre plateforme.
        </p>
        <p className="error-subdescription">
          Nos services seront de retour très bientôt. Merci de votre patience !
        </p>
        <div className="error-actions">
          <button onClick={handleRetry} className="error-button primary">
            <FaSync /> Réessayer
          </button>
          <button onClick={handleGoHome} className="error-button secondary">
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
