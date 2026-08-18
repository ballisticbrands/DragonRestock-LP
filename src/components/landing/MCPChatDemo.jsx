import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Mic, AudioLines, ChevronDown } from 'lucide-react';
import { t } from './theme';
import { CONVERSATIONS } from '../../data/conversations';

/* ──────────────────────────────────────────────────────────────
   MCPChatDemo — DragonRestock driven from Claude over MCP.

   Adapted from the DragonBot LP's ChatWindow: same title bar,
   bubble, typing-indicator, and typewriter treatment, with a tab
   strip so one component can carry several transcripts.

   The transcripts live in data/conversations.js and use the shared
   story (Ridgeline Apparel · Lianfa Textiles · Dongfeng Headwear).

   Deliberately rendered in light chrome in both themes so it reads
   as a real chat client dropped onto the page.
   ────────────────────────────────────────────────────────────── */

const urlRegex = /(https?:\/\/[^\s]+)/g;

function linkify(text, isUser) {
  const linkClass = `underline ${isUser ? 'text-white/80 hover:text-white' : 'text-[#2F7D4F] hover:text-[#256B42]'}`;
  return text.split(urlRegex).map((part, i) =>
    part.match(urlRegex)
      ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className={linkClass}>{part}</a>
      : part
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 bg-[#f0f0f0] rounded-2xl rounded-bl-md px-4 py-3">
        <img src="/logos/dragonbot_fire.png" alt="" className="w-5 h-5 mr-1" />
        {[0, 0.15, 0.3].map((d) => (
          <motion.div key={d} className="w-2 h-2 bg-[#2F7D4F] rounded-full"
            animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: d }} />
        ))}
      </div>
    </div>
  );
}

function TypewriterText({ text, onComplete, speed = 12 }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      indexRef.current += 2;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(interval);
        doneRef.current?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}</span>;
}

function Transcript({ messages, compact }) {
  const [visible, setVisible] = useState([]);
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Restart the playback whenever the tab (and so the transcript) changes.
  useEffect(() => {
    setVisible([]);
    setIndex(0);
    setIsTyping(false);
  }, [messages]);

  useEffect(() => {
    if (index >= messages.length) return;
    const msg = messages[index];

    if (msg.role === 'bot') {
      setIsTyping(true);
      const id = setTimeout(() => {
        setIsTyping(false);
        setVisible(prev => [...prev, { ...msg, animating: true }]);
      }, 700);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setVisible(prev => [...prev, { ...msg, animating: false }]);
      setIndex(i => i + 1);
    }, 450);
    return () => clearTimeout(id);
  }, [index, messages]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [visible, isTyping]);

  const onTypewriterDone = () => {
    setVisible(prev => prev.map((m, i) => (i === prev.length - 1 ? { ...m, animating: false } : m)));
    setIndex(i => i + 1);
  };

  return (
    /* Compact fills whatever height the row gives it — `flex-1 min-h-0`,
       safe here only because the parent has a definite height (the grid
       cell stretches). Without min-h-0 the content-based minimum wins and
       the window grows with every message instead of scrolling, which is
       exactly what `flex-1` alone used to do. min-h keeps it sane once the
       grid collapses to one column and the parent height goes auto. */
    <div ref={scrollRef}
      className={`overflow-y-auto space-y-3 bg-[#fafafa] ${
        compact ? 'p-3.5 flex-1 min-h-[440px]' : 'shrink-0 p-4 h-[420px]'
      }`}>
      <AnimatePresence>
        {visible.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] px-4 py-2.5 leading-relaxed whitespace-pre-line break-words ${compact ? 'text-[14px]' : 'text-[13.5px]'} ${
              msg.role === 'user'
                ? 'bg-[#2F7D4F] text-white rounded-2xl rounded-br-md'
                : 'bg-[#f0f0f0] text-[#1A1A1A] rounded-2xl rounded-bl-md'
            }`}>
              {msg.role === 'bot' && msg.animating
                ? <TypewriterText text={msg.text} onComplete={onTypewriterDone} />
                : linkify(msg.text, msg.role === 'user')}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {isTyping && <TypingIndicator />}
    </div>
  );
}

/* `only` pins the component to a single transcript and `compact` shrinks it
   to something that sits inside a page row — no tab strip, no composer, no
   caption. That's how the problem section reuses the onboarding transcript
   as its illustration instead of a separate screenshot that would drift out
   of sync with this one. */
export default function MCPChatDemo({ dark, only, compact = false }) {
  const convos = only ? CONVERSATIONS.filter(c => c.key === only) : CONVERSATIONS;
  const [active, setActive] = useState(convos[0].key);
  const convo = convos.find(c => c.key === active) ?? convos[0];
  const showTabs = convos.length > 1;

  const tabOn = 'bg-[#2F7D4F] text-white shadow-lg shadow-[#2F7D4F]/20';
  const tabOff = dark
    ? 'bg-white/[0.06] text-white/60 hover:bg-white/10 hover:text-white/80'
    : 'bg-[#1A1A1A]/[0.04] text-[#1A1A1A]/55 hover:bg-[#1A1A1A]/[0.07] hover:text-[#1A1A1A]/75';

  return (
    <div className={compact ? 'h-full' : ''}>
      {/* Tab strip */}
      {showTabs && (
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {convos.map(c => (
          <button
            key={c.key}
            type="button"
            onClick={() => setActive(c.key)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold tracking-wide transition-all ${active === c.key ? tabOn : tabOff}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      )}

      {/* Chat client */}
      <div className={`bg-white rounded-xl shadow-2xl shadow-[#1A1A1A]/15 border border-[#1A1A1A]/10 overflow-hidden flex flex-col ${compact ? 'h-full' : 'max-w-2xl mx-auto'}`}>
        <div className={`bg-[#0F3D2E] flex items-center gap-3 ${compact ? 'px-4 py-2.5' : 'px-5 py-3'}`}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <img src="/logos/dragonbot_fire.png" alt="" className="w-5 h-5" />
            <span className={`text-white font-clash font-semibold ${compact ? 'text-[13px]' : 'text-sm'}`}>Claude · DragonRestock</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#98CC65] animate-pulse" />
            <span className="text-[#98CC65] text-xs whitespace-nowrap">MCP connected</span>
          </div>
        </div>

        <Transcript key={active} messages={convo.messages} compact={compact} />

        {/* Composer — modeled on Claude's own message box: placeholder on
            top, a "+" bottom-left, model chip and voice controls bottom-right.
            No send arrow; the box itself is the affordance. Dropped in the
            compact embed, where the height is worth more than the chrome. */}
        {!compact && (
        <div className="border-t border-[#1A1A1A]/10 p-3 bg-white">
          <div className="rounded-[20px] border border-[#1A1A1A]/12 bg-white px-4 pt-3 pb-2.5 shadow-sm">
            <div className="text-[#1A1A1A]/35 text-[13.5px] mb-2.5">Write a message…</div>
            <div className="flex items-center justify-between">
              <Plus className="w-[18px] h-[18px] text-[#1A1A1A]/55" strokeWidth={1.75} />
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[12px]">
                  <span className="font-semibold text-[#1A1A1A]/75">Opus 5</span>
                  <span className="text-[#1A1A1A]/35">Medium</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#1A1A1A]/35" strokeWidth={2} />
                </span>
                <Mic className="w-[17px] h-[17px] text-[#1A1A1A]/55" strokeWidth={1.75} />
                <AudioLines className="w-[17px] h-[17px] text-[#1A1A1A]/55" strokeWidth={1.75} />
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {!compact && (
        <p className={`mt-4 text-center text-[13px] ${dark ? 'text-white/40' : 'text-[#1A1A1A]/40'}`}>
          {convo.caption}
        </p>
      )}
    </div>
  );
}
