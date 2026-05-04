import { useState } from 'react';
import { getResumeTips } from '../lib/openai';
import { getConversationId, setConversationId } from '../lib/storage';
import TipsAccordion from './TipsAccordion';

export default function InjectableTipsButton({ descriptionSelector }: { descriptionSelector: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [tips, setTips] = useState<string>("");

  const handleClick = async (e: React.MouseEvent) => {
    if (!e.isTrusted) return;
    const conversationId = await getConversationId();
    if (!conversationId) {
      chrome.runtime.sendMessage({ action: "OPEN_POPUP" });
      return;
    }

    const description = (document.querySelector(descriptionSelector) as HTMLElement)?.innerText?.trim();
    if (!description) return;
    setStatus('loading');
    try {
      const { id, text } = await getResumeTips(conversationId, description);
      await setConversationId(id);
      setTips(text);
      setStatus('idle');
    } catch (err) {
      console.error('Resume tips error:', err);
      setStatus('error');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', marginTop: 8 }}>
      {tips && <TipsAccordion text={tips} />}
      <button
        onClick={handleClick}
        disabled={status === 'loading'}
        style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, cursor: 'pointer', width: '100%', opacity: status === 'loading' ? 0.6 : 1, pointerEvents: 'auto' }}
      >
        {status === 'loading' ? 'Analyzing...' : status === 'error' ? 'Failed — try again' : 'Get Resume Tips'}
      </button>
    </div>
  );
}
