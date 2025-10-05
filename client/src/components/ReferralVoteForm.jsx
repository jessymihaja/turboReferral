import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import CustomToast from './CustomToast';
import { voteService } from '../services';
import { useTranslation } from 'react-i18next';
import { FaThumbsUp, FaThumbsDown, FaUndo, FaChevronDown, FaChevronUp, FaPaperPlane } from 'react-icons/fa';

function ReferralVoteForm({ referralId, onVoteSuccess, initialVoteType, onClose }) {
  const { t } = useTranslation();
  const { token, user } = useContext(UserContext);
  const [vote, setVote] = useState(initialVoteType || '');
  const [comment, setComment] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [existingVote, setExistingVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(!!initialVoteType);

  useEffect(() => {
    async function checkExistingVote() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await voteService.getUserVote(referralId);
        const data = response.data || response;
        if (data) {
          setExistingVote(data);
        }
      } catch (err) {
        console.error('Error checking existing vote:', err);
      } finally {
        setLoading(false);
      }
    }
    
    checkExistingVote();
  }, [referralId, user]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!vote) {
      setToast({ message: t('vote.selectVote'), type: 'error' });
      return;
    }
    
    try {
      await voteService.submitVote(referralId, vote, comment);
      setToast({ message: t('vote.thankYou'), type: 'success' });
      setExistingVote({ vote, comment, createdAt: new Date().toISOString() });
      setVote('');
      setComment('');
      
      // Call the callback to refresh vote counts
      if (onVoteSuccess) {
        onVoteSuccess();
      }
    } catch (err) {
      setToast({ message: err.message || t('vote.errorSubmitting'), type: 'error' });
    }
  }

  async function handleDeleteVote() {
    try {
      await voteService.deleteVote(referralId);
      setToast({ message: t('vote.voteDeleted'), type: 'success' });
      setExistingVote(null);
      
      // Call the callback to refresh vote counts
      if (onVoteSuccess) {
        onVoteSuccess();
      }
    } catch (err) {
      setToast({ message: err.message || t('vote.errorDeleting'), type: 'error' });
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: 'var(--space-4)',
        color: 'var(--color-text-tertiary)',
        fontSize: 'var(--font-size-sm)'
      }}>
        {t('common.loading')}...
      </div>
    );
  }

  if (existingVote) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        padding: 'var(--space-3)',
        backgroundColor: 'var(--color-bg-subtle)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-light)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-secondary)'
          }}>
            {existingVote.vote === 'good' ? (
              <>
                <FaThumbsUp color="var(--color-success)" size={18} />
                <span>{t('vote.youVotedGood')}</span>
              </>
            ) : (
              <>
                <FaThumbsDown color="var(--color-error)" size={18} />
                <span>{t('vote.youVotedBad')}</span>
              </>
            )}
          </div>
          <button
            onClick={handleDeleteVote}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              padding: 'var(--space-1) var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-text-tertiary)',
              fontSize: 'var(--font-size-xs)',
              cursor: 'pointer',
              transition: 'all var(--transition-base)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--color-error)';
              e.currentTarget.style.backgroundColor = 'var(--color-error-50)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--color-text-tertiary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={t('vote.undoVote')}
          >
            <FaUndo size={12} />
            <span>{t('vote.undo')}</span>
          </button>
        </div>
        {existingVote.comment && (
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-primary)',
            margin: 0,
            fontStyle: 'italic'
          }}>
            "{existingVote.comment}"
          </p>
        )}
      </div>
    );
  }

  async function handleQuickVote(voteType) {
    // This function is not used anymore since parent buttons handle the toggle
  }

  return (
    <div>
      {/* Expanded form - only textarea and submit button */}
      {isExpanded && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: 'var(--space-2)',
            width: '100%'
          }}
        >
          <textarea
            placeholder={t('vote.addComment') + ' (optionnel)'}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={1}
            style={{
              flex: 1,
              padding: 'var(--space-2) var(--space-3)',
              fontSize: 'var(--font-size-sm)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              outline: 'none',
              resize: 'none',
              backgroundColor: 'var(--color-bg-elevated)',
              color: 'var(--color-text-primary)',
              fontFamily: 'inherit',
              height: '44px',
              lineHeight: '1.5',
              boxSizing: 'border-box'
            }}
          />

          <button
            type="submit"
            disabled={!vote}
            title={t('vote.submit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: vote ? 'var(--color-primary)' : 'var(--color-neutral-300)',
              color: 'white',
              fontSize: 'var(--font-size-base)',
              cursor: vote ? 'pointer' : 'not-allowed',
              transition: 'all var(--transition-base)',
              opacity: vote ? 1 : 0.5,
              minWidth: '44px',
              height: '44px',
              flexShrink: 0
            }}
          >
            <FaPaperPlane size={16} />
          </button>

          {toast.message && (
            <CustomToast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ message: '', type: '' })}
            />
          )}
        </form>
      )}
    </div>
  );
}

export default ReferralVoteForm;
