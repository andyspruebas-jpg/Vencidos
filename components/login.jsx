/* ═══════════════════════════════════════════════
   LOGIN SCREEN — Vencidos App
   ═══════════════════════════════════════════════ */
const LoginScreen = ({ onLogin, style, theme }) => {
  const [email, setEmail] = React.useState(''); // 'email' reutilizado como username
  const [password, setPassword] = React.useState('');
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');

  const getSucursalName = (code) =>
    window.MOCK.SUCURSALES.find((sucursal) => sucursal.id === code)?.name || code;

  const getDemoDesc = (user) => {
    if (user.role === 'admin') return 'Administrador · Acceso total';
    if (user.role === 'supervisor') return 'Supervisor · Todas las sucursales';
    return `Personal de Sala · ${getSucursalName(user.sucursal)}`;
  };

  const demoUsers = [
    window.MOCK.USERS.find((user) => user.name === 'Pedro Copa'),
    window.MOCK.USERS.find((user) => user.role === 'supervisor'),
    window.MOCK.USERS.find((user) => user.role === 'sala'),
  ].filter(Boolean).map((user) => ({ ...user, desc: getDemoDesc(user) }));

  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (user) => {
    if (user) {
      setError('');
      onLogin(user);
      return;
    }

    const username = email.trim();
    if (!username) {
      setError('Por favor, ingresa tu usuario.');
      return;
    }
    if (!password) {
      setError('Por favor, ingresa tu contraseña.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const loggedUser = await window.MOCK.login(username, password);
      setError('');
      onLogin(loggedUser);
    } catch (e) {
      setError(e.message || 'Credenciales inválidas.');
    } finally {
      setLoading(false);
    }
  };

  const ls = {
    wrapper: {
      display: 'flex', height: '100vh', width: '100vw',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #09090B 0%, #18181B 50%, #09090B 100%)'
        : style === 'luminoso'
          ? 'linear-gradient(135deg, #FFF7ED 0%, #FAFAFA 50%, #F0F4FF 100%)'
          : 'linear-gradient(135deg, #F0F0FF 0%, #FAFAFA 50%, #F0FAFF 100%)',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    },
    bgOrb1: {
      position: 'absolute', width: 600, height: 600, borderRadius: '50%',
      background: style === 'luminoso'
        ? 'radial-gradient(circle, oklch(0.85 0.12 25 / 0.2), transparent 70%)'
        : 'radial-gradient(circle, oklch(0.8 0.1 280 / 0.2), transparent 70%)',
      top: '-15%', right: '-10%', filter: 'blur(60px)',
    },
    bgOrb2: {
      position: 'absolute', width: 500, height: 500, borderRadius: '50%',
      background: style === 'luminoso'
        ? 'radial-gradient(circle, oklch(0.8 0.08 80 / 0.15), transparent 70%)'
        : 'radial-gradient(circle, oklch(0.75 0.08 200 / 0.15), transparent 70%)',
      bottom: '-10%', left: '-5%', filter: 'blur(50px)',
    },
    card: {
      position: 'relative', zIndex: 1,
      width: '100%', maxWidth: 420, margin: '0 20px',
      background: 'var(--bg-glass)', backdropFilter: 'blur(24px)',
      border: '1px solid var(--bg-glass-border)',
      borderRadius: 'var(--radius-xl)', padding: '40px 36px',
      boxShadow: 'var(--shadow-xl)',
      animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
    },
    logo: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      marginBottom: 32, gap: 12,
    },
    logoIcon: {
      width: 56, height: 56, borderRadius: 16,
      background: 'var(--accent)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 20px var(--accent-muted)',
    },
    title: {
      fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em',
      color: 'var(--text-primary)',
    },
    subtitle: {
      fontSize: 14, color: 'var(--text-tertiary)', fontWeight: 400,
    },
    field: { marginBottom: 16 },
    label: {
      display: 'block', fontSize: 13, fontWeight: 600,
      color: 'var(--text-secondary)', marginBottom: 6,
    },
    inputWrap: { position: 'relative' },
    passToggle: {
      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
      background: 'none', border: 'none', color: 'var(--text-tertiary)',
      cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)',
    },
    loginBtn: {
      width: '100%', padding: '13px 20px', marginTop: 8,
      fontSize: 15, fontWeight: 700, borderRadius: 'var(--radius-md)',
    },
    divider: {
      display: 'flex', alignItems: 'center', gap: 12,
      margin: '24px 0', color: 'var(--text-tertiary)', fontSize: 12,
    },
    divLine: { flex: 1, height: 1, background: 'var(--border-color)' },
    demoLabel: {
      fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)',
      textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10,
    },
    demoCard: (active) => ({
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', borderRadius: 'var(--radius-md)',
      border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border-color)'}`,
      background: active ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
      cursor: 'pointer', transition: 'all var(--transition-fast)',
      marginBottom: 8,
    }),
    avatar: (role) => ({
      width: 38, height: 38, borderRadius: 'var(--radius-sm)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
      background: role === 'admin' ? 'var(--status-danger)'
        : role === 'supervisor' ? 'var(--status-info)'
        : 'var(--status-success)',
    }),
    demoName: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' },
    demoDesc: { fontSize: 12, color: 'var(--text-tertiary)' },
  };

  return (
    <div style={ls.wrapper}>
      <div style={ls.bgOrb1}></div>
      <div style={ls.bgOrb2}></div>
      <div style={ls.card}>
        <div style={ls.logo}>
          <div style={ls.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div style={ls.title}>Vencidos</div>
            <div style={{...ls.subtitle, textAlign:'center'}}>Gestión de productos</div>
          </div>
        </div>

        <div style={ls.field}>
          <label style={ls.label}>Usuario</label>
          <input type="text" placeholder="Ej: Jorge" value={email}
            onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={ls.field}>
          <label style={ls.label}>Contraseña</label>
          <div style={ls.inputWrap}>
            <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              style={{ paddingRight: 60 }} />
            <button style={ls.passToggle} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ color: 'var(--status-danger)', fontSize: 13, fontWeight: 500, margin: '8px 0 12px' }}>
            {error}
          </div>
        )}

        <button className="btn btn-primary" style={ls.loginBtn}
          onClick={() => handleLogin(selectedUser)}
          disabled={loading}>
          {loading ? 'Verificando...' : 'Iniciar sesión'}
        </button>

        <div style={ls.divider}>
          <div style={ls.divLine}></div>
          <span>Acceso rápido demo</span>
          <div style={ls.divLine}></div>
        </div>

        <div style={ls.demoLabel}>Selecciona un rol</div>
        {demoUsers.map(u => (
          <div key={u.id} style={ls.demoCard(selectedUser?.id === u.id)}
            onClick={() => { setSelectedUser(u); handleLogin(u); }}>
            <div style={ls.avatar(u.role)}>{u.avatar}</div>
            <div>
              <div style={ls.demoName}>{u.name}</div>
              <div style={ls.demoDesc}>{u.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

window.LoginScreen = LoginScreen;
