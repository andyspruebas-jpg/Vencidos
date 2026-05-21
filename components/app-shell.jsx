/* ═══════════════════════════════════════════════
   APP SHELL — Sidebar + Header + Routing
   ═══════════════════════════════════════════════ */

const NAV_ITEMS = {
  sala: [
  { id: 'registro', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Mis productos' },
  { id: 'catalogo', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', label: 'Catálogo' },
  { id: 'historial', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Historial' }],

  supervisor: [
  { id: 'dashboard', icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z', label: 'Dashboard' },
  { id: 'tabla', icon: 'M3 10h18M3 14h18M3 6h18M3 18h18', label: 'Tabla de datos' },
  { id: 'consolidado', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Consolidado' },
  { id: 'catalogo', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', label: 'Catálogo' },
  { id: 'auditoria', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Historial' },
  { id: 'usuarios', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', label: 'Usuarios' },
  { id: 'sincronizacion', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', label: 'Sincronización' }],

  admin: [
  { id: 'dashboard', icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z', label: 'Dashboard' },
  { id: 'tabla', icon: 'M3 10h18M3 14h18M3 6h18M3 18h18', label: 'Tabla de datos' },
  { id: 'consolidado', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Consolidado' },
  { id: 'catalogo', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', label: 'Catálogo' },
  { id: 'auditoria', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Auditoría' },
  { id: 'usuarios', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', label: 'Usuarios' },
  { id: 'sincronizacion', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', label: 'Sincronización' }]

};

const SvgIcon = ({ d, size = 20, stroke = 'currentColor' }) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none"
stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>;


const BellIcon = () =>
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>;


const NotificationPanel = ({ notifications, onClose, onDelete, onDeleteAll, canManage = true }) => {
  const ns = {
    overlay: {
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.2)', animation: 'fadeIn 0.2s ease'
    },
    panel: {
      position: 'fixed', top: 8, right: 8, width: 380, maxHeight: 'calc(100vh - 16px)',
      background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)',
      zIndex: 1000, animation: 'slideDown 0.3s cubic-bezier(0.16,1,0.3,1) both',
      overflow: 'hidden', display: 'flex', flexDirection: 'column'
    },
    header: {
      padding: '14px 20px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)',
      gap: 8,
    },
    title: { fontSize: 15, fontWeight: 700, flex: 1 },
    item: (read) => ({
      padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start',
      borderBottom: '1px solid var(--border-subtle)',
      background: read ? 'transparent' : 'var(--accent-subtle)',
      transition: 'background var(--transition-fast)',
    }),
    dot: (type) => ({
      width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
      background: type === 'danger' ? 'var(--status-danger)' :
        type === 'warning' ? 'var(--status-warning)' :
        type === 'success' ? 'var(--status-success)' : 'var(--status-info)'
    }),
    text: { fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 },
    time: { fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 },
    deleteBtn: {
      flexShrink: 0, marginLeft: 'auto', background: 'none', border: 'none',
      color: 'var(--text-tertiary)', cursor: 'pointer', padding: '2px 4px',
      borderRadius: 4, fontSize: 16, lineHeight: 1,
      transition: 'color var(--transition-fast)',
    },
    empty: {
      padding: '40px 20px', textAlign: 'center',
      color: 'var(--text-tertiary)', fontSize: 13,
    },
  };

  return (
    <React.Fragment>
      <div style={ns.overlay} onClick={onClose}></div>
      <div style={ns.panel}>
        <div style={ns.header}>
          <span style={ns.title}>Notificaciones</span>
          {canManage && notifications.length > 0 && (
            <button className="btn-ghost btn btn-sm"
              style={{ color: 'var(--status-danger)', fontSize: 12 }}
              onClick={onDeleteAll}>
              Eliminar todo
            </button>
          )}
          <button className="btn-ghost btn btn-sm" onClick={onClose}>Cerrar</button>
        </div>
        <div style={{ overflow: 'auto', flex: 1 }}>
          {notifications.length === 0
            ? <div style={ns.empty}>Sin notificaciones</div>
            : notifications.map((n) => (
              <div key={n.id} style={ns.item(n.read)}>
                <div style={ns.dot(n.type)}></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={ns.text}>{n.text}</div>
                  <div style={ns.time}>{n.time}</div>
                </div>
                {canManage && (
                  <button style={ns.deleteBtn}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--status-danger)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                    onClick={() => onDelete(n.id)}
                    title="Eliminar">×</button>
                )}
              </div>
            ))
          }
        </div>
      </div>
    </React.Fragment>
  );
};

const AppShell = ({ user, currentView, onNavigate, onLogout, children, onToggleTheme, theme }) => {
  const NOTIFICATION_POLL_MS = 10000;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 769);
  const [, setTick] = React.useState(0);
  const navItems = NAV_ITEMS[user.role] || NAV_ITEMS.sala;
  const roleLabel = user.role === 'sala' ? `Sala · ${user.sucursal}` : user.role === 'admin' ? 'Administrador' : 'Supervisor';
  const canManageNotifications = user.role !== 'sala';

  const visibleNotifications = (() => {
    const all = window.MOCK.MOCK_NOTIFICATIONS || [];
    if (user.role !== 'sala') return all;
    const mySucursal = user.sucursal || '';
    return all.filter(n => n.event === 'status_change' && (n.targetSucursal || '') === mySucursal);
  })();

  const unreadCount = visibleNotifications.filter((n) => !n.read).length;

  const refreshNotifs = async () => {
    try {
      const notifs = await fetch('/vencidos/api/notifications').then(r => r.json());
      window.MOCK.MOCK_NOTIFICATIONS = notifs;
      setTick(t => t + 1);
    } catch {}
  };

  // Re-render on data changes + refresh notifications periodically
  React.useEffect(() => {
    const handler = () => setTick(t => t + 1);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refreshNotifs();
    };
    window.addEventListener('vencidos_data_changed', handler);
    document.addEventListener('visibilitychange', onVisibility);
    refreshNotifs();
    const timer = setInterval(refreshNotifs, NOTIFICATION_POLL_MS);
    return () => {
      window.removeEventListener('vencidos_data_changed', handler);
      document.removeEventListener('visibilitychange', onVisibility);
      clearInterval(timer);
    };
  }, []);

  const openNotifPanel = async () => {
    setNotifOpen(true);
    try {
      await refreshNotifs();
      if (user.role === 'sala') {
        const salaNotifs = (window.MOCK.MOCK_NOTIFICATIONS || []).filter(
          n => n.event === 'status_change' && (n.targetSucursal || '') === (user.sucursal || '') && !n.read
        );
        await Promise.all(
          salaNotifs.map(n => fetch(`/vencidos/api/notifications/${n.id}/read`, { method: 'PUT' }).catch(() => null))
        );
        const salaIds = new Set(salaNotifs.map(n => n.id));
        window.MOCK.MOCK_NOTIFICATIONS = window.MOCK.MOCK_NOTIFICATIONS.map(n =>
          salaIds.has(n.id) ? { ...n, read: true } : n
        );
      } else {
        await fetch('/vencidos/api/notifications/read-all', { method: 'PUT' });
        window.MOCK.MOCK_NOTIFICATIONS = window.MOCK.MOCK_NOTIFICATIONS.map(n => ({ ...n, read: true }));
      }
      setTick(t => t + 1);
    } catch {}
  };

  const handleDeleteNotif = async (id) => {
    try {
      await fetch(`/vencidos/api/notifications/${id}`, { method: 'DELETE' });
      window.MOCK.MOCK_NOTIFICATIONS = window.MOCK.MOCK_NOTIFICATIONS.filter(n => n.id !== id);
      setTick(t => t + 1);
    } catch {}
  };

  const handleDeleteAllNotifs = async () => {
    try {
      await fetch('/vencidos/api/notifications', { method: 'DELETE' });
      window.MOCK.MOCK_NOTIFICATIONS = [];
      setTick(t => t + 1);
    } catch {}
  };

  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const [profileForm, setProfileForm] = React.useState({
    name: user.name || '',
    avatar: user.avatar || '',
    password: user.password || '123456',
    confirmPassword: user.password || '123456'
  });
  const [profileError, setProfileError] = React.useState('');
  const [profileSuccess, setProfileSuccess] = React.useState(false);

  React.useEffect(() => {
    if (profileModalOpen) {
      setProfileForm({
        name: user.name || '',
        avatar: user.avatar || '',
        password: user.password || '123456',
        confirmPassword: user.password || '123456'
      });
      setProfileError('');
      setProfileSuccess(false);
    }
  }, [profileModalOpen, user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      setProfileError('El nombre completo no puede estar vacío.');
      return;
    }
    if (profileForm.password !== profileForm.confirmPassword) {
      setProfileError('Las contraseñas no coinciden.');
      return;
    }

    let finalAvatar = profileForm.avatar;
    if (!finalAvatar.trim()) {
      finalAvatar = profileForm.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    }

    try {
      const updated = await window.MOCK.updateUser(user.id, {
        name: profileForm.name,
        avatar: finalAvatar,
        password: profileForm.password,
      });
      const updatedUserObj = { ...user, ...updated };
      localStorage.setItem('vencidos_user', JSON.stringify(updatedUserObj));
      window.MOCK.addAuditEntry('Editó perfil', `Actualizó sus datos de perfil (nombre/avatar)`, profileForm.name, user.role, finalAvatar);
      setProfileSuccess(true);
      setTimeout(() => { setProfileModalOpen(false); setProfileSuccess(false); }, 1000);
    } catch (e) {
      setProfileError('Error al guardar: ' + e.message);
    }
  };

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 769);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const ss = {
    layout: {
      display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden'
    },
    sidebar: {
      width: 'var(--sidebar-width)', height: '100vh', flexShrink: 0,
      background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border-color)',
      display: isMobile ? 'none' : 'flex', flexDirection: 'column',
      transition: 'all var(--transition-base)'
    },
    sidebarLogo: {
      padding: '24px 20px 20px', display: 'flex', alignItems: 'center', gap: 12
    },
    logoMark: {
      width: 36, height: 36, borderRadius: 10,
      background: 'var(--accent)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0
    },
    logoText: { fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em' },
    logoSub: { fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 },
    nav: { flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 },
    navItem: (active) => ({
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', borderRadius: 'var(--radius-md)',
      background: active ? 'var(--sidebar-active-bg)' : 'transparent',
      color: active ? 'var(--accent)' : 'var(--text-secondary)',
      fontWeight: active ? 600 : 500, fontSize: 14,
      cursor: 'pointer', transition: 'all var(--transition-fast)',
      border: 'none', width: '100%', textAlign: 'left',
      fontFamily: 'var(--font-body)'
    }),
    sidebarFooter: {
      padding: '16px 12px', borderTop: '1px solid var(--border-color)',
      display: 'flex', flexDirection: 'column', gap: 4
    },
    userCard: {
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
      cursor: 'pointer', borderRadius: 'var(--radius-md)',
      transition: 'background var(--transition-fast)',
      width: '100%', background: 'transparent', border: 'none',
      textAlign: 'left', fontFamily: 'var(--font-body)', color: 'var(--text-primary)'
    },
    userAvatar: {
      width: 32, height: 32, borderRadius: 8,
      background: 'var(--accent)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 700, color: 'white',
      overflow: 'hidden', flexShrink: 0
    },
    userName: { fontSize: 13, fontWeight: 600 },
    userRole: { fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'capitalize' },
    main: {
      flex: 1, display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative'
    },
    header: {
      height: 'var(--header-height)', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-glass)', backdropFilter: 'blur(16px)',
      position: 'relative', zIndex: 10
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
    headerTitle: { fontSize: 17, fontWeight: 700 },
    headerRight: { display: 'flex', alignItems: 'center', gap: 8 },
    bellWrap: { position: 'relative' },
    bellBadge: {
      position: 'absolute', top: -2, right: -2, width: 16, height: 16,
      borderRadius: '50%', background: 'var(--status-danger)',
      color: 'white', fontSize: 9, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    content: { flex: 1, overflow: 'auto', position: 'relative' },
    mobileNav: {
      display: isMobile ? 'flex' : 'none',
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-glass)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border-color)',
      padding: '6px 8px calc(env(safe-area-inset-bottom, 0px) + 6px)',
      justifyContent: 'space-around', zIndex: 100
    },
    mobileNavItem: (active) => ({
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      padding: '6px 12px', borderRadius: 'var(--radius-md)',
      color: active ? 'var(--accent)' : 'var(--text-tertiary)',
      background: 'transparent', border: 'none', cursor: 'pointer',
      fontSize: 10, fontWeight: active ? 600 : 500,
      fontFamily: 'var(--font-body)', transition: 'color var(--transition-fast)'
    }),
    hamburger: {
      display: isMobile ? 'flex' : 'none',
      background: 'none', border: 'none', color: 'var(--text-primary)',
      cursor: 'pointer', padding: 4
    }
  };

  const currentLabel = navItems.find((n) => n.id === currentView)?.label || 'Dashboard';

  return (
    <div style={ss.layout}>
      {/* Sidebar - Desktop */}
      <aside style={ss.sidebar}>
        <div style={ss.sidebarLogo}>
          <div style={ss.logoMark}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div style={ss.logoText}>Vencidos</div>
            <div style={ss.logoSub}>Control de productos</div>
          </div>
        </div>
        <nav style={ss.nav}>
          {navItems.map((item) =>
          <button key={item.id} style={ss.navItem(currentView === item.id)}
          onClick={() => onNavigate(item.id)}
          onMouseEnter={(e) => {if (currentView !== item.id) e.currentTarget.style.background = 'var(--bg-hover)';}}
          onMouseLeave={(e) => {if (currentView !== item.id) e.currentTarget.style.background = 'transparent';}}>
              <SvgIcon d={item.icon} size={18} />
              {item.label}
            </button>
          )}
        </nav>
        <div style={ss.sidebarFooter}>
          <button style={ss.userCard} onClick={() => setProfileModalOpen(true)}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--sidebar-active-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <div style={ss.userAvatar}>
              {user.avatar && (user.avatar.startsWith('data:') || user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
                <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              ) : (
                user.avatar
              )}
            </div>
            <div>
              <div style={ss.userName}>{user.name}</div>
              <div style={ss.userRole}>{roleLabel}</div>
            </div>
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}
          style={{ justifyContent: 'flex-start', color: 'var(--text-tertiary)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={ss.main}>
        <header style={ss.header}>
          <div style={ss.headerLeft}>
            <button style={ss.hamburger} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            </button>
            <h1 style={ss.headerTitle}>{currentLabel}</h1>
          </div>
          <div style={ss.headerRight}>
            <button className="btn-icon" onClick={onToggleTheme} title="Cambiar tema">
              {theme === 'light' ?
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg> :

              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
              }
            </button>
            <div style={ss.bellWrap}>
              <button className="btn-icon" onClick={() => notifOpen ? setNotifOpen(false) : openNotifPanel()}>
                <BellIcon />
              </button>
              {unreadCount > 0 && <div style={ss.bellBadge}>{unreadCount}</div>}
            </div>

            {/* Clickable Mobile User Profile Avatar in Header */}
            <button onClick={() => setProfileModalOpen(true)} title="Editar perfil"
              style={{
                width: 32, height: 32, borderRadius: '50%', padding: 0, overflow: 'hidden',
                background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center',
                justifyContent: 'center', border: '1.5px solid var(--border-color)', cursor: 'pointer',
                marginLeft: 4, flexShrink: 0
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              {user.avatar && (user.avatar.startsWith('data:') || user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
                <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              ) : (
                <span style={{ fontSize: 11, fontWeight: 700 }}>{user.avatar}</span>
              )}
            </button>
          </div>
        </header>

        <div style={ss.content}>{children}</div>

        {/* Mobile bottom nav */}
        <div style={ss.mobileNav}>
          {navItems.map((item) =>
          <button key={item.id} style={ss.mobileNavItem(currentView === item.id)}
          onClick={() => onNavigate(item.id)}>
              <SvgIcon d={item.icon} size={20} />
              <span>{item.label}</span>
            </button>
          )}
        </div>
      </div>

      {notifOpen &&
      <NotificationPanel
        notifications={visibleNotifications}
        onClose={() => setNotifOpen(false)}
        onDelete={handleDeleteNotif}
        onDeleteAll={handleDeleteAllNotifs}
        canManage={canManageNotifications} />
      }

      {profileModalOpen && (
        <div style={profileModalStyles.overlay} onClick={() => setProfileModalOpen(false)}>
          <div style={profileModalStyles.modal} onClick={e => e.stopPropagation()}>
            <div style={profileModalStyles.title}>
              <span>Editar perfil</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setProfileModalOpen(false)}>✕</button>
            </div>

            {profileError && (
              <div style={{ color: 'var(--status-danger)', fontSize: 13, fontWeight: 500 }}>
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div style={{ color: 'var(--status-success)', fontSize: 13, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                ¡Perfil actualizado con éxito!
              </div>
            )}

            {/* Avatar Selector */}
            <div style={profileModalStyles.avatarSection}>
              <div style={profileModalStyles.previewWrap}>
                {profileForm.avatar && (profileForm.avatar.startsWith('data:') || profileForm.avatar.startsWith('http') || profileForm.avatar.startsWith('/')) ? (
                  <img src={profileForm.avatar} style={profileModalStyles.previewImg} alt="Preview" />
                ) : (
                  <span style={profileModalStyles.previewInitials}>
                    {profileForm.avatar || profileForm.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="file" accept="image/*" id="profile-upload" style={{ display: 'none' }} onChange={handlePhotoChange} />
                <label htmlFor="profile-upload" className="btn btn-ghost btn-sm" style={{ cursor: 'pointer', border: '1px solid var(--border-color)' }}>
                  Subir imagen
                </label>
                {profileForm.avatar && (profileForm.avatar.startsWith('data:') || profileForm.avatar.startsWith('http') || profileForm.avatar.startsWith('/')) && (
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--status-danger)', border: '1px solid var(--border-subtle)' }}
                    onClick={() => setProfileForm(prev => ({ ...prev, avatar: '' }))}>
                    Restablecer
                  </button>
                )}
              </div>
            </div>

            <div style={profileModalStyles.field}>
              <label style={profileModalStyles.label}>Nombre completo</label>
              <input value={profileForm.name} onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Tu nombre..." />
            </div>

            <div style={profileModalStyles.field}>
              <label style={profileModalStyles.label}>Nueva contraseña</label>
              <input type="password" value={profileForm.password} onChange={e => setProfileForm(prev => ({ ...prev, password: e.target.value }))} placeholder="Nueva contraseña..." />
            </div>

            <div style={profileModalStyles.field}>
              <label style={profileModalStyles.label}>Confirmar contraseña</label>
              <input type="password" value={profileForm.confirmPassword} onChange={e => setProfileForm(prev => ({ ...prev, confirmPassword: e.target.value }))} placeholder="Confirmar contraseña..." />
            </div>

            <div style={profileModalStyles.footer}>
              <button className="btn btn-secondary" onClick={() => setProfileModalOpen(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSaveProfile}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>);

};

const profileModalStyles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease'
  },
  modal: {
    background: 'var(--card-bg)', border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)', padding: '24px 28px', maxWidth: 360,
    width: '100%', boxShadow: 'var(--shadow-xl)', display: 'flex',
    flexDirection: 'column', gap: 14, animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both'
  },
  title: { fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  avatarSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: '4px 0' },
  previewWrap: { position: 'relative', width: 72, height: 72, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid var(--border-color)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' },
  previewInitials: { fontSize: 24, fontWeight: 700, color: 'white' },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' },
  footer: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }
};

window.AppShell = AppShell;

/* ── Custom Select (global) ── */
const _OptionRow = ({ style, isSelected, onClick, label }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div style={style(isSelected, hover)} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <span>{label}</span>
      {isSelected && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      )}
    </div>
  );
};

const CustomSelect = ({ value, onChange, options, placeholder, style: wrapStyle = {} }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => (o.value !== undefined ? o.value : o.label) === value);
  const displayLabel = selected ? selected.label : (placeholder || 'Seleccionar...');

  const cs = {
    wrap: { position: 'relative', ...wrapStyle },
    trigger: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      width: '100%', padding: '10px 14px',
      background: open ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
      border: `1px solid ${open ? 'var(--accent)' : 'var(--border-color)'}`,
      borderRadius: open ? 'var(--radius-md) var(--radius-md) 0 0' : 'var(--radius-md)',
      boxShadow: open ? '0 0 0 3px var(--accent-subtle)' : 'none',
      color: selected ? 'var(--text-primary)' : 'var(--text-tertiary)',
      fontSize: 14, cursor: 'pointer', transition: 'all 0.15s',
      fontFamily: 'var(--font-body)', outline: 'none',
      boxSizing: 'border-box',
    },
    chevron: {
      flexShrink: 0, marginLeft: 8, opacity: 0.5,
      transition: 'transform 0.2s',
      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    },
    dropdown: {
      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 9999,
      background: 'var(--bg-secondary)',
      border: '1px solid var(--accent)',
      borderTop: '1px solid var(--border-color)',
      borderRadius: '0 0 var(--radius-md) var(--radius-md)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      maxHeight: 240, overflowY: 'auto',
      animation: 'scaleIn 0.12s ease',
    },
    option: (isSelected, isHover) => ({
      padding: '9px 14px', cursor: 'pointer', fontSize: 13,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: isSelected ? 'var(--accent-subtle)' : isHover ? 'var(--bg-hover)' : 'transparent',
      color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
      fontWeight: isSelected ? 600 : 400,
      transition: 'background 0.1s',
      borderLeft: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
    }),
  };

  return (
    <div ref={ref} style={cs.wrap}>
      <button type="button" style={cs.trigger} onClick={() => setOpen(o => !o)}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayLabel}
        </span>
        <svg style={cs.chevron} width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div style={cs.dropdown}>
          {options.map((o, i) => {
            const val = o.value !== undefined ? o.value : o.label;
            const isSelected = val === value;
            return (
              <_OptionRow key={i} style={cs.option} isSelected={isSelected}
                onClick={() => { onChange(val); setOpen(false); }}
                label={o.label} />
            );
          })}
        </div>
      )}
    </div>
  );
};
window.SvgIcon = SvgIcon;
