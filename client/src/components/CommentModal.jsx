import React, { useEffect, useState } from 'react';
import '../assets/css/CommentModal.css';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

function CommentModal({ referral, onClose }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/referralVotes/${referral._id}/comments`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error('Erreur lors du chargement des commentaires:', err);
      } finally {
        setLoading(false);
      }
    }

    if (referral) fetchComments();
  }, [referral]);

  return (
    <div className="comment-modal-overlay">
      <div className="comment-modal-container">
        <div className="comment-modal-header">
          <h2>Commentaires pour {referral.title}</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="comment-modal-body">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : comments.length === 0 ? (
            <p>Aucun commentaire pour ce referral.</p>
          ) : (
            comments.map((comment, index) => (
              <div key={index} className="comment-card">
                <div className="avatar-circle">{(comment.user?.username?.charAt(0).toUpperCase() || '?')}</div>
                <div className="comment-content">
                  <div className="comment-header">
                    <strong>{comment.user?.username || 'Utilisateur inconnu'}</strong>
                    {comment.vote === 'good' ? (
                        <FaThumbsUp style={{ color: '#28a745', fontSize: '1.2rem', marginRight: '8px' }} />
                    ) : (
                        <FaThumbsDown style={{ color: '#dc3545', fontSize: '1.2rem', marginRight: '8px' }} />
                    )}
                  </div>
                  <p>{comment.comment}</p>
                  <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
