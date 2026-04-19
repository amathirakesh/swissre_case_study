import { roleLabels, roleScopeDescriptions } from '../mocks/rbac';
import { useUiStore } from '../store/ui-store';
import { DemoRole } from '../types/rbac';

const roleOptions: Array<{ value: DemoRole; label: string }> = [
  { value: 'supervisor', label: roleLabels.supervisor },
  { value: 'adjuster', label: roleLabels.adjuster },
  { value: 'reviewer', label: roleLabels.reviewer },
];

const policyLabels: Record<string, string> = {
  canEditClaim: 'Edit claims',
  canDeleteClaim: 'Delete claims',
  canAssignClaim: 'Assign claims',
  canOpenDocument: 'Open documents',
  canAnnotate: 'Annotate pages',
  canComment: 'Write comments',
  canSplitDocument: 'Split documents',
  canMergeDocument: 'Merge documents',
};

export function DemoPolicyPanel() {
  const activeDemoRole = useUiStore((state) => state.activeDemoRole);
  const setActiveDemoRole = useUiStore((state) => state.setActiveDemoRole);
  const policies = useUiStore((state) => state.getActivePolicies());

  return (
    <section className="card policy-panel">
      <div className="section-header">
        <div>
          <h3 className="section-title">Demo RBAC Policies</h3>
          <p className="section-copy">{roleScopeDescriptions[activeDemoRole]}</p>
        </div>
        <select
          aria-label="Select demo role"
          className="role-select"
          value={activeDemoRole}
          onChange={(event) => setActiveDemoRole(event.target.value as DemoRole)}
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="policy-role-banner">
        <strong>{roleLabels[activeDemoRole]}</strong>
        <span>Backend filters records and capabilities; frontend mirrors them for UX.</span>
      </div>

      <div className="policy-chip-grid">
        {Object.entries(policies).map(([key, allowed]) => (
          <div className={`policy-chip${allowed ? ' policy-chip--allowed' : ' policy-chip--blocked'}`} key={key}>
            <span>{policyLabels[key]}</span>
            <strong>{allowed ? 'Allowed' : 'Blocked'}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
