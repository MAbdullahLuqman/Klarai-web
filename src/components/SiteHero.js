export default function SiteHero({ eyebrow, children, description, actions }) {
  return <header className="site-hero home-container">
    {eyebrow && <p className="home-eyebrow">{eyebrow}</p>}
    <h1>{children}</h1>
    {description && <p className="site-hero-description">{description}</p>}
    {actions && <div className="home-actions">{actions}</div>}
  </header>;
}
