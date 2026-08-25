export function HeroPreview() {
  return (
    <div className="hero-preview" aria-label="Vista previa de landing responsive">
      <div className="hero-orbit" aria-hidden="true" />
      <div className="preview-window">
        <div className="preview-bar">
          <span />
          <span />
          <span />
        </div>
        <div className="preview-hero">
          <div className="preview-copy">
            <div className="line line-wide" />
            <div className="line line-mid" />
            <div className="line line-short" />
          </div>
          <div className="preview-card" />
        </div>
        <div className="preview-grid">
          <div />
          <div />
          <div />
        </div>
      </div>
      <div className="hero-artifact" aria-hidden="true" />
    </div>
  );
}
