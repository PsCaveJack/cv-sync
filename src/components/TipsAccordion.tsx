import { useState } from 'react';

interface TipsAccordionProps {
  text: string;
}

function parseTips(text: string): { title: string; body: string }[] {
  const tips = text.split(/\n(?=\d+\))/).map(t => t.replace(/^\d+\)\s*/, '').trim()).filter(Boolean);
  const items = tips.length >= 2 ? tips : [text];

  return items.map((tip) => {
    const firstNewline = tip.indexOf('\n');
    return {
      title: (firstNewline !== -1 ? tip.slice(0, firstNewline) : tip).replace(/\*\*/g, '').trim(),
      body:  firstNewline !== -1 ? tip.slice(firstNewline + 1).trim() : '',
    };
  });
}

function TipItem({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: 6, background: '#f0f4ff', borderLeft: '3px solid #4f6ef7', borderRadius: 4, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', padding: '8px 12px', fontWeight: 600, fontSize: 13, cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#1a1a1a' }}
      >
        {title}
        <span style={{ fontSize: 10, marginLeft: 8 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && body && (
        <div style={{ padding: '0 12px 10px', lineHeight: 1.5, whiteSpace: 'pre-wrap', fontSize: 13, color: '#1a1a1a' }}>
          {body}
        </div>
      )}
    </div>
  );
}

export default function TipsAccordion({ text }: TipsAccordionProps) {
  const tips = parseTips(text);
  return (
    <div style={{ margin: '8px 0', fontFamily: 'sans-serif' }}>
      {tips.map((tip, i) => <TipItem key={i} title={tip.title} body={tip.body} />)}
    </div>
  );
}
