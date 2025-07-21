import React, { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import CustomToast from './CustomToast';

function ReferralVoteForm({ referralId }) {
    const { token} = useContext(UserContext);
  const [vote, setVote] = useState('');
  const [comment, setComment] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });


  async function handleSubmit(e) {
  e.preventDefault();
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/referralVotes/${referralId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // si tu protèges avec JWT (à adapter selon ton app)
    },
    body: JSON.stringify({ vote, comment }),
  });

  const data = await res.json();
  if (!res.ok) return setToast({ message: data.message, type: 'error' });;
  setToast({ message: 'Merci pour votre vote', type: 'success' });
  setVote('');
  setComment('');
}

  return (
    <form
  onSubmit={handleSubmit}
  style={{
    marginTop: '0.1rem',
    backgroundColor: '#f9f9f9',
    padding: '0.3rem',
    borderRadius: '8px',
    borderBottomRadius: '0px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    width: '70%',
  }}
>
  <div style={{ display: 'flex',gap:'0.5rem', marginBottom: '0.75rem' ,width: '100%'}}>
    <button
      type="button"
      onClick={() => setVote('good')}
      style={{
        backgroundColor: vote === 'good' ? '#27ae60' : '#efe8e6ff',
        color: vote === 'good' ? 'white' : '#2c3e50',
        border: 'none',
        borderRadius: '6px',
        padding: '0.8rem 1rem',
        cursor: 'pointer',
        fontSize: '0.7rem',
        transition: 'all 0.2s ease',
        height: '20%',
      }}
    >
      👍 Bien
    </button>

    <button
      type="button"
      onClick={() => setVote('bad')}
      style={{
        backgroundColor: vote === 'bad' ? '#e74c3c' : '#efe8e6ff',
        color: vote === 'bad' ? 'white' : '#2c3e50',
        border: 'none',
        borderRadius: '6px',
        padding: '0.8rem 1rem',
        cursor: 'pointer',
        fontSize: '0.7rem',
        transition: 'all 0.2s ease',
        height: '20%',
      }}
    >
      👎 Mauvais
    </button>
  

  <textarea
    placeholder="Ajouter un commentaire"
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    rows={2}
    style={{
      padding: '0.75rem',
      fontSize: '0.8rem',
      borderRadius: '6px',
      border: '1px solid #ccc',
      outline: 'none',
      resize: 'vertical',
      marginBottom: '0.75rem',
      width: '100%',
    }}
  />

  <button
    type="submit"
    disabled={!vote}
    style={{
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '0.5rem 1rem',
      cursor: vote ? 'pointer' : 'not-allowed',
      fontSize: '1rem',
      width: '50%',
      height: '20%',
      marginTop: '0.8rem',
    }}
  >
    Envoyer
  </button>
  </div>
{toast.message && (
      <CustomToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />
)}
</form>

  );
}
export default ReferralVoteForm;
