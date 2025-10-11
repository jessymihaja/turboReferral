import React from 'react';
import { FaBug, FaHome } from 'react-icons/fa';
import '../assets/css/error-pages.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <div className="error-container">
            <div className="error-icon error-icon-bug">
              <FaBug />
            </div>
            <h1 className="error-title">Une Erreur est Survenue</h1>
            <p className="error-description">
              Désolé, quelque chose s'est mal passé. Nous travaillons pour résoudre le problème.
            </p>
            {this.state.error && (
              <div className="error-details">
                <code>{this.state.error.toString()}</code>
              </div>
            )}
            <div className="error-actions">
              <button onClick={this.handleReload} className="error-button primary">
                Recharger la page
              </button>
              <button onClick={this.handleGoHome} className="error-button secondary">
                <FaHome /> Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
