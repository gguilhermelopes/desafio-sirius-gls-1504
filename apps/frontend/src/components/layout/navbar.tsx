import { AuthUser } from "@juscash/shared";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function Navbar({ user }: { user: AuthUser }) {
  return (
    <header className="dash-navbar">
      <div className="dash-navbar-left">
        <button className="dash-navbar-toggle" type="button" aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" />
          </svg>
        </button>
        <img alt="JusCash" className="dash-navbar-logo" src="/logos/logo.png" height="24" width="160" />
      </div>
      <div className="dash-navbar-right">
        <div className="dash-avatar">
          <span className="dash-avatar-initials">{getInitials(user.name)}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </header>
  );
}
