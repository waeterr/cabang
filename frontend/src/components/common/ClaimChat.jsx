import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { getClaimMessages, sendClaimMessage } from '../../api/claims';
import useAuthStore from '../../store/authStore';
import { handleApiError } from '../../utils/helpers';
import './ClaimChat.css';

const ClaimChat = ({ claimId }) => {
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    const loadMessages = async () => {
      try {
        const data = await getClaimMessages(claimId);
        if (isActive) {
          setMessages(data || []);
        }
      } catch (error) {
        if (isActive) {
          toast.error(handleApiError(error));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      isActive = false;
    };
  }, [claimId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'nearest' });
  }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    const text = draft.trim();

    if (!text) {
      return;
    }

    setIsSending(true);
    try {
      const response = await sendClaimMessage(claimId, text);
      setMessages((current) => [...current, response.claim_message]);
      setDraft('');
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="claim-chat">
      <h3 className="claim-chat-title">Diskusi Klaim</h3>
      <div className="claim-chat-body">
        {isLoading ? (
          <p className="claim-chat-empty">Memuat percakapan...</p>
        ) : messages.length === 0 ? (
          <p className="claim-chat-empty">Belum ada pesan. Mulai diskusi dengan admin.</p>
        ) : (
          messages.map((item) => (
            <div
              className={`claim-chat-bubble ${item.user_id === user?.id ? 'is-own' : ''}`}
              key={item.id}
            >
              <span className="claim-chat-author">{item.user?.name || 'Pengguna'}</span>
              <p>{item.message}</p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <form className="claim-chat-form" onSubmit={handleSend}>
        <input
          className="claim-chat-input"
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Tulis pesan untuk admin..."
          value={draft}
        />
        <button className="claim-chat-send" disabled={isSending || !draft.trim()} type="submit">
          <Send size={18} />
        </button>
      </form>
    </section>
  );
};

export default ClaimChat;
