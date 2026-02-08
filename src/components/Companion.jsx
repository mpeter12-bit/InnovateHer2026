import { useEffect, useState, useRef } from 'react';

// ── Plant SVG stages ──
function PlantSVG({ stage, postAdultPoints = 0 }) {
  const flowers = Math.min(6, Math.floor(postAdultPoints / 5));
  const hasGlow = postAdultPoints > 0;

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: hasGlow ? 'drop-shadow(0 0 12px rgba(244, 114, 182, 0.3))' : 'none' }}>
      {/* Pot */}
      <ellipse cx="100" cy="175" rx="35" ry="8" fill="#c8a882" />
      <rect x="70" y="155" width="60" height="20" rx="4" fill="#d4a574" />
      <rect x="65" y="150" width="70" height="8" rx="3" fill="#c8a882" />

      {/* Soil */}
      <ellipse cx="100" cy="152" rx="30" ry="5" fill="#8B6F47" />

      {/* Stem - grows taller per stage */}
      {stage !== 'baby' && (
        <rect x="97" y={stage === 'adult' ? 55 : stage === 'young' ? 80 : 105} width="6" height={stage === 'adult' ? 97 : stage === 'young' ? 72 : 47} rx="3" fill="#6B9B6B" className="animate-grow" />
      )}

      {/* Baby: just a sprout */}
      {stage === 'baby' && (
        <g className="animate-sway" style={{ transformOrigin: '100px 150px' }}>
          <rect x="98" y="125" width="4" height="27" rx="2" fill="#7CB87C" />
          <ellipse cx="100" cy="122" rx="8" ry="6" fill="#9CD89C" />
          <ellipse cx="93" cy="128" rx="6" ry="4" fill="#85C985" transform="rotate(-30 93 128)" />
        </g>
      )}

      {/* Teen: small leaves */}
      {stage === 'teen' && (
        <g className="animate-sway" style={{ transformOrigin: '100px 120px' }}>
          <ellipse cx="85" cy="110" rx="14" ry="8" fill="#7CB87C" transform="rotate(-25 85 110)" />
          <ellipse cx="115" cy="100" rx="14" ry="8" fill="#85C985" transform="rotate(25 115 100)" />
          <ellipse cx="90" cy="90" rx="10" ry="6" fill="#9CD89C" transform="rotate(-15 90 90)" />
        </g>
      )}

      {/* Young: more foliage */}
      {stage === 'young' && (
        <g className="animate-sway" style={{ transformOrigin: '100px 100px' }}>
          <ellipse cx="80" cy="95" rx="18" ry="10" fill="#7CB87C" transform="rotate(-30 80 95)" />
          <ellipse cx="120" cy="90" rx="18" ry="10" fill="#85C985" transform="rotate(30 120 90)" />
          <ellipse cx="85" cy="75" rx="14" ry="8" fill="#9CD89C" transform="rotate(-15 85 75)" />
          <ellipse cx="115" cy="72" rx="14" ry="8" fill="#A8E6A8" transform="rotate(15 115 72)" />
          {/* Bud */}
          <circle cx="100" cy="65" r="8" fill="#F9A8D4" opacity="0.6" />
        </g>
      )}

      {/* Adult: full bloom */}
      {stage === 'adult' && (
        <g className={`${hasGlow ? 'animate-glow' : 'animate-sway'}`} style={{ transformOrigin: '100px 80px' }}>
          {/* Leaves */}
          <ellipse cx="75" cy="100" rx="20" ry="11" fill="#6B9B6B" transform="rotate(-35 75 100)" />
          <ellipse cx="125" cy="95" rx="20" ry="11" fill="#7CB87C" transform="rotate(35 125 95)" />
          <ellipse cx="80" cy="80" rx="16" ry="9" fill="#85C985" transform="rotate(-20 80 80)" />
          <ellipse cx="120" cy="77" rx="16" ry="9" fill="#9CD89C" transform="rotate(20 120 77)" />

          {/* Main flower */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <ellipse
              key={i}
              cx={100 + Math.cos((angle * Math.PI) / 180) * 14}
              cy={52 + Math.sin((angle * Math.PI) / 180) * 14}
              rx="10"
              ry="7"
              fill={i % 2 === 0 ? '#F9A8D4' : '#FBCFE8'}
              transform={`rotate(${angle} ${100 + Math.cos((angle * Math.PI) / 180) * 14} ${52 + Math.sin((angle * Math.PI) / 180) * 14})`}
            />
          ))}
          <circle cx="100" cy="52" r="7" fill="#FBBF24" />

          {/* Extra flowers for post-adult growth */}
          {flowers >= 1 && (
            <g className="animate-sparkle">
              <circle cx="72" cy="68" r="5" fill="#F9A8D4" />
              <circle cx="72" cy="68" r="2.5" fill="#FBBF24" />
            </g>
          )}
          {flowers >= 2 && (
            <g className="animate-sparkle" style={{ animationDelay: '0.3s' }}>
              <circle cx="128" cy="65" r="5" fill="#FBCFE8" />
              <circle cx="128" cy="65" r="2.5" fill="#FBBF24" />
            </g>
          )}
          {flowers >= 3 && (
            <g className="animate-sparkle" style={{ animationDelay: '0.6s' }}>
              <circle cx="85" cy="50" r="4" fill="#F472B6" />
              <circle cx="85" cy="50" r="2" fill="#FCD34D" />
            </g>
          )}
          {flowers >= 4 && (
            <g className="animate-sparkle" style={{ animationDelay: '0.9s' }}>
              <circle cx="118" cy="45" r="4" fill="#EC4899" />
              <circle cx="118" cy="45" r="2" fill="#FCD34D" />
            </g>
          )}
          {flowers >= 5 && (
            <g className="animate-float">
              <text x="60" y="42" fontSize="10">✨</text>
            </g>
          )}
          {flowers >= 6 && (
            <g className="animate-float" style={{ animationDelay: '1s' }}>
              <text x="130" y="38" fontSize="10">✨</text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
}

// ── Animal SVG stages ──
function AnimalSVG({ stage, postAdultPoints = 0 }) {
  const accessories = Math.min(4, Math.floor(postAdultPoints / 8));
  const isPlaying = postAdultPoints > 0;

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: isPlaying ? 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.3))' : 'none' }}>
      {/* Shadow */}
      <ellipse cx="100" cy="175" rx={stage === 'baby' ? 20 : stage === 'adult' ? 40 : 30} ry="5" fill="rgba(0,0,0,0.06)" />

      {stage === 'baby' && (
        <g className="animate-bounce-gentle" style={{ transformOrigin: '100px 150px' }}>
          {/* Tiny body */}
          <ellipse cx="100" cy="155" rx="18" ry="14" fill="#FFD4A8" />
          {/* Head */}
          <circle cx="100" cy="135" r="16" fill="#FFE0C0" />
          {/* Ears */}
          <ellipse cx="88" cy="122" rx="5" ry="8" fill="#FFD4A8" transform="rotate(-15 88 122)" />
          <ellipse cx="112" cy="122" rx="5" ry="8" fill="#FFD4A8" transform="rotate(15 112 122)" />
          {/* Inner ears */}
          <ellipse cx="88" cy="123" rx="3" ry="5" fill="#FFBDA0" transform="rotate(-15 88 123)" />
          <ellipse cx="112" cy="123" rx="3" ry="5" fill="#FFBDA0" transform="rotate(15 112 123)" />
          {/* Eyes */}
          <circle cx="94" cy="133" r="3" fill="#2f412f" />
          <circle cx="106" cy="133" r="3" fill="#2f412f" />
          <circle cx="95" cy="132" r="1" fill="white" />
          <circle cx="107" cy="132" r="1" fill="white" />
          {/* Nose */}
          <ellipse cx="100" cy="139" rx="2.5" ry="2" fill="#FFBDA0" />
          {/* Mouth */}
          <path d="M 97 141 Q 100 144 103 141" stroke="#FFBDA0" strokeWidth="1" fill="none" />
        </g>
      )}

      {stage === 'teen' && (
        <g className="animate-sway" style={{ transformOrigin: '100px 140px' }}>
          {/* Body */}
          <ellipse cx="100" cy="150" rx="25" ry="20" fill="#FFD4A8" />
          {/* Head */}
          <circle cx="100" cy="120" r="22" fill="#FFE0C0" />
          {/* Ears */}
          <ellipse cx="82" cy="103" rx="7" ry="11" fill="#FFD4A8" transform="rotate(-15 82 103)" />
          <ellipse cx="118" cy="103" rx="7" ry="11" fill="#FFD4A8" transform="rotate(15 118 103)" />
          <ellipse cx="82" cy="104" rx="4" ry="7" fill="#FFBDA0" transform="rotate(-15 82 104)" />
          <ellipse cx="118" cy="104" rx="4" ry="7" fill="#FFBDA0" transform="rotate(15 118 104)" />
          {/* Eyes */}
          <circle cx="91" cy="118" r="4" fill="#2f412f" />
          <circle cx="109" cy="118" r="4" fill="#2f412f" />
          <circle cx="92.5" cy="116.5" r="1.5" fill="white" />
          <circle cx="110.5" cy="116.5" r="1.5" fill="white" />
          {/* Nose */}
          <ellipse cx="100" cy="126" rx="3" ry="2.5" fill="#FFBDA0" />
          <path d="M 95 129 Q 100 133 105 129" stroke="#FFBDA0" strokeWidth="1.2" fill="none" />
          {/* Tail */}
          <path d="M 125 148 Q 140 135 135 155" stroke="#FFD4A8" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Paws */}
          <ellipse cx="85" cy="168" rx="6" ry="4" fill="#FFE0C0" />
          <ellipse cx="115" cy="168" rx="6" ry="4" fill="#FFE0C0" />
        </g>
      )}

      {stage === 'young' && (
        <g className="animate-sway" style={{ transformOrigin: '100px 130px' }}>
          {/* Body */}
          <ellipse cx="100" cy="145" rx="30" ry="24" fill="#FFD4A8" />
          {/* Head */}
          <circle cx="100" cy="108" r="26" fill="#FFE0C0" />
          {/* Ears */}
          <ellipse cx="78" cy="88" rx="8" ry="13" fill="#FFD4A8" transform="rotate(-15 78 88)" />
          <ellipse cx="122" cy="88" rx="8" ry="13" fill="#FFD4A8" transform="rotate(15 122 88)" />
          <ellipse cx="78" cy="89" rx="5" ry="8" fill="#FFBDA0" transform="rotate(-15 78 89)" />
          <ellipse cx="122" cy="89" rx="5" ry="8" fill="#FFBDA0" transform="rotate(15 122 89)" />
          {/* Eyes - slightly happy */}
          <path d="M 87 106 Q 91 102 95 106" stroke="#2f412f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 105 106 Q 109 102 113 106" stroke="#2f412f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Blush */}
          <circle cx="83" cy="112" r="5" fill="#FFB8C6" opacity="0.4" />
          <circle cx="117" cy="112" r="5" fill="#FFB8C6" opacity="0.4" />
          {/* Nose */}
          <ellipse cx="100" cy="114" rx="3.5" ry="2.5" fill="#FFBDA0" />
          <path d="M 95 117 Q 100 121 105 117" stroke="#FFBDA0" strokeWidth="1.5" fill="none" />
          {/* Tail */}
          <path d="M 130 140 Q 150 120 145 150" stroke="#FFD4A8" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Paws */}
          <ellipse cx="80" cy="167" rx="8" ry="5" fill="#FFE0C0" />
          <ellipse cx="120" cy="167" rx="8" ry="5" fill="#FFE0C0" />
        </g>
      )}

      {stage === 'adult' && (
        <g className={isPlaying ? 'animate-bounce-gentle' : 'animate-sway'} style={{ transformOrigin: '100px 120px' }}>
          {/* Body */}
          <ellipse cx="100" cy="140" rx="35" ry="28" fill="#FFD4A8" />
          {/* Belly */}
          <ellipse cx="100" cy="148" rx="22" ry="18" fill="#FFE8D0" />
          {/* Head */}
          <circle cx="100" cy="98" r="30" fill="#FFE0C0" />
          {/* Ears */}
          <ellipse cx="74" cy="74" rx="9" ry="15" fill="#FFD4A8" transform="rotate(-15 74 74)" />
          <ellipse cx="126" cy="74" rx="9" ry="15" fill="#FFD4A8" transform="rotate(15 126 74)" />
          <ellipse cx="74" cy="75" rx="5.5" ry="9" fill="#FFBDA0" transform="rotate(-15 74 75)" />
          <ellipse cx="126" cy="75" rx="5.5" ry="9" fill="#FFBDA0" transform="rotate(15 126 75)" />
          {/* Happy closed eyes */}
          <path d="M 85 96 Q 90 91 95 96" stroke="#2f412f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 105 96 Q 110 91 115 96" stroke="#2f412f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Blush */}
          <circle cx="80" cy="103" r="6" fill="#FFB8C6" opacity="0.4" />
          <circle cx="120" cy="103" r="6" fill="#FFB8C6" opacity="0.4" />
          {/* Nose */}
          <ellipse cx="100" cy="104" rx="4" ry="3" fill="#FFBDA0" />
          <path d="M 94 108 Q 100 113 106 108" stroke="#FFBDA0" strokeWidth="1.5" fill="none" />
          {/* Whiskers */}
          <line x1="70" y1="102" x2="83" y2="104" stroke="#DDB892" strokeWidth="0.8" />
          <line x1="70" y1="108" x2="83" y2="108" stroke="#DDB892" strokeWidth="0.8" />
          <line x1="117" y1="104" x2="130" y2="102" stroke="#DDB892" strokeWidth="0.8" />
          <line x1="117" y1="108" x2="130" y2="108" stroke="#DDB892" strokeWidth="0.8" />
          {/* Tail */}
          <path d="M 135 135 Q 158 110 152 148" stroke="#FFD4A8" strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* Paws */}
          <ellipse cx="75" cy="166" rx="10" ry="6" fill="#FFE0C0" />
          <ellipse cx="125" cy="166" rx="10" ry="6" fill="#FFE0C0" />

          {/* Post-adult accessories */}
          {accessories >= 1 && (
            <g className="animate-sparkle">
              {/* Crown / flower on head */}
              <text x="92" y="68" fontSize="14">🌼</text>
            </g>
          )}
          {accessories >= 2 && (
            <g className="animate-sparkle" style={{ animationDelay: '0.5s' }}>
              {/* Bow tie */}
              <text x="92" y="125" fontSize="12">🎀</text>
            </g>
          )}
          {accessories >= 3 && (
            <g className="animate-float">
              <text x="140" y="90" fontSize="10">✨</text>
              <text x="52" y="85" fontSize="10">✨</text>
            </g>
          )}
          {accessories >= 4 && (
            <g className="animate-float" style={{ animationDelay: '0.7s' }}>
              <text x="45" y="65" fontSize="8">💫</text>
              <text x="145" y="60" fontSize="8">💫</text>
              <text x="95" y="55" fontSize="8">🌟</text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
}

// ── Main Companion Component ──
export default function Companion({ type, totalPoints, companionName, onRename }) {
  const [particles, setParticles] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const nameInputRef = useRef(null);
  const stage = totalPoints >= 50 ? 'adult' : totalPoints >= 25 ? 'young' : totalPoints >= 10 ? 'teen' : 'baby';
  const postAdultPoints = stage === 'adult' ? totalPoints - 50 : 0;

  // Spawn particles on point gain for adult companions
  useEffect(() => {
    if (postAdultPoints > 0) {
      const id = Date.now();
      const newParticles = Array.from({ length: 3 }, (_, i) => ({
        id: `${id}-${i}`,
        x: 30 + Math.random() * 40,
        y: 20 + Math.random() * 30,
        emoji: ['✨', '🌸', '💖', '🌟', '🫧'][Math.floor(Math.random() * 5)],
      }));
      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
      }, 1600);
    }
  }, [postAdultPoints]);

  const stageLabel = { baby: 'Sprout', teen: 'Growing', young: 'Maturing', adult: 'Fully Bloomed' }[stage];
  const nextThreshold = stage === 'baby' ? 10 : stage === 'teen' ? 25 : stage === 'young' ? 50 : null;
  const progress = nextThreshold
    ? ((totalPoints - (stage === 'baby' ? 0 : stage === 'teen' ? 10 : 25)) / (nextThreshold - (stage === 'baby' ? 0 : stage === 'teen' ? 10 : 25))) * 100
    : 100;

  return (
    <div
      className="rounded-3xl p-3 relative overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-soft)',
        border: '1px solid rgba(119, 154, 119, 0.1)',
      }}
    >
      {/* Particles */}
      {particles.map((p) => (
        <span key={p.id} className="particle text-lg" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          {p.emoji}
        </span>
      ))}

      {/* Companion art */}
      <div className="w-48 h-48 mx-auto mb-4">
        {type === 'plant' ? (
          <PlantSVG stage={stage} postAdultPoints={postAdultPoints} />
        ) : (
          <AnimalSVG stage={stage} postAdultPoints={postAdultPoints} />
        )}
      </div>

      {/* Stage info */}
      <div className="text-center">
        {/* Editable companion name */}
        {editingName ? (
          <input
            ref={nameInputRef}
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={() => {
              onRename(nameInput.trim());
              setEditingName(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { onRename(nameInput.trim()); setEditingName(false); }
              if (e.key === 'Escape') setEditingName(false);
            }}
            maxLength={24}
            className="text-sm text-center rounded-lg px-2 py-1 outline-none focus:ring-2 mb-1"
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(119, 154, 119, 0.3)',
              '--tw-ring-color': 'var(--accent-sage)',
            }}
            autoFocus
            placeholder="Name your companion…"
          />
        ) : (
          <button
            onClick={() => { setNameInput(companionName || ''); setEditingName(true); }}
            className="font-display text-lg font-medium mb-1 transition-all hover:opacity-70"
            style={{ color: companionName ? 'var(--text-primary)' : 'var(--text-muted)' }}
            title="Click to name your companion"
          >
            {companionName || 'Give me a name ✏️'}
          </button>
        )}

        <h3 className="text-sm" style={{ color: 'var(--text-primary)' }}>
          {type === 'plant' ? '🌿' : '🐾'} {stageLabel}
        </h3>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          {totalPoints} growth points earned
          {stage === 'adult' && postAdultPoints > 0 && ` · ${postAdultPoints} bonus points!`}
        </p>

        {/* Progress bar */}
        <div className="mt-3 mx-auto max-w-[200px]">
          {stage !== 'adult' ? (
            <>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min(100, progress)}%`,
                    background: 'linear-gradient(90deg, var(--accent-sage), var(--accent-bloom))',
                  }}
                />
              </div>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                {nextThreshold - totalPoints} points to next stage
              </p>
            </>
          ) : (
            <p className="text-xs font-medium" style={{ color: 'var(--accent-bloom)' }}>
              ✨ Fully grown — each habit adds joy & sparkle!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
