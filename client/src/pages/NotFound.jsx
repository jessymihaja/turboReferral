import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../assets/css/error-pages.css';

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-code">404</div>
        <div className="error-icon notfound-icon">
          <FaExclamationTriangle />
        </div>
        <h1 className="error-title">Page Introuvable</h1>
        <p className="error-description">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="error-actions">
          <button onClick={handleGoHome} className="error-button primary">
            <FaHome /> Retour à l'accueil
          </button>
          <button onClick={handleGoBack} className="error-button secondary">
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}
