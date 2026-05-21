/* ═══════════════════════════════════════════════
   ADMIN VIEW v2 — User Management + Audit Log
   ═══════════════════════════════════════════════ */

/* ── Audit View ── */
const AuditView = () => {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const handler = () => setTick(t => t + 1);
    window.addEventListener('vencidos_data_changed', handler);
    return () => window.removeEventListener('vencidos_data_changed', handler);
  }, []);

  const log = window.MOCK.AUDIT_LOG;
  const [filterUser, setFilterUser] = React.useState('Todos');
  const [filterAction, setFilterAction] = React.useState('Todos');
  const [search, setSearch] = React.useState('');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');

  const users = ['Todos', ...new Set(log.map(l => l.user))];
  const actions = ['Todos', ...new Set(log.map(l => l.action))];

  const filtered = log.filter(l => {
    if (filterUser !== 'Todos' && l.user !== filterUser) return false;
    if (filterAction !== 'Todos' && l.action !== filterAction) return false;
    if (dateFrom && l.timestamp.split('T')[0] < dateFrom) return false;
    if (dateTo && l.timestamp.split('T')[0] > dateTo) return false;
    if (search && !l.detail.toLowerCase().includes(search.toLowerCase()) && !l.user.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const roleColors = {
    admin: { bg: 'var(--status-danger-bg)', color: 'var(--status-danger)' },
    supervisor: { bg: 'var(--status-info-bg)', color: 'var(--status-info)' },
    sala: { bg: 'var(--status-success-bg)', color: 'var(--status-success)' },
  };

  const actionIcons = {
    'Registró producto': 'M12 4v16m8-8H4',
    'Cambió estado': 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    'Asignó acción': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    'Exportó reporte': 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'Completó registro': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    'Eliminó producto': 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    'Editó producto': 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    'Inicio sesión': 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1',
    'Aprobó traspaso': 'M5 13l4 4L19 7',
    'Generó consolidado': 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'Creó usuario': 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    'Asignó sala': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5',
  };

  const as = {
    container: { padding: '24px', maxWidth: 1000, margin: '0 auto' },
    header: {
      display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'flex-end',
    },
    searchField: { flex: '1 1 200px' },
    filterField: { flex: '0 0 170px' },
    dateField: { flex: '0 0 150px' },
    filterLabel: {
      fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
      marginBottom: 4, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em',
    },
    timeline: { position: 'relative', paddingLeft: 28 },
    timelineLine: {
      position: 'absolute', left: 13, top: 0, bottom: 0, width: 2,
      background: 'var(--border-color)', borderRadius: 1,
    },
    entry: {
      position: 'relative', paddingBottom: 2, marginBottom: 4,
      animation: 'slideRight 0.35s cubic-bezier(0.16,1,0.3,1) both',
    },
    dot: {
      position: 'absolute', left: -22, top: 14, width: 12, height: 12,
      borderRadius: '50%', background: 'var(--accent)',
      border: '2px solid var(--bg-primary)',
    },
    card: {
      background: 'var(--card-bg)', border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)', padding: '8px 12px',
      transition: 'all var(--transition-fast)',
    },
    cardTop: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    userRow: { display: 'flex', alignItems: 'center', gap: 8 },
    avatar: (role) => ({
      width: 24, height: 24, borderRadius: 6, fontSize: 9, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: roleColors[role]?.bg || 'var(--bg-tertiary)',
      color: roleColors[role]?.color || 'var(--text-secondary)',
    }),
    userName: { fontSize: 13, fontWeight: 600 },
    roleBadge: (role) => ({
      fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 'var(--radius-full)',
      background: roleColors[role]?.bg || 'var(--bg-tertiary)',
      color: roleColors[role]?.color || 'var(--text-secondary)',
      textTransform: 'capitalize',
    }),
    timestamp: { fontSize: 11, color: 'var(--text-tertiary)' },
    actionIconMini: {
      width: 18, height: 18, borderRadius: 4, display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
      flexShrink: 0,
    },
    actionText: { fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' },
    detailRow: { paddingLeft: 32, marginTop: 2 },
    detailText: { fontSize: 12, color: 'var(--text-secondary)' },
    count: {
      fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 16, fontWeight: 500,
    },
  };

  return (
    <div style={as.container}>
      <div style={as.header}>
        <div style={as.searchField}>
          <div style={as.filterLabel}>Buscar</div>
          <input placeholder="Buscar en auditoría..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ fontSize: 13 }} />
        </div>
        <div style={as.filterField}>
          <div style={as.filterLabel}>Usuario</div>
          <CustomSelect value={filterUser} onChange={setFilterUser}
            options={users.map(u => ({ label: u, value: u }))} />
        </div>
        <div style={as.filterField}>
          <div style={as.filterLabel}>Acción</div>
          <CustomSelect value={filterAction} onChange={setFilterAction}
            options={actions.map(a => ({ label: a, value: a }))} />
        </div>
        <div style={as.dateField}>
          <div style={as.filterLabel}>Desde</div>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ fontSize: 13 }} />
        </div>
        <div style={as.dateField}>
          <div style={as.filterLabel}>Hasta</div>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ fontSize: 13 }} />
        </div>
      </div>

      <div style={as.count}>{filtered.length} registros de auditoría</div>

      <div style={as.timeline}>
        <div style={as.timelineLine}></div>
        {filtered.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '60px 20px', color: 'var(--text-tertiary)' }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-secondary)' }}>Sin registros</div>
            <div style={{ fontSize: 13 }}>No hay actividad registrada aún.</div>
          </div>
        )}
        {filtered.slice(0, 50).map((entry, i) => (
          <div key={entry.id} style={{...as.entry, animationDelay: `${Math.min(i * 40, 400)}ms`}}>
            <div style={as.dot}></div>
            <div style={as.card}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
              <div style={as.cardTop}>
                <div style={as.userRow}>
                  <div style={as.avatar(entry.role)}>{entry.avatar}</div>
                  <span style={as.userName}>{entry.user}</span>
                  <span style={as.roleBadge(entry.role)}>{entry.role}</span>
                  <span style={{ color: 'var(--text-tertiary)', margin: '0 4px' }}>·</span>
                  <div style={as.actionIconMini}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={actionIcons[entry.action] || 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'}/>
                    </svg>
                  </div>
                  <span style={as.actionText}>{entry.action}</span>
                </div>
                <div style={as.timestamp}>{entry.date} · {entry.time}</div>
              </div>
              {entry.detail && (
                <div style={as.detailRow}>
                  <div style={as.detailText}>{entry.detail}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   USERS VIEW — Full user management (Admin only)
   ═══════════════════════════════════════════════ */

const UsersView = () => {
  const [users, setUsers] = React.useState(() => [...window.MOCK.USERS]);
  const [saving, setSaving] = React.useState(false);
  const currentUserRole = (() => { try { return JSON.parse(localStorage.getItem('vencidos_user'))?.role || 'admin'; } catch { return 'admin'; } })();
  const isSupervisor = currentUserRole === 'supervisor';

  React.useEffect(() => {
    const handler = () => setUsers([...window.MOCK.USERS]);
    window.addEventListener('vencidos_data_changed', handler);
    return () => window.removeEventListener('vencidos_data_changed', handler);
  }, []);

  const [showModal, setShowModal] = React.useState(false);
  const [editUser, setEditUser] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterRole, setFilterRole] = React.useState('Todos');
  const [filterSala, setFilterSala] = React.useState('Todos');
  const [confirmDelete, setConfirmDelete] = React.useState(null);

  // Form state
  const [form, setForm] = React.useState({ name: '', username: '', role: 'sala', sucursal: '', active: true, password: '123456' });

  const resetForm = () => setForm({ name: '', username: '', role: 'sala', sucursal: '', active: true, password: '123456' });

  const openCreate = () => { resetForm(); setEditUser(null); setShowModal(true); };
  const openEdit = (u) => {
    setForm({ name: u.name, username: u.username || '', role: u.role, sucursal: u.sucursal || '', active: u.active, password: u.password || '123456' });
    setEditUser(u); setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.username.trim()) return;
    setSaving(true);
    const avatar = form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    try {
      let result;
      if (editUser) {
        result = await window.MOCK.updateUser(editUser.id, {
          ...form, avatar,
          sucursal: form.role === 'sala' ? form.sucursal : null,
        });
      } else {
        result = await window.MOCK.addUser({
          ...form, avatar,
          sucursal: form.role === 'sala' ? form.sucursal : null,
          password: form.password || '123456',
        });
      }
      const actionDesc = editUser ? 'Editó usuario' : 'Creó usuario';
      const detailDesc = editUser
        ? `Usuario ${form.name} modificado`
        : `Nuevo usuario: ${form.name} → ${form.role === 'sala' ? form.sucursal : form.role}`;
      try {
        const savedUser = localStorage.getItem('vencidos_user');
        const cu = savedUser ? JSON.parse(savedUser) : { name: 'Administrador', role: 'admin', avatar: 'AD' };
        window.MOCK.addAuditEntry(actionDesc, detailDesc, cu.name, cu.role, cu.avatar);
      } catch (e) {}
      setShowModal(false); resetForm(); setEditUser(null);
    } catch (e) {
      alert('Error al guardar usuario: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const target = users.find(u => u.id === id);
    try {
      await window.MOCK.deleteUser(id);
      if (target) {
        try {
          const savedUser = localStorage.getItem('vencidos_user');
          const cu = savedUser ? JSON.parse(savedUser) : { name: 'Administrador', role: 'admin', avatar: 'AD' };
          window.MOCK.addAuditEntry('Eliminó usuario', `Eliminó a ${target.name}`, cu.name, cu.role, cu.avatar);
        } catch (e) {}
      }
    } catch (e) { alert('Error: ' + e.message); }
    setConfirmDelete(null);
  };

  const handleToggleActive = async (id) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    try {
      await window.MOCK.updateUser(id, { active: !target.active });
      try {
        const savedUser = localStorage.getItem('vencidos_user');
        const cu = savedUser ? JSON.parse(savedUser) : { name: 'Administrador', role: 'admin', avatar: 'AD' };
        const actText = target.active ? 'Desactivó usuario' : 'Activó usuario';
        window.MOCK.addAuditEntry(actText, `${actText}: ${target.name}`, cu.name, cu.role, cu.avatar);
      } catch (e) {}
    } catch (e) { alert('Error: ' + e.message); }
  };

  const filtered = users.filter(u => {
    if (filterRole !== 'Todos' && u.role !== filterRole) return false;
    if (filterSala !== 'Todos' && (u.sucursal || '') !== filterSala) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return u.name.toLowerCase().includes(s) || (u.username || '').toLowerCase().includes(s);
    }
    return true;
  });

  const salaUsers = users.filter(u => u.role === 'sala');
  const sucursalesWithUsers = window.MOCK.SUCURSALES.map(s => ({
    ...s,
    users: salaUsers.filter(u => u.sucursal === s.id),
  }));

  const roleLabels = { admin: 'Administrador', supervisor: 'Supervisor', sala: 'Personal de sala' };
  const roleColors = {
    admin: { bg: 'var(--status-danger-bg)', color: 'var(--status-danger)' },
    supervisor: { bg: 'var(--status-info-bg)', color: 'var(--status-info)' },
    sala: { bg: 'var(--status-success-bg)', color: 'var(--status-success)' },
  };

  const us = {
    container: { padding: '24px', maxWidth: 1100, margin: '0 auto' },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 20, flexWrap: 'wrap', gap: 12,
    },
    stats: { display: 'flex', gap: 16 },
    stat: (color) => ({
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '8px 16px', borderRadius: 'var(--radius-md)',
      background: 'var(--bg-tertiary)',
    }),
    statNum: { fontSize: 22, fontWeight: 800, lineHeight: 1 },
    statLabel: { fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 },
    toolbar: {
      display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'flex-end',
    },
    searchWrap: { flex: '1 1 200px' },
    filterWrap: { flex: '0 0 160px' },
    filterLabel: {
      fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)',
      textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3, display: 'block',
    },
    table: {
      width: '100%', borderCollapse: 'collapse', fontSize: 13,
      background: 'var(--card-bg)', border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    },
    th: {
      textAlign: 'left', padding: '12px 16px', fontWeight: 600,
      color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-tertiary)', fontSize: 12, whiteSpace: 'nowrap',
    },
    td: {
      padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)',
      verticalAlign: 'middle',
    },
    row: { transition: 'background var(--transition-fast)' },
    avatar: (role) => ({
      width: 36, height: 36, borderRadius: 10, fontSize: 13, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: roleColors[role]?.bg || 'var(--bg-tertiary)',
      color: roleColors[role]?.color || 'var(--text-secondary)',
      flexShrink: 0,
    }),
    userCell: { display: 'flex', alignItems: 'center', gap: 10 },
    userName: { fontSize: 14, fontWeight: 600 },
    userEmail: { fontSize: 12, color: 'var(--text-tertiary)' },
    roleBadge: (role) => ({
      display: 'inline-flex', padding: '3px 10px', borderRadius: 'var(--radius-full)',
      fontSize: 11, fontWeight: 600,
      background: roleColors[role]?.bg, color: roleColors[role]?.color,
    }),
    statusBadge: (active) => ({
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 'var(--radius-full)',
      fontSize: 11, fontWeight: 600,
      background: active ? 'var(--status-success-bg)' : 'var(--bg-tertiary)',
      color: active ? 'var(--status-success)' : 'var(--text-tertiary)',
    }),
    statusDot: (active) => ({
      width: 6, height: 6, borderRadius: '50%',
      background: active ? 'var(--status-success)' : 'var(--text-tertiary)',
    }),
    actions: { display: 'flex', gap: 4 },
    // Modal
    overlay: {
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'fadeIn 0.2s ease both',
    },
    modal: {
      background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)',
      width: '100%', maxWidth: 480, maxHeight: '90vh', overflow: 'auto',
      animation: 'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) both',
    },
    modalHeader: {
      padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    modalTitle: { fontSize: 18, fontWeight: 700 },
    modalBody: { padding: '20px 24px' },
    modalField: { marginBottom: 16 },
    modalLabel: {
      display: 'block', fontSize: 13, fontWeight: 600,
      color: 'var(--text-secondary)', marginBottom: 6,
    },
    modalFooter: {
      padding: '16px 24px', borderTop: '1px solid var(--border-color)',
      display: 'flex', gap: 10, justifyContent: 'flex-end',
    },
    roleOption: (active) => ({
      flex: 1, padding: '12px', textAlign: 'center', borderRadius: 'var(--radius-md)',
      border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border-color)'}`,
      background: active ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
      cursor: 'pointer', transition: 'all var(--transition-fast)',
    }),
    roleOptionLabel: { fontSize: 13, fontWeight: 600, marginTop: 4 },
    roleOptionDesc: { fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 },
    // Sucursal map section
    mapSection: {
      marginTop: 24, padding: '20px',
      background: 'var(--card-bg)', border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
    },
    mapTitle: { fontSize: 15, fontWeight: 700, marginBottom: 16 },
    mapGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: 10,
    },
    mapCard: {
      padding: '12px 14px', borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
    },
    mapSucName: { fontSize: 13, fontWeight: 700, marginBottom: 6 },
    mapCity: { fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8 },
    mapUserChip: {
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 'var(--radius-full)',
      background: 'var(--status-success-bg)', color: 'var(--status-success)',
      fontSize: 11, fontWeight: 600, marginRight: 4, marginBottom: 4,
    },
    mapEmpty: { fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic' },
  };

  const RoleIcon = ({ role, size = 16 }) => {
    const paths = {
      admin: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      supervisor: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      sala: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    };
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[role] || paths.sala}/>
      </svg>
    );
  };

  return (
    <div style={us.container}>
      {/* Header */}
      <div style={us.header}>
        <div style={us.stats}>
          <div style={us.stat()}>
            <div style={us.statNum}>{users.length}</div>
            <div style={us.statLabel}>Total</div>
          </div>
          <div style={us.stat()}>
            <div style={{...us.statNum, color: 'var(--status-success)'}}>{users.filter(u => u.role === 'sala').length}</div>
            <div style={us.statLabel}>Sala</div>
          </div>
          <div style={us.stat()}>
            <div style={{...us.statNum, color: 'var(--status-info)'}}>{users.filter(u => u.role === 'supervisor').length}</div>
            <div style={us.statLabel}>Supervisores</div>
          </div>
          <div style={us.stat()}>
            <div style={{...us.statNum, color: 'var(--status-danger)'}}>{users.filter(u => u.role === 'admin').length}</div>
            <div style={us.statLabel}>Admin</div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 4v16m8-8H4"/>
          </svg>
          Crear usuario
        </button>
      </div>

      {/* Toolbar */}
      <div style={us.toolbar}>
        <div style={us.searchWrap}>
          <input placeholder="Buscar por nombre o email..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} style={{ fontSize: 13 }} />
        </div>
        <div style={us.filterWrap}>
          <div style={us.filterLabel}>Rol</div>
          <CustomSelect value={filterRole} onChange={setFilterRole} options={[
            { value: 'Todos', label: 'Todos' },
            { value: 'sala', label: 'Personal de sala' },
            { value: 'supervisor', label: 'Supervisor' },
            { value: 'admin', label: 'Administrador' },
          ]} />
        </div>
        <div style={us.filterWrap}>
          <div style={us.filterLabel}>Sala</div>
          <CustomSelect value={filterSala} onChange={setFilterSala} options={[
            { value: 'Todos', label: 'Todas' },
            ...window.MOCK.SUCURSALES.map(s => ({ value: s.id, label: s.name })),
          ]} />
        </div>
      </div>

      {/* Users table */}
      <div style={{ overflow: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <table style={us.table}>
          <thead>
            <tr>
              <th style={us.th}>Usuario</th>
              <th style={us.th}>Rol</th>
              <th style={us.th}>Sala asignada</th>
              <th style={us.th}>Estado</th>
              <th style={{...us.th, textAlign: 'right'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={us.row}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={us.td}>
                  <div style={us.userCell}>
                    <div style={us.avatar(u.role)}>{u.avatar}</div>
                    <div>
                      <div style={us.userName}>{u.name}</div>
                    </div>
                  </div>
                </td>
                <td style={us.td}>
                  <span style={us.roleBadge(u.role)}>{roleLabels[u.role]}</span>
                </td>
                <td style={us.td}>
                  {u.sucursal ? (
                    <span style={{ fontSize: 13, fontWeight: 500 }}>
                      {window.MOCK.SUCURSALES.find(s => s.id === u.sucursal)?.name || u.sucursal}
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>—</span>
                  )}
                </td>
                <td style={us.td}>
                  <span style={{...us.statusBadge(u.active), cursor: isSupervisor ? 'default' : 'pointer'}}
                    onClick={() => !isSupervisor && handleToggleActive(u.id)}
                    title={isSupervisor ? undefined : 'Clic para cambiar estado'}>
                    <span style={us.statusDot(u.active)}></span>
                    {u.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{...us.td, textAlign: 'right'}}>
                  <div style={{...us.actions, justifyContent: 'flex-end'}}>
                    {!isSupervisor && (
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}
                        onClick={() => openEdit(u)}>Editar</button>
                    )}
                    {!isSupervisor && (
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: 'var(--status-danger)' }}
                        onClick={() => setConfirmDelete(u.id)}>Eliminar</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sucursal assignment map */}
      <div style={us.mapSection}>
        <div style={us.mapTitle}>Asignación por sucursal</div>
        <div style={us.mapGrid}>
          {sucursalesWithUsers.map(suc => (
            <div key={suc.id} style={us.mapCard}>
              <div style={us.mapSucName}>{suc.name}</div>
              <div style={us.mapCity}>{suc.city}</div>
              {suc.users.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {suc.users.map(u => (
                    <span key={u.id} style={us.mapUserChip}>
                      <span style={us.statusDot(u.active)}></span>
                      {u.name.split(' ')[0]}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={us.mapEmpty}>Sin asignar</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={us.overlay} onClick={() => setShowModal(false)}>
          <div style={us.modal} onClick={e => e.stopPropagation()}>
            <div style={us.modalHeader}>
              <div style={us.modalTitle}>{editUser ? 'Editar usuario' : 'Crear nuevo usuario'}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div style={us.modalBody}>
              {/* Role selector */}
              <div style={us.modalField}>
                <div style={us.modalLabel}>Rol</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { value: 'sala', label: 'Sala', desc: 'Registra productos' },
                    { value: 'supervisor', label: 'Supervisor', desc: 'Dashboard y reportes' },
                    { value: 'admin', label: 'Admin', desc: 'Acceso total' },
                  ].filter(r => !isSupervisor || r.value !== 'admin').map(r => (
                    <div key={r.value} style={us.roleOption(form.role === r.value)}
                      onClick={() => setForm(f => ({...f, role: r.value}))}>
                      <RoleIcon role={r.value} />
                      <div style={us.roleOptionLabel}>{r.label}</div>
                      <div style={us.roleOptionDesc}>{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={us.modalField}>
                <label style={us.modalLabel}>Nombre completo</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  placeholder="Nombre Apellido" />
              </div>
              <div style={us.modalField}>
                <label style={us.modalLabel}>Nombre de usuario</label>
                <input type="text" value={form.username} onChange={e => setForm(f => ({...f, username: e.target.value.toLowerCase().replace(/\s/g,'')}))}
                  placeholder="ej: jorge.alvarez" />
              </div>

              {form.role === 'sala' && (
                <div style={us.modalField}>
                  <label style={us.modalLabel}>Sala asignada</label>
                  <CustomSelect
                    value={form.sucursal}
                    onChange={val => setForm(f => ({...f, sucursal: val === '' ? '' : val}))}
                    placeholder="Seleccionar sucursal..."
                    options={[
                      { value: '', label: 'Seleccionar sucursal...' },
                      ...window.MOCK.SUCURSALES.map(s => ({ value: s.id, label: `${s.name} — ${s.city}` })),
                    ]}
                  />
                  {form.sucursal && (
                    <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-tertiary)' }}>
                      {sucursalesWithUsers.find(s => s.id === form.sucursal)?.users.length || 0} usuario(s) ya asignados a esta sala
                    </div>
                  )}
                </div>
              )}

              <div style={us.modalField}>
                <label style={us.modalLabel}>Contraseña</label>
                <input type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
                  placeholder="Contraseña..." />
              </div>

              <div style={us.modalField}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{...us.modalLabel, marginBottom: 0}}>Usuario activo</label>
                  <button type="button" style={{
                    width: 40, height: 22, borderRadius: 11, border: 'none',
                    background: form.active ? 'var(--status-success)' : 'var(--bg-tertiary)',
                    cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                  }} onClick={() => setForm(f => ({...f, active: !f.active}))}>
                    <span style={{
                      position: 'absolute', top: 2, left: form.active ? 20 : 2,
                      width: 18, height: 18, borderRadius: '50%', background: 'white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s',
                    }}></span>
                  </button>
                </div>
              </div>
            </div>

            <div style={us.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}
                disabled={saving || !form.name.trim() || !form.username.trim()}>
                {saving ? 'Guardando...' : editUser ? 'Guardar cambios' : 'Crear usuario'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div style={us.overlay} onClick={() => setConfirmDelete(null)}>
          <div style={{...us.modal, maxWidth: 380, textAlign: 'center'}} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
                background: 'var(--status-danger-bg)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--status-danger)" strokeWidth="2">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>¿Eliminar usuario?</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
                {users.find(u => u.id === confirmDelete)?.name} será eliminado permanentemente del sistema.
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                <button className="btn" style={{ background: 'var(--status-danger)', color: 'white' }}
                  onClick={() => handleDelete(confirmDelete)}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   CONSOLIDATED VIEW
   ═══════════════════════════════════════════════ */

const escapeExcelXml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const EXCEL_TEXT_ENCODER = new TextEncoder();

const toExcelColumnName = (index) => {
  let value = '';
  let current = index + 1;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    value = String.fromCharCode(65 + remainder) + value;
    current = Math.floor((current - 1) / 26);
  }
  return value;
};

const normalizeWorksheetRows = (rows = [], header = []) => {
  const normalizedRows = [];
  if (header.length) normalizedRows.push({ values: header, styleId: 1 });
  rows.forEach((row) => {
    if (Array.isArray(row)) {
      normalizedRows.push({ values: row, styleId: 0 });
      return;
    }
    normalizedRows.push({
      values: row.values || [],
      styleId: row.styleId ?? 0,
    });
  });
  return normalizedRows;
};

const buildXlsxCell = (rowIndex, colIndex, value, styleId = 0) => {
  if (value === undefined || value === null || value === '') return '';
  const ref = `${toExcelColumnName(colIndex)}${rowIndex}`;
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `<c r="${ref}" s="${styleId}"><v>${value}</v></c>`;
  }
  return `<c r="${ref}" s="${styleId}" t="inlineStr"><is><t xml:space="preserve">${escapeExcelXml(value)}</t></is></c>`;
};

const buildWorksheetXml = ({ header = [], rows = [], autoFilterRef = '', columnWidths = [] }) => {
  const normalizedRows = normalizeWorksheetRows(rows, header);
  const maxColumns = normalizedRows.reduce((max, row) => Math.max(max, row.values.length), 0);
  const dimension = normalizedRows.length && maxColumns
    ? `A1:${toExcelColumnName(maxColumns - 1)}${normalizedRows.length}`
    : 'A1';
  const colsXml = columnWidths.length
    ? `<cols>${columnWidths.map((width, index) =>
      `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`
    ).join('')}</cols>`
    : '';
  const rowXml = normalizedRows.map((row, rowIndex) => {
    const cells = row.values.map((value, colIndex) =>
      buildXlsxCell(rowIndex + 1, colIndex, value, row.styleId)
    ).filter(Boolean).join('');
    return `<row r="${rowIndex + 1}">${cells}</row>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="${dimension}"/>
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  ${colsXml}
  <sheetData>${rowXml}</sheetData>
  ${autoFilterRef ? `<autoFilter ref="${autoFilterRef}"/>` : ''}
</worksheet>`;
};

const buildWorkbookXml = (sheetNames) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    ${sheetNames.map((name, index) =>
      `<sheet name="${escapeExcelXml(name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`
    ).join('')}
  </sheets>
</workbook>`;

const buildWorkbookRelsXml = (sheetCount) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${Array.from({ length: sheetCount }, (_, index) =>
    `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`
  ).join('')}
  <Relationship Id="rId${sheetCount + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

const buildStylesXml = () => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="3">
    <font><sz val="11"/><name val="Calibri"/><family val="2"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
    <font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF4F46E5"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="1">
    <border><left/><right/><top/><bottom/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="3">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>`;

const buildContentTypesXml = (sheetCount) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  ${Array.from({ length: sheetCount }, (_, index) =>
    `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
  ).join('')}
</Types>`;

const buildRootRelsXml = () => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

const buildAppPropsXml = (sheetNames) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
 xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Codex</Application>
  <HeadingPairs>
    <vt:vector size="2" baseType="variant">
      <vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant>
      <vt:variant><vt:i4>${sheetNames.length}</vt:i4></vt:variant>
    </vt:vector>
  </HeadingPairs>
  <TitlesOfParts>
    <vt:vector size="${sheetNames.length}" baseType="lpstr">
      ${sheetNames.map((name) => `<vt:lpstr>${escapeExcelXml(name)}</vt:lpstr>`).join('')}
    </vt:vector>
  </TitlesOfParts>
  <Company></Company>
  <AppVersion>16.0300</AppVersion>
</Properties>`;

const buildCorePropsXml = (generatedAt) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
 xmlns:dc="http://purl.org/dc/elements/1.1/"
 xmlns:dcterms="http://purl.org/dc/terms/"
 xmlns:dcmitype="http://purl.org/dc/dcmitype/"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${generatedAt.toISOString()}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${generatedAt.toISOString()}</dcterms:modified>
</cp:coreProperties>`;

const buildCrc32Table = () => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let crc = index;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    table[index] = crc >>> 0;
  }
  return table;
};

const EXCEL_CRC32_TABLE = buildCrc32Table();

const calculateCrc32 = (bytes) => {
  let crc = 0xFFFFFFFF;
  for (let index = 0; index < bytes.length; index += 1) {
    crc = EXCEL_CRC32_TABLE[(crc ^ bytes[index]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
};

const getDosDateTime = (date) => {
  const safeYear = Math.max(date.getFullYear(), 1980);
  return {
    date: ((safeYear - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
  };
};

const concatBytes = (chunks) => {
  const totalLength = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  chunks.forEach((chunk) => {
    result.set(chunk, offset);
    offset += chunk.length;
  });
  return result;
};

const createStoredZipBlob = (files) => {
  const timestamp = getDosDateTime(new Date());
  const localFiles = [];
  const centralFiles = [];
  let offset = 0;

  files.forEach((file) => {
    const nameBytes = EXCEL_TEXT_ENCODER.encode(file.name);
    const dataBytes = file.data instanceof Uint8Array ? file.data : EXCEL_TEXT_ENCODER.encode(file.data);
    const crc32 = calculateCrc32(dataBytes);

    const localFile = new Uint8Array(30 + nameBytes.length + dataBytes.length);
    const localView = new DataView(localFile.buffer);
    localView.setUint32(0, 0x04034B50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, timestamp.time, true);
    localView.setUint16(12, timestamp.date, true);
    localView.setUint32(14, crc32, true);
    localView.setUint32(18, dataBytes.length, true);
    localView.setUint32(22, dataBytes.length, true);
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true);
    localFile.set(nameBytes, 30);
    localFile.set(dataBytes, 30 + nameBytes.length);
    localFiles.push(localFile);

    const centralFile = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralFile.buffer);
    centralView.setUint32(0, 0x02014B50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, timestamp.time, true);
    centralView.setUint16(14, timestamp.date, true);
    centralView.setUint32(16, crc32, true);
    centralView.setUint32(20, dataBytes.length, true);
    centralView.setUint32(24, dataBytes.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, offset, true);
    centralFile.set(nameBytes, 46);
    centralFiles.push(centralFile);

    offset += localFile.length;
  });

  const localBytes = concatBytes(localFiles);
  const centralBytes = concatBytes(centralFiles);
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  endView.setUint32(0, 0x06054B50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralBytes.length, true);
  endView.setUint32(16, localBytes.length, true);
  endView.setUint16(20, 0, true);

  return new Blob([localBytes, centralBytes, endRecord], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
};

const downloadExcelWorkbook = (sheets, fileName, generatedAt = new Date()) => {
  const sheetNames = sheets.map((sheet) => sheet.name);
  const files = [
    { name: '[Content_Types].xml', data: buildContentTypesXml(sheets.length) },
    { name: '_rels/.rels', data: buildRootRelsXml() },
    { name: 'docProps/app.xml', data: buildAppPropsXml(sheetNames) },
    { name: 'docProps/core.xml', data: buildCorePropsXml(generatedAt) },
    { name: 'xl/workbook.xml', data: buildWorkbookXml(sheetNames) },
    { name: 'xl/_rels/workbook.xml.rels', data: buildWorkbookRelsXml(sheets.length) },
    { name: 'xl/styles.xml', data: buildStylesXml() },
    ...sheets.map((sheet, index) => ({
      name: `xl/worksheets/sheet${index + 1}.xml`,
      data: buildWorksheetXml(sheet),
    })),
  ];

  const blob = createStoredZipBlob(files);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const ConsolidadoView = () => {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const handler = () => setTick(t => t + 1);
    window.addEventListener('vencidos_data_changed', handler);
    return () => window.removeEventListener('vencidos_data_changed', handler);
  }, []);

  const products = window.MOCK.MOCK_PRODUCTS;
  const [selectedSucursales, setSelectedSucursales] = React.useState(
    window.MOCK.SUCURSALES.map(s => s.id)
  );
  const [lastExport, setLastExport] = React.useState(null);
  const [exportError, setExportError] = React.useState('');

  const toggleSuc = (id) => {
    setSelectedSucursales(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const filteredProducts = products.filter(p => selectedSucursales.includes(p.sucursal));
  const estadoLabels = Object.fromEntries(window.MOCK.ESTADOS.map((estado) => [estado.id, estado.label]));

  React.useEffect(() => {
    setLastExport(null);
    setExportError('');
  }, [selectedSucursales]);
  
  const sucStats = window.MOCK.SUCURSALES.map(suc => {
    const prods = products.filter(p => p.sucursal === suc.id);
    const urgentes = prods.filter(p => p.estado === 'vence_menos_3m' || p.estado === 'devoluciones' || p.estado === 'ya_vencido').length;
    return {
      ...suc,
      total: prods.length,
      pendientes: urgentes,
      completado: urgentes === 0 && prods.length > 0,
    };
  });

  const cs = {
    container: { padding: '24px', maxWidth: 1200, margin: '0 auto' },
    intro: {
      marginBottom: 24, padding: '24px',
      background: 'var(--card-bg)', border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
    },
    introTitle: { fontSize: 18, fontWeight: 700, marginBottom: 8 },
    introText: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 },
    sucGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: 8, marginBottom: 16,
    },
    sucCard: (selected) => ({
      padding: '12px', borderRadius: 'var(--radius-md)',
      border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--border-color)'}`,
      background: selected ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
      cursor: 'pointer', transition: 'all var(--transition-fast)',
      textAlign: 'center',
    }),
    sucName: { fontSize: 13, fontWeight: 600, marginBottom: 2 },
    sucCount: { fontSize: 20, fontWeight: 800, color: 'var(--accent)' },
    sucStatus: (done) => ({
      fontSize: 10, fontWeight: 600, marginTop: 4,
      color: done ? 'var(--status-success)' : 'var(--status-warning)',
    }),
    summary: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 12, marginTop: 20,
    },
    summaryCard: {
      padding: '16px', borderRadius: 'var(--radius-md)',
      background: 'var(--bg-tertiary)', textAlign: 'center',
    },
    summaryNum: { fontSize: 28, fontWeight: 800, color: 'var(--accent)' },
    summaryLabel: { fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 },
    consolidateBtn: {
      width: '100%', padding: '14px', fontSize: 15, fontWeight: 700, marginTop: 20,
    },
    successBanner: {
      padding: '16px 20px', borderRadius: 'var(--radius-md)',
      background: 'var(--status-success-bg)', border: '1px solid var(--status-success)',
      color: 'var(--status-success)', fontWeight: 600, fontSize: 14,
      display: 'flex', alignItems: 'center', gap: 10, marginTop: 16,
    },
    errorBanner: {
      padding: '16px 20px', borderRadius: 'var(--radius-md)',
      background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning)',
      color: 'var(--status-warning)', fontWeight: 600, fontSize: 14,
      display: 'flex', alignItems: 'center', gap: 10, marginTop: 16,
    },
  };

  const handleExport = () => {
    if (!selectedSucursales.length) {
      setExportError('Selecciona al menos una sucursal para generar el consolidado.');
      setLastExport(null);
      return;
    }

    if (!filteredProducts.length) {
      setExportError('No hay productos en las sucursales seleccionadas para exportar.');
      setLastExport(null);
      return;
    }

    const generatedAt = new Date();
    const fileStamp = generatedAt.toISOString().replace(/[:]/g, '-').split('.')[0];
    const fileName = `consolidado_vencidos_${fileStamp}.xlsx`;
    const sucursalNames = window.MOCK.SUCURSALES
      .filter((sucursal) => selectedSucursales.includes(sucursal.id))
      .map((sucursal) => sucursal.name);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      const bySucursal = (a.sucursalName || '').localeCompare(b.sucursalName || '');
      if (bySucursal !== 0) return bySucursal;
      return (a.nombre || '').localeCompare(b.nombre || '');
    });

    const dataReportHeader = [
      'UBICACION', 'Asesora', 'CODIGO DE BARRA', 'DESCRIPCION', 'PROVEEDOR',
      'CAT1', 'CAT2', 'CAT3', 'CAT4', 'cambio', 'cantidad', 'coste',
      'subtotal', 'FECHA VENCIMIENTO', 'Estado', 'DIAS PARA VENCER A FECHA ACTUAL',
      'Fecha de reporte', 'UNIDAD DE NEGOCIO',
    ];

    const dataReportRows = sortedProducts.map((product) => [
      product.sucursalName || product.sucursal,
      product.reportadoPor,
      product.codigo,
      product.nombre,
      product.proveedor,
      product.cat1,
      product.cat2,
      product.cat3,
      '',
      product.proveedorCambio ? 'SI' : 'NO',
      product.cantidad,
      '',
      '',
      product.tipo === 'dañado' ? 'Dañados' : product.fechaVencimiento,
      product.tipo === 'dañado' ? (product.accion || 'Tratamiento dañados') : product.estadoVencimiento,
      product.tipo === 'dañado' ? '' : product.diasRestantes,
      product.fechaRegistro,
      'VENCIDOS',
    ]);

    const reportStates = [
      'Dañados',
      'Próximo a vencer',
      'Vence en más de 3 meses',
      'Vence en menos de 3 meses',
      'Vencido',
      'Ya vencido',
    ];

    const providerSummary = {};
    sortedProducts.forEach((product) => {
      const provider = product.proveedor || 'Sin proveedor';
      const state = product.tipo === 'dañado' ? 'Dañados' : (product.estadoVencimiento || 'Sin estado');
      if (!providerSummary[provider]) {
        providerSummary[provider] = Object.fromEntries(reportStates.map((label) => [label, 0]));
        providerSummary[provider].total = 0;
      }
      if (providerSummary[provider][state] !== undefined) {
        providerSummary[provider][state] += product.cantidad;
      }
      providerSummary[provider].total += product.cantidad;
    });

    const providerRows = Object.entries(providerSummary)
      .sort(([, left], [, right]) => right.total - left.total)
      .map(([provider, counters]) => [
        provider,
        ...reportStates.map((label) => counters[label]),
        counters.total,
      ]);

    const sucursalRows = sucursalNames.map((sucursalName) => {
      const sucursalProducts = sortedProducts.filter((product) => (product.sucursalName || product.sucursal) === sucursalName);
      return [
        sucursalName,
        sucursalProducts.length,
        sucursalProducts.filter((product) => product.estado === 'proximo_vencer').length,
        sucursalProducts.filter((product) => product.estado === 'vence_mas_3m').length,
        sucursalProducts.filter((product) => product.estado === 'venta_impulso').length,
        sucursalProducts.filter((product) => product.estado === 'vence_menos_3m').length,
        sucursalProducts.filter((product) => product.estado === 'devoluciones').length,
        sucursalProducts.filter((product) => product.estado === 'ya_vencido').length,
      ];
    });

    downloadExcelWorkbook([
      {
        name: 'data reportes',
        header: dataReportHeader,
        autoFilterRef: `A1:${toExcelColumnName(dataReportHeader.length - 1)}${dataReportRows.length + 1}`,
        columnWidths: [18, 18, 18, 42, 28, 16, 16, 18, 16, 10, 12, 12, 12, 18, 24, 18, 18, 18],
        rows: dataReportRows,
      },
      {
        name: 'reporte general',
        columnWidths: [34, 18, 18, 18, 22, 18, 18, 18],
        rows: [
          { values: ['Fecha de reporte', generatedAt.toLocaleString('es-BO')], styleId: 2 },
          { values: ['Sucursales incluidas', sucursalNames.join(', ')], styleId: 2 },
          { values: ['Cantidad de sucursales', selectedSucursales.length], styleId: 2 },
          { values: ['Productos exportados', sortedProducts.length], styleId: 2 },
          { values: ['Próximo a vencer', sortedProducts.filter((product) => product.estado === 'proximo_vencer').length], styleId: 2 },
          { values: ['Vence en más de 3 meses', sortedProducts.filter((product) => product.estado === 'vence_mas_3m').length], styleId: 2 },
          { values: ['Venta Impulso', sortedProducts.filter((product) => product.estado === 'venta_impulso').length], styleId: 2 },
          { values: ['Vence en menos de 3 meses', sortedProducts.filter((product) => product.estado === 'vence_menos_3m').length], styleId: 2 },
          { values: ['Devoluciones', sortedProducts.filter((product) => product.estado === 'devoluciones').length], styleId: 2 },
          { values: ['Ya vencido', sortedProducts.filter((product) => product.estado === 'ya_vencido').length], styleId: 2 },
          [''],
          { values: ['Proveedor', ...reportStates, 'Total general'], styleId: 1 },
          ...providerRows,
          [''],
          { values: ['Sucursal', 'Productos', 'Próximo a vencer', 'Vence >3m', 'Venta Impulso', 'Vence <3m', 'Devoluciones', 'Ya vencido'], styleId: 1 },
          ...sucursalRows,
        ],
      },
    ], fileName, generatedAt);

    setExportError('');
    setLastExport({
      count: sortedProducts.length,
      fileName,
      generatedAt: generatedAt.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div style={cs.container}>
      <div style={cs.intro} className="animate-in">
        <div style={cs.introTitle}>Consolidar sucursales</div>
        <div style={cs.introText}>
          Selecciona las sucursales que deseas incluir en el consolidado. La exportacion genera un archivo XLSX con dos hojas: data reportes y reporte general.
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12, marginBottom: 16 }}>
          <button
            onClick={() => {
              if (selectedSucursales.length === window.MOCK.SUCURSALES.length) {
                setSelectedSucursales([]);
              } else {
                setSelectedSucursales(window.MOCK.SUCURSALES.map(s => s.id));
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: selectedSucursales.length === window.MOCK.SUCURSALES.length 
                ? 'oklch(0.62 0.17 29 / 0.1)' 
                : 'var(--bg-tertiary)',
              color: selectedSucursales.length === window.MOCK.SUCURSALES.length 
                ? 'var(--status-danger)' 
                : 'var(--text-primary)',
              border: selectedSucursales.length === window.MOCK.SUCURSALES.length 
                ? '1px solid oklch(0.62 0.17 29 / 0.2)' 
                : '1px solid var(--border-color)',
            }}
            onMouseEnter={e => {
              if (selectedSucursales.length === window.MOCK.SUCURSALES.length) {
                e.currentTarget.style.background = 'oklch(0.62 0.17 29 / 0.15)';
                e.currentTarget.style.borderColor = 'var(--status-danger)';
              } else {
                e.currentTarget.style.background = 'var(--accent-subtle)';
                e.currentTarget.style.borderColor = 'var(--accent)';
              }
            }}
            onMouseLeave={e => {
              if (selectedSucursales.length === window.MOCK.SUCURSALES.length) {
                e.currentTarget.style.background = 'oklch(0.62 0.17 29 / 0.1)';
                e.currentTarget.style.borderColor = 'oklch(0.62 0.17 29 / 0.2)';
              } else {
                e.currentTarget.style.background = 'var(--bg-tertiary)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }
            }}
          >
            {selectedSucursales.length === window.MOCK.SUCURSALES.length ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
                Deseleccionar todas
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Seleccionar todas
              </>
            )}
          </button>
        </div>

        <div style={cs.sucGrid}>
          {sucStats.map(suc => (
            <div key={suc.id} style={cs.sucCard(selectedSucursales.includes(suc.id))}
              onClick={() => toggleSuc(suc.id)}>
              <div style={cs.sucName}>{suc.name}</div>
              <div style={cs.sucCount}>{suc.total}</div>
              <div style={cs.sucStatus(suc.completado)}>
                {suc.completado ? '✓ Completo' : '● Pendiente'}
              </div>
            </div>
          ))}
        </div>

        <div style={cs.summary}>
          <div style={cs.summaryCard}>
            <div style={cs.summaryNum}>{selectedSucursales.length}</div>
            <div style={cs.summaryLabel}>Sucursales seleccionadas</div>
          </div>
          <div style={cs.summaryCard}>
            <div style={cs.summaryNum}>{filteredProducts.length}</div>
            <div style={cs.summaryLabel}>Productos totales</div>
          </div>
          <div style={cs.summaryCard}>
            <div style={cs.summaryNum}>
              {filteredProducts.filter(p => p.estado === 'vence_menos_3m').length}
            </div>
            <div style={cs.summaryLabel}>Vence &lt;3 meses</div>
          </div>
          <div style={cs.summaryCard}>
            <div style={cs.summaryNum}>
              {filteredProducts.filter(p => p.diasRestantes < 0).length}
            </div>
            <div style={cs.summaryLabel}>Ya vencidos</div>
          </div>
        </div>

        <button className="btn btn-primary" style={{
          ...cs.consolidateBtn,
          opacity: !selectedSucursales.length || !filteredProducts.length ? 0.6 : 1,
          cursor: !selectedSucursales.length || !filteredProducts.length ? 'not-allowed' : 'pointer',
        }}
          disabled={!selectedSucursales.length || !filteredProducts.length}
          onClick={handleExport}>
          {lastExport ? 'Exportar nuevamente' : 'Generar y exportar Excel'}
        </button>

        {lastExport && (
          <div style={cs.successBanner} className="animate-scale">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Excel exportado — {lastExport.count} productos en {lastExport.fileName} a las {lastExport.generatedAt}
          </div>
        )}

        {exportError && (
          <div style={cs.errorBanner}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.66 18h16.68a1 1 0 00.87-1.5l-7.5-13a1 1 0 00-1.74 0z"/>
            </svg>
            {exportError}
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SYNC STATUS VIEW — Odoo catalog sync info
   ═══════════════════════════════════════════════ */
const SyncStatusView = () => {
  const [status, setStatus] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/vencidos/api/sync/status');
      setStatus(await r.json());
    } catch { setStatus({ ok: false, error: 'Sin conexión' }); }
    setLoading(false);
  };

  React.useEffect(() => { load(); }, []);

  const fmt = (iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return iso; }
  };

  const ss = {
    wrap: { padding: 24, maxWidth: 700, margin: '0 auto' },
    title: { fontSize: 20, fontWeight: 800, marginBottom: 4, color: 'var(--text-primary)' },
    sub: { fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 24 },
    card: {
      background: 'var(--card-bg)', border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 16,
    },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' },
    label: { fontSize: 13, color: 'var(--text-secondary)' },
    value: { fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' },
    badge: (ok) => ({
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
      borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 700,
      background: ok ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
      color: ok ? 'var(--status-success)' : 'var(--status-danger)',
    }),
    dot: (ok) => ({
      width: 7, height: 7, borderRadius: '50%',
      background: ok ? 'var(--status-success)' : 'var(--status-danger)',
    }),
    infoBox: {
      background: 'var(--accent-subtle)', border: '1px solid var(--accent)',
      borderRadius: 'var(--radius-md)', padding: '12px 16px',
      fontSize: 13, color: 'var(--text-secondary)', marginTop: 16, lineHeight: 1.6,
    },
  };

  return (
    <div style={ss.wrap}>
      <div style={ss.title}>Sincronización de catálogo</div>
      <div style={ss.sub}>Estado de la sincronización automática con Odoo (cada 30 minutos)</div>

      {loading ? (
        <div style={{padding: 40, textAlign: 'center', color: 'var(--text-tertiary)'}}>Cargando...</div>
      ) : !status?.ok ? (
        <div style={{...ss.card, borderColor: 'var(--status-danger)'}}>
          <div style={{color: 'var(--status-danger)', fontWeight: 700}}>⚠ Error al leer el estado</div>
          <div style={{fontSize: 13, marginTop: 8, color: 'var(--text-tertiary)'}}>{status?.error}</div>
        </div>
      ) : (
        <React.Fragment>
          <div style={ss.card}>
            <div style={{...ss.row, borderBottom: 'none', paddingTop: 0}}>
              <span style={{fontSize: 15, fontWeight: 700}}>Estado del sistema</span>
              <span style={ss.badge(true)}><span style={ss.dot(true)}></span> Activo</span>
            </div>
            {[
              ['Última sincronización', fmt(status.lastSync)],
              ['Próxima sincronización', fmt(status.nextSync)],
              ['Productos en catálogo', status.productCount?.toLocaleString('es-BO') + ' productos'],
              ['Tamaño del cache', status.cacheSize + ' MB'],
              ['Fuente', 'Odoo (Sistema NUBA / Andy\'s)'],
            ].map(([label, value]) => (
              <div key={label} style={ss.row}>
                <span style={ss.label}>{label}</span>
                <span style={ss.value}>{value}</span>
              </div>
            ))}
          </div>
          <div style={ss.infoBox}>
            La sincronización es automática — el sistema Quiebra actualiza el catálogo de Odoo cada 30 minutos.
            Stock y cobertura se calculan por sucursal al momento del registro.
            No se requiere intervención manual.
          </div>
          <button className="btn btn-secondary" style={{marginTop: 16}} onClick={load}>
            Actualizar estado
          </button>
        </React.Fragment>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   CATALOGO VIEW — Admin: explora catálogo por sala
   ═══════════════════════════════════════════════ */
const CatalogoView = (props) => {
  const isSala = props.user?.role === 'sala';
  const [sucursal, setSucursal] = React.useState(isSala ? (props.user?.sucursal || 'SG') : 'SG');
  const [term, setTerm] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [showAll, setShowAll] = React.useState(false);
  const [fStock, setFStock] = React.useState('all');
  const [fVtas, setFVtas] = React.useState('all');
  const [fCob, setFCob] = React.useState('all');
  const [fAbc, setFAbc] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [sortCol, setSortCol] = React.useState(null);   // 'nombre'|'stock'|'sales30d'|'coverageDays'|'abc'
  const [sortDir, setSortDir] = React.useState(1);       // 1=asc -1=desc
  const PAGE_SIZE = 100;
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const url = `/vencidos/api/catalog/search?q=${encodeURIComponent(term)}&sucursal=${sucursal}&limit=0&show_all=${showAll}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        setResults(await res.json());
        setError('');
      } catch (e) {
        setError('Error: ' + e.message);
        setResults([]);
      }
      setLoading(false);
    }, term ? 250 : 0);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [term, sucursal, showAll]);

  const sucName = window.MOCK.SUCURSALES.find(s => s.id === sucursal)?.name || sucursal;
  const fallbackCount = results.filter(r => r.fallback).length;

  const filtered = results.filter(r => {
    if (fStock === 'con' && r.stock <= 0) return false;
    if (fStock === 'sin' && r.stock > 0) return false;
    if (fVtas === 'con' && r.sales30d <= 0) return false;
    if (fVtas === 'sin' && r.sales30d > 0) return false;
    if (fCob !== 'all') {
      if (fCob === 'sd' && (r.coverageDays > 0 || r.sales30d > 0)) return false;
      if (fCob === 'sin-ventas' && r.sales30d !== 0) return false;
      if (fCob === '>60' && r.cobertura !== '>60' && r.cobertura !== '>180') return false;
      if (fCob !== 'sd' && fCob !== 'sin-ventas' && fCob !== '>60' && r.cobertura !== fCob) return false;
    }
    if (fAbc.length > 0) {
      const abc = r.abcSucursal || r.abc || '';
      if (!fAbc.includes(abc)) return false;
    }
    return true;
  });

  const hasFilters = fStock !== 'all' || fVtas !== 'all' || fCob !== 'all' || fAbc.length > 0;

  React.useEffect(() => { setPage(0); }, [fStock, fVtas, fCob, fAbc, term, sucursal, showAll, sortCol, sortDir]);

  const ABC_ORDER = {'A':0,'B':1,'C':2,'D':3,'E':4,'':5};
  const sorted = React.useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (sortCol === 'abc') { va = ABC_ORDER[a.abcSucursal || a.abc || '']; vb = ABC_ORDER[b.abcSucursal || b.abc || '']; }
      if (typeof va === 'string') return sortDir * va.localeCompare(vb);
      return sortDir * ((va ?? -1) - (vb ?? -1));
    });
  }, [filtered, sortCol, sortDir]);

  const toggleSort = (col) => {
    if (sortCol === col && sortDir === -1) { setSortCol(null); setSortDir(1); }
    else if (sortCol === col) setSortDir(-1);
    else { setSortCol(col); setSortDir(1); }
  };

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const cv = {
    wrap: { padding: 24, maxWidth: 1200, margin: '0 auto' },
    head: {
      display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      marginBottom: 8,
    },
    title: { fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginRight: 'auto' },
    select: {
      background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: 13, fontWeight: 600,
      color: 'var(--text-primary)', minWidth: 180, height: 38,
    },
    inputWrap: { position: 'relative', flex: '1 1 280px', minWidth: 240 },
    input: {
      width: '100%', boxSizing: 'border-box', height: 38,
      background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)', padding: '0 12px 0 34px', fontSize: 13,
      color: 'var(--text-primary)',
    },
    inputIcon: {
      position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
      color: 'var(--text-tertiary)', pointerEvents: 'none',
    },
    sub: {
      fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 14,
      display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
    },
    warnPill: {
      padding: '2px 8px', borderRadius: 'var(--radius-full)',
      background: 'var(--status-warning-bg)', color: 'var(--status-warning)',
      fontSize: 11, fontWeight: 700,
    },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
    th: (col) => ({
      textAlign: 'left', padding: '10px 12px', fontSize: 11, fontWeight: 700,
      color: sortCol === col ? '#60a5fa' : 'var(--text-tertiary)',
      textTransform: 'uppercase', letterSpacing: '0.04em',
      borderBottom: `2px solid ${sortCol === col ? '#3b82f6' : 'var(--border-color)'}`,
      background: sortCol === col ? '#1e3a5f33' : 'var(--bg-secondary)',
      position: 'sticky', top: 0, cursor: col ? 'pointer' : 'default',
      userSelect: 'none', whiteSpace: 'nowrap',
    }),
    td: { padding: '9px 12px', borderBottom: '1px solid var(--border-subtle)' },
    rowEven: { background: 'transparent' },
    rowOdd: { background: '#ffffff08' },
    rowFallback: { background: '#f59e0b11' },
    empty: { padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' },
    fallbackTag: {
      display: 'inline-block', padding: '1px 6px', borderRadius: 'var(--radius-full)',
      background: 'var(--status-warning)', color: '#000', fontSize: 9, fontWeight: 800,
      marginLeft: 6, letterSpacing: '0.04em', verticalAlign: 'middle',
    },
    sortIcon: (col, dir) => ({
      marginLeft: 4, opacity: sortCol === col ? 1 : 0.3, fontSize: 10,
    }),
    stockHigh: { color: '#4ade80', fontWeight: 700 },
    stockLow:  { color: '#fb923c', fontWeight: 700 },
    stockZero: { color: '#f87171', fontWeight: 700 },
    cobBadge: (rng) => ({
      display: 'inline-block', padding: '2px 7px', borderRadius: 'var(--radius-full)',
      fontSize: 10, fontWeight: 700,
      background: rng === '0-7' ? '#fee2e2' : rng === '7-14' ? '#fef3c7' : rng === '14-30' ? '#dbeafe' : rng === '30-60' ? '#dcfce7' : rng === '>60' ? '#f0fdf4' : '#1f2937',
      color:      rng === '0-7' ? '#991b1b' : rng === '7-14' ? '#92400e' : rng === '14-30' ? '#1e40af' : rng === '30-60' ? '#166534' : rng === '>60' ? '#15803d' : '#6b7280',
    }),
    abcBadge: (abc) => ({
      display: 'inline-block', padding: '2px 8px', borderRadius: 'var(--radius-full)',
      fontSize: 11, fontWeight: 800,
      background: abc==='A'?'#dcfce7':abc==='B'?'#dbeafe':abc==='C'?'#fef9c3':abc==='D'?'#f3e8ff':abc==='E'?'#ffe4e6':'#f3f4f6',
      color:      abc==='A'?'#166534':abc==='B'?'#1d4ed8':abc==='C'?'#854d0e':abc==='D'?'#7e22ce':abc==='E'?'#9f1239':'#6b7280',
    }),
    toggleBtn: {
      height: 38, padding: '0 16px', borderRadius: 'var(--radius-md)', fontSize: 12,
      fontWeight: 800, cursor: 'pointer',
      border: !showAll ? '1.5px solid #f59e0b' : '1.5px solid #3b82f6',
      background: !showAll ? '#f59e0b22' : '#3b82f622',
      color: !showAll ? '#f59e0b' : '#60a5fa',
      whiteSpace: 'nowrap', letterSpacing: '0.02em',
    },
    filterBar: {
      display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center',
      marginBottom: 10, padding: '8px 0',
      borderBottom: '1px solid var(--border-subtle)',
    },
    filterGroup: { display: 'flex', gap: 4, alignItems: 'center' },
    filterLabel: { fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 2 },
    pill: (active) => ({
      padding: '4px 11px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700,
      cursor: 'pointer',
      border: `1.5px solid ${active ? '#3b82f6' : 'var(--border-color)'}`,
      background: active ? '#3b82f6' : 'var(--bg-tertiary)',
      color: active ? '#fff' : 'var(--text-secondary)',
      userSelect: 'none', transition: 'all 0.12s',
    }),
    pillAbc: (active) => ({
      padding: '4px 9px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 800,
      cursor: 'pointer',
      border: `1.5px solid ${active ? '#8b5cf6' : 'var(--border-color)'}`,
      background: active ? '#8b5cf6' : 'var(--bg-tertiary)',
      color: active ? '#fff' : 'var(--text-secondary)',
      userSelect: 'none', transition: 'all 0.12s',
    }),
    clearBtn: {
      padding: '4px 11px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700,
      cursor: 'pointer', border: '1.5px solid #ef4444',
      background: '#ef444422', color: '#ef4444', userSelect: 'none',
    },
    pagBar: {
      display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px',
      borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)',
    },
    pagBtn: (active, disabled) => ({
      padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 700,
      cursor: disabled ? 'default' : 'pointer',
      border: `1px solid ${active ? '#3b82f6' : 'var(--border-color)'}`,
      background: active ? '#3b82f6' : 'var(--bg-tertiary)',
      color: active ? '#fff' : disabled ? 'var(--text-tertiary)' : 'var(--text-secondary)',
      opacity: disabled ? 0.4 : 1,
    }),
    pagInfo: { fontSize: 12, color: 'var(--text-tertiary)', margin: '0 4px' },
  };

  const toggleAbc = (cat) => setFAbc(prev =>
    prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
  );

  return (
    <div style={cv.wrap}>
      <div style={cv.head}>
        <div style={cv.title}>Catálogo</div>
        {isSala ? (
          <div style={{...cv.select, display: 'flex', alignItems: 'center', opacity: 0.8, cursor: 'default'}}>
            {sucursal} — {sucName}
          </div>
        ) : (
          <CustomSelect value={sucursal} onChange={setSucursal}
            style={cv.select}
            options={window.MOCK.SUCURSALES.map(s => ({ value: s.id, label: `${s.id} — ${s.name}` }))} />
        )}
        {!isSala && (
          <button style={cv.toggleBtn} onClick={() => setShowAll(v => !v)}>
            {showAll ? 'Solo esta sala' : '⚠ Solo con datos'}
          </button>
        )}
        <button style={{...cv.toggleBtn, borderColor: '#10b981', color: '#10b981', background: '#10b98122'}}
          onClick={() => {
            const abcParam = fAbc.join(',');
            const url = `/vencidos/api/catalog/export?sucursal=${sucursal}&show_all=${showAll}&f_stock=${fStock}&f_vtas=${fVtas}&f_cob=${fCob}&f_abc=${abcParam}&q=${encodeURIComponent(term)}`;
            window.open(url, '_blank');
          }}>
          ↓ Exportar Excel
        </button>
        <div style={cv.inputWrap}>
          <svg style={cv.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            style={cv.input}
            placeholder="Buscar por nombre o código…"
            value={term}
            onChange={e => setTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={cv.filterBar}>
        <div style={cv.filterGroup}>
          <span style={cv.filterLabel}>Stock</span>
          {[['all','Todos'],['con','Con stock'],['sin','Sin stock']].map(([v,l]) => (
            <span key={v} style={cv.pill(fStock===v)} onClick={() => setFStock(v)}>{l}</span>
          ))}
        </div>
        <div style={cv.filterGroup}>
          <span style={cv.filterLabel}>Ventas</span>
          {[['all','Todos'],['con','Con ventas'],['sin','Sin ventas']].map(([v,l]) => (
            <span key={v} style={cv.pill(fVtas===v)} onClick={() => setFVtas(v)}>{l}</span>
          ))}
        </div>
        <div style={cv.filterGroup}>
          <span style={cv.filterLabel}>Cobertura</span>
          {[['all','Todos'],['sd','S/D'],['0-7','0-7d'],['7-14','7-14d'],['14-30','14-30d'],['30-60','30-60d'],['>60','>60d']].map(([v,l]) => (
            <span key={v} style={cv.pill(fCob===v)} onClick={() => setFCob(v)}>{l}</span>
          ))}
        </div>
        <div style={cv.filterGroup}>
          <span style={cv.filterLabel}>ABC</span>
          {['A','B','C','D','E'].map(cat => (
            <span key={cat} style={cv.pillAbc(fAbc.includes(cat))} onClick={() => toggleAbc(cat)}>{cat}</span>
          ))}
        </div>
        {hasFilters && (
          <span style={cv.clearBtn} onClick={() => { setFStock('all'); setFVtas('all'); setFCob('all'); setFAbc([]); }}>✕ Limpiar</span>
        )}
      </div>

      <div style={cv.sub}>
        <span>
          Página <b>{page + 1}</b> de <b>{totalPages || 1}</b> —{' '}
          <b>{filtered.length}</b>{filtered.length !== results.length ? ` de ${results.length}` : ''} productos en <b>{sucName}</b>
        </span>
        {fallbackCount > 0 && (
          <span style={cv.warnPill}>⚠ {fallbackCount} sin datos por sala</span>
        )}
      </div>

      {error && <div style={{padding: 12, color: 'var(--status-danger)', fontSize: 13}}>{error}</div>}

      <div style={{borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflow: 'hidden'}}>
        <div style={{maxHeight: 'calc(100vh - 220px)', overflow: 'auto'}}>
          <table style={cv.table}>
            <thead>
              <tr>
                <th style={cv.th('nombre')} onClick={() => toggleSort('nombre')}>
                  Producto <span style={cv.sortIcon('nombre')}>{sortCol==='nombre'?(sortDir>0?'▲':'▼'):'⇅'}</span>
                </th>
                <th style={cv.th(null)}>Código</th>
                <th style={cv.th('proveedor')} onClick={() => toggleSort('proveedor')}>
                  Proveedor <span style={cv.sortIcon('proveedor')}>{sortCol==='proveedor'?(sortDir>0?'▲':'▼'):'⇅'}</span>
                </th>
                <th style={{...cv.th('stock'), textAlign:'right'}} onClick={() => toggleSort('stock')}>
                  Stock <span style={cv.sortIcon('stock')}>{sortCol==='stock'?(sortDir>0?'▲':'▼'):'⇅'}</span>
                </th>
                <th style={{...cv.th('sales30d'), textAlign:'right'}} onClick={() => toggleSort('sales30d')}>
                  Ventas 30d <span style={cv.sortIcon('sales30d')}>{sortCol==='sales30d'?(sortDir>0?'▲':'▼'):'⇅'}</span>
                </th>
                <th style={{...cv.th('coverageDays'), textAlign:'right'}} onClick={() => toggleSort('coverageDays')}>
                  Cobertura <span style={cv.sortIcon('coverageDays')}>{sortCol==='coverageDays'?(sortDir>0?'▲':'▼'):'⇅'}</span>
                </th>
                <th style={{...cv.th('abc'), textAlign:'center'}} onClick={() => toggleSort('abc')}>
                  ABC <span style={cv.sortIcon('abc')}>{sortCol==='abc'?(sortDir>0?'▲':'▼'):'⇅'}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && results.length === 0 ? (
                <tr><td colSpan={7} style={cv.empty}>Cargando…</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={7} style={cv.empty}>Sin resultados.</td></tr>
              ) : paginated.map((r, i) => {
                const abc = r.abcSucursal || r.abc || '';
                const rowStyle = r.fallback ? cv.rowFallback : i % 2 === 0 ? cv.rowEven : cv.rowOdd;
                const stockStyle = r.stock <= 0 ? cv.stockZero : r.stock <= 5 ? cv.stockLow : cv.stockHigh;
                return (
                <tr key={r.id} style={rowStyle}>
                  <td style={cv.td}>
                    <span style={{fontWeight: 600}}>{r.nombre}</span>
                    {r.fallback && <span style={cv.fallbackTag} title="Sin datos específicos de esta sucursal">GENERAL</span>}
                  </td>
                  <td style={{...cv.td, fontFamily: 'monospace', fontSize: 11, color: 'var(--text-tertiary)'}}>{r.barcode || '—'}</td>
                  <td style={{...cv.td, fontSize: 12, color: 'var(--text-secondary)'}}>{r.proveedor || '—'}</td>
                  <td style={{...cv.td, textAlign: 'right', ...stockStyle}}>{r.stock} u</td>
                  <td style={{...cv.td, textAlign: 'right', color: r.sales30d > 0 ? '#a78bfa' : 'var(--text-tertiary)', fontWeight: r.sales30d > 0 ? 700 : 400}}>{r.sales30d} u</td>
                  <td style={{...cv.td, textAlign: 'right'}}>
                    {r.sales30d === 0
                      ? <span style={{color:'#f87171', fontSize:10, fontWeight:700}}>Sin ventas</span>
                      : r.cobertura
                        ? <span style={cv.cobBadge(r.cobertura)}>{r.coverageDays}d</span>
                        : <span style={{color:'var(--text-tertiary)',fontSize:11}}>S/D</span>}
                  </td>
                  <td style={{...cv.td, textAlign: 'center'}}>
                    {abc ? <span style={cv.abcBadge(abc)}>{abc}</span> : <span style={{color:'var(--text-tertiary)'}}>—</span>}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={cv.pagBar}>
            <span style={cv.pagBtn(false, page === 0)} onClick={() => page > 0 && setPage(0)}>«</span>
            <span style={cv.pagBtn(false, page === 0)} onClick={() => page > 0 && setPage(p => p - 1)}>‹ Ant</span>
            <span style={cv.pagInfo}>
              {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} de {filtered.length}
            </span>
            <span style={cv.pagBtn(false, page >= totalPages - 1)} onClick={() => page < totalPages - 1 && setPage(p => p + 1)}>Sig ›</span>
            <span style={cv.pagBtn(false, page >= totalPages - 1)} onClick={() => page < totalPages - 1 && setPage(totalPages - 1)}>»</span>
            <span style={cv.pagInfo}>|</span>
            {Array.from({length: totalPages}, (_, i) => (
              <span key={i} style={cv.pagBtn(i === page, false)} onClick={() => setPage(i)}>{i + 1}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

window.AuditView = AuditView;
window.UsersView = UsersView;
window.ConsolidadoView = ConsolidadoView;
window.SyncStatusView = SyncStatusView;
window.CatalogoView = CatalogoView;
