/* ═══════════════════════════════════════════════
   DASHBOARD VIEW v2 — Charts + KPIs + Date Range
   Uses Chart.js for visualizations
   ═══════════════════════════════════════════════ */

const KPICard = ({ value, label, change, icon, color, bgColor, delay = 0, onClick }) => {
  const ks = {
    card: {
      padding: '20px', borderRadius: 'var(--radius-lg)',
      background: 'var(--card-bg)', border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column', gap: 8,
      animation: 'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
      animationDelay: `${delay}ms`,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    },
    top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    iconWrap: {
      width: 40, height: 40, borderRadius: 'var(--radius-md)',
      background: bgColor, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color,
    },
    value: { fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 },
    label: { fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 },
    change: (positive) => ({
      fontSize: 12, fontWeight: 600,
      color: positive ? 'var(--status-success)' : 'var(--status-danger)',
    }),
  };
  return (
    <div style={ks.card} onClick={onClick}
      onMouseEnter={onClick ? (e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; } : undefined}
      onMouseLeave={onClick ? (e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; } : undefined}
    >
      <div style={ks.top}>
        <div style={ks.iconWrap}>{icon}</div>
        {change !== undefined && <span style={ks.change(change > 0)}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>}
      </div>
      <div style={ks.value}>{value}</div>
      <div style={ks.label}>{label}</div>
    </div>
  );
};

const ChartCard = ({ title, children, style: extraStyle, delay = 0 }) => (
  <div style={{
    background: 'var(--card-bg)', border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-xs)',
    animation: 'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
    animationDelay: `${delay}ms`, ...extraStyle,
  }}>
    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>{title}</div>
    {children}
  </div>
);

/* ── Date Range Picker Component ── */
const DateRangePicker = ({ startDate, endDate, onChangeStart, onChangeEnd, presets, activePreset, onPreset }) => {
  const ds = {
    wrap: {
      display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
      padding: '14px 18px', background: 'var(--card-bg)',
      border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)',
      marginBottom: 20, animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
    },
    label: {
      fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)',
      textTransform: 'uppercase', letterSpacing: '0.05em',
    },
    dateInput: {
      padding: '8px 12px', fontSize: 13, borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
      color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
      outline: 'none', width: 140,
    },
    sep: { color: 'var(--text-tertiary)', fontSize: 13 },
    presets: { display: 'flex', gap: 4, marginLeft: 'auto' },
    preset: (active) => ({
      padding: '6px 12px', borderRadius: 'var(--radius-full)',
      fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
      background: active ? 'var(--accent)' : 'var(--bg-tertiary)',
      color: active ? 'white' : 'var(--text-secondary)',
      fontFamily: 'var(--font-body)', transition: 'all var(--transition-fast)',
    }),
    icon: {
      width: 32, height: 32, borderRadius: 'var(--radius-sm)',
      background: 'var(--accent-subtle)', color: 'var(--accent)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
  };

  return (
    <div style={ds.wrap}>
      <div style={ds.icon}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>
      <span style={ds.label}>Desde</span>
      <input type="date" style={ds.dateInput} value={startDate} onChange={e => onChangeStart(e.target.value)} />
      <span style={ds.sep}>—</span>
      <span style={ds.label}>Hasta</span>
      <input type="date" style={ds.dateInput} value={endDate} onChange={e => onChangeEnd(e.target.value)} />
      <div style={ds.presets}>
        {presets.map(p => (
          <button key={p.id} style={ds.preset(activePreset === p.id)}
            onClick={() => onPreset(p.id)}>{p.label}</button>
        ))}
      </div>
    </div>
  );
};

const DashboardView = ({ role, onNavigate }) => {
  const navigateToTabla = (filterOverrides) => {
    const base = {
      categoria: 'Todos', proveedor: 'Todos', origen: 'Todos',
      abc: 'Todos', etiqueta: 'Todos', abcSucursal: 'Todos',
      cobertura: 'Todos', sucursal: 'Todos', estado: 'Todos',
      tipo: 'Todos', accion: 'Todos', search: '', vencido: 'Todos',
    };
    localStorage.setItem('vencidos_filters', JSON.stringify({ ...base, ...filterOverrides }));
    if (onNavigate) onNavigate('tabla');
  };
  const chartRefs = React.useRef({});
  const chartInstances = React.useRef({});
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const handler = () => setTick(t => t + 1);
    window.addEventListener('vencidos_data_changed', handler);
    return () => window.removeEventListener('vencidos_data_changed', handler);
  }, []);

  const allProducts = window.MOCK.MOCK_PRODUCTS;
  const monthly = window.MOCK.MONTHLY_DATA;

  // Date range state
  const today = new Date().toISOString().split('T')[0];
  const defaultStart = '2026-01-01';
  const [startDate, setStartDate] = React.useState(defaultStart);
  const [endDate, setEndDate] = React.useState(today);
  const [activePreset, setActivePreset] = React.useState('ytd');

  const presets = [
    { id: '30d', label: '30 días' },
    { id: '90d', label: '90 días' },
    { id: 'ytd', label: 'Este año' },
    { id: 'all', label: 'Todo' },
  ];

  const handlePreset = (id) => {
    setActivePreset(id);
    const now = new Date();
    let start;
    if (id === '30d') start = new Date(now.getTime() - 30 * 86400000);
    else if (id === '90d') start = new Date(now.getTime() - 90 * 86400000);
    else if (id === 'ytd') start = new Date(now.getFullYear(), 0, 1);
    else start = new Date(2025, 0, 1);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(now.toISOString().split('T')[0]);
  };

  // Filter products by date range
  const products = React.useMemo(() => {
    return allProducts.filter(p => {
      return p.fechaRegistro >= startDate && p.fechaRegistro <= endDate;
    });
  }, [allProducts, startDate, endDate]);

  // Filter monthly data by date range
  const filteredMonthly = React.useMemo(() => {
    return monthly.filter(m => m.fecha >= startDate && m.fecha <= endDate);
  }, [monthly, startDate, endDate]);

  const totalVenceMenos3m = products.filter(p => p.estado === 'vence_menos_3m').length;
  const totalDevoluciones = products.filter(p => p.estado === 'devoluciones').length;
  const totalYaVencido = products.filter(p => p.estado === 'ya_vencido').length;
  const totalVencidos = products.filter(p => p.diasRestantes < 0).length;

  const getAccent = () => {
    const style = document.documentElement.dataset.style;
    return style === 'cristal' ? '120, 86, 214' : '216, 87, 52';
  };
  const isDark = () => document.documentElement.dataset.theme === 'dark';

  React.useEffect(() => {
    const renderCharts = () => {
      const dark = isDark();
      const gridColor = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
      const textColor = dark ? '#A1A1AA' : '#71717A';
      const accentRgb = getAccent();

      Object.values(chartInstances.current).forEach(c => c?.destroy());

      // 1. Monthly evolution line chart
      if (chartRefs.current.line) {
        const displayMonthly = filteredMonthly.length > 0 ? filteredMonthly : monthly;
        chartInstances.current.line = new Chart(chartRefs.current.line, {
          type: 'line',
          data: {
            labels: displayMonthly.map(m => m.mes),
            datasets: [
              {
                label: 'Vence <3 meses', data: displayMonthly.map(m => m.venceMenos3m ?? 0),
                borderColor: '#F97316', backgroundColor: 'rgba(249,115,22,0.1)',
                fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5,
              },
              {
                label: 'Devoluciones', data: displayMonthly.map(m => m.devoluciones ?? 0),
                borderColor: '#14B8A6', backgroundColor: 'transparent',
                tension: 0.4, borderWidth: 2, pointRadius: 0, borderDash: [5, 4],
              },
              {
                label: 'Ya vencidos', data: displayMonthly.map(m => m.yaVencido ?? 0),
                borderColor: '#EF4444', backgroundColor: 'transparent',
                tension: 0.4, borderWidth: 2, pointRadius: 0,
              },
            ],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: textColor, usePointStyle: true, padding: 16, font: { size: 11 } } } },
            scales: {
              x: { grid: { display: false }, ticks: { color: textColor, font: { size: 11 } } },
              y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } }, beginAtZero: true },
            },
            interaction: { mode: 'index', intersect: false },
          },
        });
      }

      // 2. Actions distribution donut
      if (chartRefs.current.donut) {
        const actionCounts = {};
        products.forEach(p => { if (p.accion) actionCounts[p.accion] = (actionCounts[p.accion] || 0) + 1; });
        const sorted = Object.entries(actionCounts).sort((a, b) => b[1] - a[1]).slice(0, 7);
        const labels = sorted.map(s => s[0]);
        const data = sorted.map(s => s[1]);
        const colors = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

        chartInstances.current.donut = new Chart(chartRefs.current.donut, {
          type: 'doughnut',
          data: {
            labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }],
          },
          options: {
            responsive: true, maintainAspectRatio: false, cutout: '68%',
            plugins: {
              legend: { position: 'right', labels: { color: textColor, usePointStyle: true, padding: 10, font: { size: 10 }, boxWidth: 8 } },
            },
          },
        });
      }

      // 3. Bar chart by sucursal
      if (chartRefs.current.bars) {
        const sucCounts = {};
        products.forEach(p => { sucCounts[p.sucursalName || p.sucursal] = (sucCounts[p.sucursalName || p.sucursal] || 0) + 1; });
        const sorted = Object.entries(sucCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);

        chartInstances.current.bars = new Chart(chartRefs.current.bars, {
          type: 'bar',
          data: {
            labels: sorted.map(s => s[0]),
            datasets: [{
              data: sorted.map(s => s[1]),
              backgroundColor: `rgba(${accentRgb}, 0.75)`,
              borderRadius: 6, borderSkipped: false, barPercentage: 0.6,
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false, indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
              y: { grid: { display: false }, ticks: { color: textColor, font: { size: 11 } } },
            },
          },
        });
      }

      // 4. Top 10 providers
      if (chartRefs.current.providers) {
        const provCounts = {};
        products.forEach(p => { provCounts[p.proveedor] = (provCounts[p.proveedor] || 0) + 1; });
        const sorted = Object.entries(provCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
        const colors = ['#EF4444','#F59E0B','#F97316','#10B981','#3B82F6','#8B5CF6','#EC4899','#6B7280','#14B8A6','#A855F7'];

        chartInstances.current.providers = new Chart(chartRefs.current.providers, {
          type: 'bar',
          data: {
            labels: sorted.map(s => s[0].length > 22 ? s[0].substring(0, 19) + '...' : s[0]),
            datasets: [{
              data: sorted.map(s => s[1]),
              backgroundColor: sorted.map((_, i) => colors[i % colors.length]),
              borderRadius: 6, borderSkipped: false, barPercentage: 0.6,
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false, indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
              y: { grid: { display: false }, ticks: { color: textColor, font: { size: 10 } } },
            },
          },
        });
      }

      // 5. Coverage distribution
      if (chartRefs.current.coverage) {
        const covCounts = {};
        window.MOCK.COBERTURA_RANGES.forEach(r => { covCounts[r] = 0; });
        products.forEach(p => { if (p.cobertura) covCounts[p.cobertura] = (covCounts[p.cobertura] || 0) + 1; });
        const labels = Object.keys(covCounts);
        const data = Object.values(covCounts);
        const covColors = labels.map((_, i) => {
          const hues = [0, 25, 45, 80, 120, 180, 220, 260];
          return dark ? `oklch(0.7 0.14 ${hues[i]})` : `oklch(0.6 0.16 ${hues[i]})`;
        });

        chartInstances.current.coverage = new Chart(chartRefs.current.coverage, {
          type: 'bar',
          data: {
            labels: labels.map(l => l + ' días'),
            datasets: [{
              data,
              backgroundColor: covColors,
              borderRadius: 6, borderSkipped: false, barPercentage: 0.7,
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: textColor, font: { size: 10 } } },
              y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } }, beginAtZero: true },
            },
          },
        });
      }
    };

    const timer = setTimeout(renderCharts, 100);
    const observer = new MutationObserver(renderCharts);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-style'] });
    return () => { clearTimeout(timer); observer.disconnect(); Object.values(chartInstances.current).forEach(c => c?.destroy()); };
  }, [products, filteredMonthly]);

  const ds = {
    container: { padding: '24px', maxWidth: 1200, margin: '0 auto' },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 },
    chartGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 16, marginBottom: 24 },
    chartHeight: { position: 'relative', height: 280 },
  };

  const IconBox = ({ children }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );

  return (
    <div style={ds.container}>
      {/* Date Range Picker */}
      <DateRangePicker
        startDate={startDate} endDate={endDate}
        onChangeStart={(v) => { setStartDate(v); setActivePreset(''); }}
        onChangeEnd={(v) => { setEndDate(v); setActivePreset(''); }}
        presets={presets} activePreset={activePreset}
        onPreset={handlePreset}
      />

      <div style={ds.kpiGrid}>
        <KPICard value={products.length} label="Total productos registrados" change={12}
          color="var(--accent)" bgColor="var(--accent-subtle)" delay={0}
          onClick={() => navigateToTabla({})}
          icon={<IconBox><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></IconBox>} />
        <KPICard value={totalVenceMenos3m} label="Vence en menos de 3 meses" change={-8}
          color="#F97316" bgColor="rgba(249,115,22,0.1)" delay={60}
          onClick={() => navigateToTabla({ estado: 'vence_menos_3m' })}
          icon={<IconBox><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></IconBox>} />
        <KPICard value={totalDevoluciones} label="Devoluciones a proveedor" change={0}
          color="#14B8A6" bgColor="rgba(20,184,166,0.1)" delay={120}
          onClick={() => navigateToTabla({ estado: 'devoluciones' })}
          icon={<IconBox><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></IconBox>} />
        <KPICard value={totalYaVencido} label="Ya vencidos" change={-3}
          color="var(--status-danger)" bgColor="var(--status-danger-bg)" delay={180}
          onClick={() => navigateToTabla({ estado: 'ya_vencido' })}
          icon={<IconBox><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></IconBox>} />
      </div>

      <div style={ds.chartGrid}>
        <ChartCard title="Evolución mensual" delay={200}>
          <div style={ds.chartHeight}>
            <canvas ref={el => chartRefs.current.line = el}></canvas>
          </div>
        </ChartCard>
        <ChartCard title="Distribución de acciones" delay={260}>
          <div style={ds.chartHeight}>
            <canvas ref={el => chartRefs.current.donut = el}></canvas>
          </div>
        </ChartCard>
      </div>

      <div style={ds.chartGrid}>
        <ChartCard title="Productos por sucursal" delay={320}>
          <div style={{...ds.chartHeight, height: 340}}>
            <canvas ref={el => chartRefs.current.bars = el}></canvas>
          </div>
        </ChartCard>
        <ChartCard title="Top 10 proveedores con más vencidos" delay={380}>
          <div style={{...ds.chartHeight, height: 340}}>
            <canvas ref={el => chartRefs.current.providers = el}></canvas>
          </div>
        </ChartCard>
      </div>

      <div style={ds.chartGrid}>
        <ChartCard title="Distribución por cobertura (días)" delay={440} style={{gridColumn: '1 / -1'}}>
          <div style={{...ds.chartHeight, height: 260}}>
            <canvas ref={el => chartRefs.current.coverage = el}></canvas>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

window.DashboardView = DashboardView;
window.ChartCard = ChartCard;
window.DateRangePicker = DateRangePicker;
