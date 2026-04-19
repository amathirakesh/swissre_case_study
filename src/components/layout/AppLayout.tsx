import { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';
import { roleLabels } from '../../mocks/rbac';
import { useUiStore } from '../../store/ui-store';
import { DemoRole } from '../../types/rbac';

const roleOptions: DemoRole[] = ['supervisor', 'adjuster', 'reviewer'];

export function AppLayout({ children }: PropsWithChildren) {
  const activeDemoRole = useUiStore((state) => state.activeDemoRole);
  const setActiveDemoRole = useUiStore((state) => state.setActiveDemoRole);

  return (
    <div className="app-shell">
      <aside className="left-nav">
        <div className="left-nav__brand">
          <div className="left-nav__logo">CR</div>
          <div>
            <h1 className="left-nav__title">Claims Room</h1>
            <p className="left-nav__subtitle">Operations dashboard</p>
          </div>
        </div>
        <nav className="left-nav__links" aria-label="Primary">
          <NavLink className={({ isActive }) => `left-nav__link${isActive ? ' left-nav__link--active' : ''}`} to="/claims">
            Claims List
          </NavLink>
        </nav>
      </aside>
      <div className="main-panel">
        <header className="header">
          <div>
            <h2 className="header__title">Claims Portfolio</h2>
            <p className="header__meta">CRM-inspired dashboard shell for high-scale claims operations, permissions, and document workflows.</p>
          </div>
          <div className="header__actions">
            <label className="header__role-switcher">
              <span className="header__role-label">Role</span>
              <select value={activeDemoRole} onChange={(event) => setActiveDemoRole(event.target.value as DemoRole)}>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </select>
            </label>
            <button className="button button--secondary" type="button">
              Export
            </button>
            <button className="button" type="button">
              New Claim
            </button>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
