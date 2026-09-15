"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const FPS_OPTIONS = [4, 6, 8, 12, 24, 30];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function frameTimecode(frame: number, fps: number) {
  const safeFrame = Math.max(0, frame);
  const wholeSeconds = Math.floor(safeFrame / fps);
  const frames = safeFrame % fps;
  const seconds = wholeSeconds % 60;
  const minutes = Math.floor(wholeSeconds / 60) % 60;
  const hours = Math.floor(wholeSeconds / 3600);
  return [hours, minutes, seconds, frames].map((part) => String(part).padStart(2, "0")).join(":");
}

export function FrameCounter() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [sourceFps, setSourceFps] = useState(24);
  const [reviewFps, setReviewFps] = useState(24);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [inFrame, setInFrame] = useState<number | null>(null);
  const [outFrame, setOutFrame] = useState<number | null>(null);
  const [jumpValue, setJumpValue] = useState("0");

  const totalFrames = Math.max(0, Math.floor(duration * sourceFps));
  const currentFrame = clamp(Math.round(currentTime * sourceFps), 0, totalFrames);
  const sceneCount = inFrame !== null && outFrame !== null ? Math.max(0, Math.abs(outFrame - inFrame) + 1) : null;
  const playbackRate = reviewFps / sourceFps;

  const seekFrame = useCallback((frame: number) => {
    const video = videoRef.current;
    if (!video) return;
    const nextFrame = clamp(Math.round(frame), 0, Math.max(0, Math.floor(video.duration * sourceFps)));
    video.pause();
    setPlaying(false);
    video.currentTime = Math.min(video.duration || 0, nextFrame / sourceFps);
    setCurrentTime(video.currentTime);
    setJumpValue(String(nextFrame));
  }, [sourceFps]);

  const stepFrame = useCallback((direction: -1 | 1) => {
    seekFrame(currentFrame + direction);
  }, [currentFrame, seekFrame]);

  const loadFile = useCallback((file?: File) => {
    if (!file || !file.type.startsWith("video/")) return;
    const nextUrl = URL.createObjectURL(file);
    setVideoUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return nextUrl;
    });
    setFileName(file.name);
    setDuration(0);
    setCurrentTime(0);
    setPlaying(false);
    setInFrame(null);
    setOutFrame(null);
    setJumpValue("0");
  }, []);

  useEffect(() => () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
  }, [videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate;
    video.preservesPitch = false;
  }, [playbackRate, videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !("requestVideoFrameCallback" in video)) return;
    let handle = 0;
    const update = (_now: number, metadata: VideoFrameCallbackMetadata) => {
      setCurrentTime(metadata.mediaTime);
      handle = video.requestVideoFrameCallback(update);
    };
    handle = video.requestVideoFrameCallback(update);
    return () => video.cancelVideoFrameCallback(handle);
  }, [videoUrl]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) return;
      if (event.key === ",") {
        event.preventDefault();
        stepFrame(-1);
      } else if (event.key === ".") {
        event.preventDefault();
        stepFrame(1);
      } else if (event.code === "Space") {
        event.preventDefault();
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) void video.play(); else video.pause();
      } else if (event.key.toLowerCase() === "i") {
        setInFrame(currentFrame);
      } else if (event.key.toLowerCase() === "o") {
        setOutFrame(currentFrame);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentFrame, stepFrame]);

  const progress = totalFrames ? (currentFrame / totalFrames) * 100 : 0;
  const status = useMemo(() => videoUrl ? `${fileName} · ${sourceFps} FPS fuente` : "Ningún archivo cargado", [fileName, sourceFps, videoUrl]);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) await video.play(); else video.pause();
  };

  return <section className="frame-tool-shell">
    <header className="frame-tool-intro">
      <div><span>TuBio Lab / audiovisual</span><h1>Contador<br />de frames.</h1></div>
      <p>Sube un video local, recórrelo dibujo a dibujo y mide escenas sin enviar el archivo a ningún servidor.</p>
    </header>

    <div className="frame-tool-workbench">
      <div className={`frame-viewer ${dragging ? "is-dragging" : ""}`} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (event.currentTarget === event.target) setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); loadFile(event.dataTransfer.files[0]); }}>
        {videoUrl ? <video ref={videoRef} src={videoUrl} playsInline preload="metadata" onLoadedMetadata={(event) => { setDuration(event.currentTarget.duration); event.currentTarget.playbackRate = playbackRate; }} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} /> : <button className="frame-dropzone" type="button" onClick={() => fileInputRef.current?.click()}><i>＋</i><strong>Inserta un video</strong><span>Arrástralo aquí o selecciónalo desde tu dispositivo</span><small>MP4, WebM, MOV y formatos compatibles con tu navegador</small></button>}
        <input ref={fileInputRef} type="file" accept="video/*" hidden onChange={(event) => loadFile(event.target.files?.[0])} />
        {videoUrl && <div className="frame-viewer-overlay"><span>{frameTimecode(currentFrame, sourceFps)}</span><strong>FRAME {String(currentFrame).padStart(5, "0")}</strong></div>}
      </div>

      <aside className="frame-readout">
        <span>Fotograma actual</span><strong>{String(currentFrame).padStart(5, "0")}</strong>
        <div><p><small>Total estimado</small><b>{totalFrames.toLocaleString("es-CO")}</b></p><p><small>Velocidad</small><b>{playbackRate.toFixed(2)}×</b></p></div>
        <p className="frame-file-status">{status}</p>
      </aside>

      <div className="frame-timeline">
        <div className="frame-progress-labels"><span>00:00:00:00</span><b>{Math.round(progress)}%</b><span>{frameTimecode(totalFrames, sourceFps)}</span></div>
        <input aria-label="Línea de tiempo por fotogramas" type="range" min="0" max={Math.max(1, totalFrames)} value={currentFrame} disabled={!videoUrl} onChange={(event) => seekFrame(Number(event.target.value))} />
        <div className="frame-transport">
          <button type="button" disabled={!videoUrl} onClick={() => stepFrame(-1)}><kbd>,</kbd><span>Frame anterior</span></button>
          <button className="frame-play" type="button" disabled={!videoUrl} onClick={togglePlayback} aria-label={playing ? "Pausar" : "Reproducir"}>{playing ? "Ⅱ" : "▶"}</button>
          <button type="button" disabled={!videoUrl} onClick={() => stepFrame(1)}><span>Frame siguiente</span><kbd>.</kbd></button>
        </div>
      </div>
    </div>

    <div className="frame-tool-panels">
      <section className="frame-settings-panel">
        <div><span>01 / Interpretación</span><h2>Controla el tiempo.</h2></div>
        <label>FPS del archivo<select value={sourceFps} onChange={(event) => setSourceFps(Number(event.target.value))}>{FPS_OPTIONS.map((fps) => <option value={fps} key={fps}>{fps} FPS</option>)}</select><small>Debe coincidir con la exportación original.</small></label>
        <label>Reproducir a<select value={reviewFps} onChange={(event) => setReviewFps(Number(event.target.value))}>{FPS_OPTIONS.map((fps) => <option value={fps} key={fps}>{fps} FPS</option>)}</select><small>Cada frame fuente se muestra a esta cadencia.</small></label>
      </section>

      <section className="frame-scene-panel">
        <div><span>02 / Rango</span><h2>Mide una escena.</h2></div>
        <div className="frame-marks"><button type="button" disabled={!videoUrl} onClick={() => setInFrame(currentFrame)}><kbd>I</kbd><span>Inicio<strong>{inFrame ?? "—"}</strong></span></button><button type="button" disabled={!videoUrl} onClick={() => setOutFrame(currentFrame)}><kbd>O</kbd><span>Final<strong>{outFrame ?? "—"}</strong></span></button></div>
        <div className="frame-scene-total"><span>Frames en el rango</span><strong>{sceneCount ?? "—"}</strong><button type="button" onClick={() => { setInFrame(null); setOutFrame(null); }}>Limpiar</button></div>
      </section>

      <section className="frame-jump-panel">
        <span>Ir a un frame</span><form onSubmit={(event) => { event.preventDefault(); seekFrame(Number(jumpValue)); }}><input aria-label="Número de frame" inputMode="numeric" min="0" max={totalFrames} type="number" value={jumpValue} onChange={(event) => setJumpValue(event.target.value)} disabled={!videoUrl} /><button type="submit" disabled={!videoUrl}>Ir</button></form>
        <button className="frame-replace" type="button" onClick={() => fileInputRef.current?.click()}>{videoUrl ? "Cambiar video" : "Elegir video"}</button>
        <p>El archivo vive únicamente en esta pestaña. No se almacena ni se sube.</p>
      </section>
    </div>
  </section>;
}
