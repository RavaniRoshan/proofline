'use client';

import { useEffect, useRef, useState, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Emoji } from '@usespaceui/emoji/react';
import * as sounds from '@usespaceui/sounds';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (t: number, from: number, to: number) => clamp01((t - from) / (to - from));
const easeSmoothOut = (p: number) => 1 - (1 - p) ** 5;
const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;

const STAGE_W = 1920;
const STAGE_H = 1080;
const TOTAL = 10;

type SceneProps = { t: number; d: number; globalT: number };

function Kinetic({
  text,
  t,
  at,
  dur = 0.5,
  stagger = 0.04,
  rise = 12,
  blur = 8,
  outAt,
  outDur = 0.25,
  className = '',
  style = {},
}: {
  text: string;
  t: number;
  at: number;
  dur?: number;
  stagger?: number;
  rise?: number;
  blur?: number;
  outAt?: number;
  outDur?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const words = text.split(' ');
  return (
    <span className={className} style={style}>
      {words.map((w, i) => {
        const wAt = at + i * stagger;
        const p = easeSmoothOut(seg(t, wAt, wAt + dur));
        const outP = outAt ? easeSmoothOut(seg(t, outAt, outAt + outDur)) : 0;
        const opacity = p * (1 - outP);
        const y = (1 - p) * rise - outP * rise * 0.6;
        const b = (1 - p) * blur + outP * blur * 0.5;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity,
              transform: `translateY(${y}px)`,
              filter: `blur(${b}px)`,
              marginRight: '0.22em',
              willChange: 'transform, opacity, filter',
            }}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
}

function BlurSwap({
  items,
  t,
  times,
  dur = 0.3,
  style = {},
}: {
  items: string[];
  t: number;
  times: number[];
  dur?: number;
  style?: React.CSSProperties;
}) {
  let idx = 0;
  for (let i = 0; i < times.length; i++) if (t >= times[i]) idx = i;
  const prevIdx = Math.max(0, idx - 1);
  return (
    <span style={{ position: 'relative', display: 'inline-grid', ...style }}>
      {items.map((it, i) => {
        const active = i === idx;
        let opacity = 0;
        let blur = 8;
        if (active) {
          const p = easeSmoothOut(seg(t, times[idx], times[idx] + dur));
          opacity = p;
          blur = (1 - p) * 8;
        } else if (i === prevIdx && idx !== prevIdx) {
          const p = easeSmoothOut(seg(t, times[idx], times[idx] + dur));
          opacity = 1 - p;
          blur = p * 8;
        }
        return (
          <span
            key={i}
            style={{
              gridArea: '1 / 1',
              opacity,
              filter: `blur(${blur}px)`,
              transition: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {it}
          </span>
        );
      })}
    </span>
  );
}

function CountUp({
  value,
  t,
  at,
  dur = 1,
  suffix = '',
}: {
  value: number;
  t: number;
  at: number;
  dur?: number;
  suffix?: string;
}) {
  const p = easeOutCubic(seg(t, at, at + dur));
  const n = Math.round(value * p);
  const showSuffix = seg(t, at + dur, at + dur + 0.2) > 0.5;
  return (
    <span>
      {n}
      <span style={{ opacity: showSuffix ? 1 : 0, marginLeft: 4 }}>{suffix}</span>
    </span>
  );
}

function SceneOpener({ t, globalT }: SceneProps) {
  const p = easeSmoothOut(seg(t, 0, 0.6));
  const emojiP = easeSmoothOut(seg(t, 0.6, 0.9));
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <div
        style={{
          opacity: p,
          transform: `scale(${0.96 + 0.04 * p})`,
          filter: `blur(${(1 - p) * 8}px)`,
          fontSize: 120,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#1a1a1a',
        }}
      >
        Proofline
      </div>
      <div style={{ fontSize: 36, color: '#555', opacity: p, transform: `translateY(${(1 - p) * 12}px)`, filter: `blur(${(1 - p) * 8}px)` }}>
        <Kinetic text="claim-evidence preflight for marketing copy" t={globalT} at={0.3} dur={0.4} stagger={0.035} />
      </div>
      <div style={{ opacity: emojiP, transform: `scale(${0.6 + 0.4 * emojiP}) rotate(${-20 + 20 * emojiP}deg)`, marginTop: 8 }}>
        <Emoji emoji="🎯" source="telegram" type="anim" size={72} fallback />
      </div>
    </div>
  );
}

function SceneProblem({ globalT }: SceneProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 700, color: '#1a1a1a' }}>
        <Kinetic text="Your draft makes claims." t={globalT} at={1.4} dur={0.45} stagger={0.04} />
      </div>
      <div style={{ fontSize: 72, fontWeight: 700, color: '#8B1E27' }}>
        <Kinetic text="Most ship unchecked." t={globalT} at={1.9} dur={0.45} stagger={0.04} />
      </div>
    </div>
  );
}

function SceneClaim({ t }: SceneProps) {
  const p = easeSmoothOut(seg(t, 0, 0.5));
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
      }}
    >
      <div style={{ fontSize: 28, color: '#888', opacity: p }}>A real claim from a real draft:</div>
      <div
        style={{
          fontSize: 52,
          fontWeight: 600,
          color: '#1a1a1a',
          maxWidth: 1400,
          textAlign: 'center',
          lineHeight: 1.3,
          opacity: p,
          transform: `translateY(${(1 - p) * 12}px)`,
          filter: `blur(${(1 - p) * 8}px)`,
        }}
      >
        &ldquo;Cut costs by{' '}
        <span style={{ background: 'rgba(139,30,39,0.12)', borderBottom: '3px solid #8B1E27', padding: '0 6px', borderRadius: 4 }}>
          40% with Acme Pro
        </span>
        .&rdquo;
      </div>
    </div>
  );
}

function SceneVerdict({ t }: SceneProps) {
  const badgeP = easeSmoothOut(seg(t, 0, 0.4));
  const cardP = easeSmoothOut(seg(t, 0.3, 0.75));
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
      }}
    >
      <div
        style={{
          opacity: badgeP,
          transform: `scale(${0.94 + 0.06 * badgeP})`,
          filter: `blur(${(1 - badgeP) * 8}px)`,
          fontSize: 80,
          fontWeight: 800,
          color: '#fff',
          background: '#8B1E27',
          padding: '12px 36px',
          borderRadius: 16,
          letterSpacing: '0.02em',
        }}
      >
        CONTRADICTED
      </div>
      <div
        style={{
          opacity: cardP,
          transform: `translateY(${(1 - cardP) * 12}px)`,
          filter: `blur(${(1 - cardP) * 6}px)`,
          background: '#f4f4f5',
          border: '1px solid #e4e4e7',
          borderRadius: 16,
          padding: '24px 32px',
          width: 760,
          fontSize: 22,
          color: '#333',
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>Evidence record</div>
        <div>source: <b>pricing_sheet_v3.pdf</b></div>
        <div>span: <b>&ldquo;Acme Pro saves 25%&rdquo;</b> (chars 412–431)</div>
        <div>version: <b>v3</b> · valid 2026-01-01 → 2026-09-30</div>
        <div style={{ marginTop: 8, color: '#8B1E27', fontWeight: 600 }}>claim said 40% · source says 25%</div>
      </div>
    </div>
  );
}

function SceneGuarantee({ t, globalT }: SceneProps) {
  const p = easeSmoothOut(seg(t, 0, 0.5));
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 700, color: '#1a1a1a' }}>
        <Kinetic text="No verdict without evidence." t={globalT} at={6.0} dur={0.4} stagger={0.04} />
      </div>
      <div style={{ fontSize: 48, fontWeight: 600, color: '#555' }}>
        <BlurSwap items={['CONTRADICTED', 'UNVERIFIED']} t={globalT} times={[6.0, 6.9]} dur={0.3} />
        <span style={{ marginLeft: 12, fontSize: 32, color: '#888' }}>instead.</span>
      </div>
      <div style={{ fontSize: 24, color: '#999', opacity: p }}>missing evidence downgrades the verdict</div>
    </div>
  );
}

function SceneSpeed({ globalT }: SceneProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <div style={{ fontSize: 140, fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>
        <CountUp value={78} t={globalT} at={7.2} dur={0.9} suffix="%" />
      </div>
      <div style={{ fontSize: 40, fontWeight: 600, color: '#555' }}>
        <Kinetic text="resolve in 0.4ms." t={globalT} at={7.5} dur={0.4} stagger={0.04} />
      </div>
      <div style={{ fontSize: 32, color: '#888', opacity: easeSmoothOut(seg(globalT, 7.9, 8.2)) }}>
        Zero model cost.
      </div>
    </div>
  );
}

function SceneClosing({ t }: SceneProps) {
  const p = easeSmoothOut(seg(t, 0, 0.6));
  const emojiP = easeSmoothOut(seg(t, 0.6, 0.9));
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <div
        style={{
          opacity: p,
          transform: `scale(${0.96 + 0.04 * p})`,
          filter: `blur(${(1 - p) * 8}px)`,
          fontSize: 80,
          fontWeight: 800,
          color: '#1a1a1a',
        }}
      >
        Ship claims you can prove.
      </div>
      <div style={{ fontSize: 30, color: '#888', opacity: p }}>proofline-sigma.vercel.app</div>
      <div style={{ opacity: emojiP, transform: `scale(${0.6 + 0.4 * emojiP}) rotate(${-20 + 20 * emojiP}deg)` }}>
        <Emoji emoji="✅" source="telegram" type="anim" size={64} fallback />
      </div>
    </div>
  );
}

const BEATS: { id: string; duration: number; Component: React.ComponentType<SceneProps>; cues?: { at: number; play: () => void }[]; preRoll?: number }[] = [
  { id: 'opener', duration: 1.4, Component: SceneOpener, cues: [{ at: 0.9, play: () => sounds.whisper({ volume: 0.6 }) }], preRoll: 2.5 },
  { id: 'problem', duration: 1.4, Component: SceneProblem, preRoll: 1.2 },
  { id: 'claim', duration: 1.4, Component: SceneClaim, preRoll: 1.2 },
  { id: 'verdict', duration: 1.8, Component: SceneVerdict, cues: [{ at: 0.4, play: () => sounds.confirm({ volume: 0.8 }) }], preRoll: 1.5 },
  { id: 'guarantee', duration: 1.2, Component: SceneGuarantee, preRoll: 1.2 },
  { id: 'speed', duration: 1.2, Component: SceneSpeed, preRoll: 1.2 },
  { id: 'closing', duration: 1.6, Component: SceneClosing, cues: [{ at: 0.6, play: () => sounds.sparkle({ volume: 0.7 }) }], preRoll: 2.0 },
];

const SCENES = BEATS.reduce<{ id: string; start: number; duration: number; Component: React.ComponentType<SceneProps>; cues?: { at: number; play: () => void }[]; preRoll?: number }[]>(
  (acc, b) => {
    const start = acc.length ? acc[acc.length - 1].start + acc[acc.length - 1].duration : 0;
    return [...acc, { ...b, start }];
  },
  [],
);

function OpenerPage() {
  const params = useSearchParams();
  const renderMode = params.get('render') === '1';
  const initialT = parseFloat(params.get('t') || '0') || 0;

  const [time, setTime] = useState(initialT);
  const [playing, setPlaying] = useState(false);
  const [scale, setScale] = useState(1);
  const [muted, setMuted] = useState(false);
  const [effectsOn, setEffectsOn] = useState(true);

  const timeRef = useRef(time);
  const lastRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const firedCuesRef = useRef<Set<string>>(new Set());
  const stageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { timeRef.current = time; }, [time]);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setScale(Math.min(w / STAGE_W, h / STAGE_H));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); setPlaying((p) => !p); }
      else if (e.code === 'ArrowRight') { setTime((t) => Math.min(TOTAL, t + 1)); }
      else if (e.code === 'ArrowLeft') { setTime((t) => Math.max(0, t - 1)); }
      else if (e.key.toLowerCase() === 'r') { setTime(0); firedCuesRef.current.clear(); }
      else if (e.key.toLowerCase() === 'm') { setMuted((m) => !m); }
      else if (e.key.toLowerCase() === 's') { setEffectsOn((s) => !s); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = null;
      return;
    }
    const tick = (now: number) => {
      if (lastRef.current == null) lastRef.current = now;
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      setTime((prev) => {
        let next = prev + dt;
        if (next >= TOTAL) {
          next = 0;
          firedCuesRef.current.clear();
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playing]);

  const scenesWithGlobalCues = useMemo(() => {
    return SCENES.map((sc) => ({
      ...sc,
      cues: (sc.cues || []).map((c) => ({ at: sc.start + c.at, play: c.play })),
    }));
  }, []);

  const scenesRef = useRef(scenesWithGlobalCues);
  useEffect(() => { scenesRef.current = scenesWithGlobalCues; }, [scenesWithGlobalCues]);

  const prevTimeRef = useRef(time);
  useEffect(() => {
    if (!playing) { prevTimeRef.current = time; return; }
    const prev = prevTimeRef.current;
    for (const sc of scenesRef.current) {
      for (const c of sc.cues || []) {
        const key = `${sc.id}-${c.at}`;
        if (!firedCuesRef.current.has(key) && prev < c.at && time >= c.at) {
          firedCuesRef.current.add(key);
          if (effectsOn && !muted) c.play();
        }
      }
    }
    prevTimeRef.current = time;
  }, [time, playing, effectsOn, muted]);

  const visibleScenes = useMemo(() => {
    return scenesWithGlobalCues.filter((sc) => {
      const preRoll = sc.preRoll || 1.2;
      return time >= sc.start - preRoll && time <= sc.start + sc.duration + 0.4;
    });
  }, [time, scenesWithGlobalCues]);

  const activeScene = useMemo(() => {
    return scenesWithGlobalCues.find((sc) => time >= sc.start && time < sc.start + sc.duration) || scenesWithGlobalCues[scenesWithGlobalCues.length - 1];
  }, [time, scenesWithGlobalCues]);

  const [warmed, setWarmed] = useState(renderMode);
  useEffect(() => {
    if (renderMode) {
      setWarmed(true);
      (window as any).__openerReady = true;
      (window as any).__openerSeek = (t: number) => setTime(t);
      return;
    }
    const id = setTimeout(() => { setWarmed(true); (window as any).__openerReady = true; }, 800);
    return () => clearTimeout(id);
  }, [renderMode]);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);

  const seek = useCallback((v: number) => {
    setTime(clamp01(v / 100) * TOTAL);
    firedCuesRef.current.clear();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a0a',
        color: '#fff',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: STAGE_W,
          height: STAGE_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
          background: '#fafafa',
          borderRadius: renderMode ? 0 : 8,
          overflow: 'hidden',
          boxShadow: renderMode ? 'none' : '0 40px 120px rgba(0,0,0,0.5)',
        }}
      >
        <div ref={stageRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
          {!warmed && (
            <div style={{ position: 'absolute', inset: 0, visibility: 'hidden', pointerEvents: 'none' }}>
              {scenesWithGlobalCues.map((sc) => (
                <sc.Component key={`warm-${sc.id}`} t={sc.duration * 0.75} d={sc.duration} globalT={sc.start + sc.duration * 0.75} />
              ))}
            </div>
          )}
          {visibleScenes.map((sc) => {
            const localT = time - sc.start;
            const isActive = time >= sc.start && time < sc.start + sc.duration;
            const preMount = time < sc.start;
            const hidden = preMount;
            return (
              <div
                key={sc.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                  visibility: hidden ? 'hidden' : 'visible',
                  opacity: isActive ? 1 : (time > sc.start + sc.duration ? 0 : 0.001),
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <sc.Component t={Math.max(0, localT)} d={sc.duration} globalT={time} />
              </div>
            );
          })}
        </div>
      </div>

      {!renderMode && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            zIndex: 50,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            padding: '16px 24px',
            borderRadius: 16,
            minWidth: 600,
          }}
        >
          <div style={{ fontSize: 14, color: '#aaa', marginBottom: 4 }}>
            {activeScene?.id} · {time.toFixed(2)}s / {TOTAL}s
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={(time / TOTAL) * 100}
            onChange={(e) => seek(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={() => { setTime(0); firedCuesRef.current.clear(); }} style={btnStyle}>Restart (R)</button>
            <button onClick={togglePlay} style={btnStyle}>{playing ? 'Pause (Space)' : 'Play (Space)'}</button>
            <button onClick={() => setTime((t) => Math.max(0, t - 1))} style={btnStyle}>-1s</button>
            <button onClick={() => setTime((t) => Math.min(TOTAL, t + 1))} style={btnStyle}>+1s</button>
            <button onClick={() => setMuted((m) => !m)} style={btnStyle}>{muted ? 'Unmute (M)' : 'Mute (M)'}</button>
            <button onClick={() => setEffectsOn((s) => !s)} style={btnStyle}>{effectsOn ? 'FX on (S)' : 'FX off (S)'}</button>
          </div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
            Space play/pause · ←/→ ±1s · R restart · M mute · S effects · ?t=12.5 seek · ?render=1 chromeless
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: '#222',
  color: '#fff',
  border: '1px solid #444',
  borderRadius: 8,
  padding: '6px 12px',
  fontSize: 12,
  cursor: 'pointer',
};

export default function Page() {
  return (
    <Suspense fallback={<div style={{ background: '#0a0a0a', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>}>
      <OpenerPage />
    </Suspense>
  );
}
