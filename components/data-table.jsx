/* ═══════════════════════════════════════════════
   DATA TABLE VIEW v2 — Updated filters + Export
   ═══════════════════════════════════════════════ */

const DataTableView = () => {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const handler = () => setTick(t => t + 1);
    window.addEventListener('vencidos_data_changed', handler);
    return () => window.removeEventListener('vencidos_data_changed', handler);
  }, []);

  const products = window.MOCK.MOCK_PRODUCTS;
  const [filters, setFilters] = React.useState(() => {
    try {
      const saved = localStorage.getItem('vencidos_filters');
      if (saved) {
        return {
          categoria: 'Todos', proveedor: 'Todos', origen: 'Todos',
          abc: 'Todos', etiqueta: 'Todos', abcSucursal: 'Todos',
          cobertura: 'Todos', sucursal: 'Todos', estado: 'Todos',
          tipo: 'Todos', accion: 'Todos', search: '', vencido: 'Todos',
          ...JSON.parse(saved)
        };
      }
    } catch (e) {
      console.error("Error loading filters from localStorage", e);
    }
    return {
      categoria: 'Todos', proveedor: 'Todos', origen: 'Todos',
      abc: 'Todos', etiqueta: 'Todos', abcSucursal: 'Todos',
      cobertura: 'Todos', sucursal: 'Todos', estado: 'Todos',
      tipo: 'Todos', accion: 'Todos', search: '', vencido: 'Todos',
    };
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('vencidos_filters', JSON.stringify(filters));
    } catch (e) {
      console.error("Error saving filters to localStorage", e);
    }
  }, [filters]);
  const [sortKey, setSortKey] = React.useState('id');
  const [sortDir, setSortDir] = React.useState('desc');
  const [page, setPage] = React.useState(0);
  const [showFilters, setShowFilters] = React.useState(true);
  const pageSize = 25;
  const currentUser = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('vencidos_user') || 'null');
    } catch {
      return null;
    }
  }, []);
  const isAdmin = currentUser?.role === 'admin';
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [savingEdit, setSavingEdit] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    cantidad: 1,
    estado: 'proximo_vencer',
    accion: '',
    fechaVencimiento: '',
    nota: '',
  });

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => k !== 'search' && v !== 'Todos').length;

  const filtered = products.filter(p => {
    if (filters.categoria !== 'Todos' && p.cat1 !== filters.categoria) return false;
    if (filters.proveedor !== 'Todos' && p.proveedor !== filters.proveedor) return false;
    if (filters.origen !== 'Todos' && p.origen !== filters.origen) return false;
    if (filters.abc !== 'Todos' && p.abc !== filters.abc) return false;
    if (filters.etiqueta !== 'Todos' && p.etiqueta !== filters.etiqueta) return false;
    if (filters.abcSucursal !== 'Todos' && p.abcSucursal !== filters.abcSucursal) return false;
    if (filters.cobertura !== 'Todos' && p.cobertura !== filters.cobertura) return false;
    if (filters.sucursal !== 'Todos' && p.sucursalName !== filters.sucursal) return false;
    if (filters.estado !== 'Todos' && p.estado !== filters.estado) return false;
    if (filters.tipo !== 'Todos' && p.tipo !== filters.tipo) return false;
    if (filters.accion !== 'Todos' && p.accion !== filters.accion) return false;
    if (filters.vencido === 'Si' && !(p.diasRestantes < 0)) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      return p.nombre.toLowerCase().includes(s) || p.codigo.includes(s) || p.proveedor.toLowerCase().includes(s);
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let va = a[sortKey], vb = b[sortKey];
    if (typeof va === 'number' && typeof vb === 'number') return sortDir === 'asc' ? va - vb : vb - va;
    if (typeof va === 'string') { va = va.toLowerCase(); vb = (vb||'').toLowerCase(); }
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ k }) => (
    <span style={{ opacity: sortKey === k ? 1 : 0.3, marginLeft: 4, fontSize: 10 }}>
      {sortKey === k && sortDir === 'desc' ? '▼' : '▲'}
    </span>
  );

  const handleExport = () => {
    const headers = ['Código','Producto','Proveedor','Categoría','Sucursal','Tipo','Cantidad',
      'Fecha Vencimiento','Vence en (días)','Estado Vencimiento','Estado','Acción','ABC','ABC Sucursal',
      'Etiqueta','Cobertura','Cobertura Días','Origen','Stock','Ventas','Reportado por','Fecha Registro'];
    const rows = filtered.map(p => [
      p.codigo, p.nombre, p.proveedor, p.cat1, p.sucursalName, p.tipo, p.cantidad,
      p.fechaVencimiento, p.diasRestantes, p.estadoVencimiento,
      p.estado, p.accion, p.abc, p.abcSucursal, p.etiqueta, p.cobertura,
      p.coverageDays, p.origen, p.stock, p.sales, p.reportadoPor, p.fechaRegistro,
    ]);
    const generatedAt = new Date();
    const fileStamp = generatedAt.toISOString().split('T')[0];
    const colWidths = [18, 38, 28, 22, 16, 12, 12, 18, 16, 24, 22, 28, 8, 14, 16, 14, 14, 14, 10, 10, 20, 18];
    downloadExcelWorkbook([
      {
        name: 'Productos Vencidos',
        header: headers,
        autoFilterRef: `A1:${toExcelColumnName(headers.length - 1)}${rows.length + 1}`,
        columnWidths: colWidths,
        rows,
      },
    ], `productos_vencidos_${fileStamp}.xlsx`, generatedAt);
  };

  const setFilter = (key, val) => { setFilters(f => ({...f, [key]: val})); setPage(0); };
  const clearFilters = () => {
    setFilters({
      categoria: 'Todos', proveedor: 'Todos', origen: 'Todos',
      abc: 'Todos', etiqueta: 'Todos', abcSucursal: 'Todos',
      cobertura: 'Todos', sucursal: 'Todos', estado: 'Todos',
      tipo: 'Todos', accion: 'Todos', search: '', vencido: 'Todos',
    });
    setPage(0);
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setEditForm({
      cantidad: p.cantidad || 1,
      estado: p.estado || 'proximo_vencer',
      accion: p.accion || '',
      fechaVencimiento: p.fechaVencimiento || '',
      nota: p.nota || '',
    });
  };

  const closeEdit = () => {
    setEditingProduct(null);
    setSavingEdit(false);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    const cantidadNum = parseInt(editForm.cantidad, 10);
    if (!Number.isFinite(cantidadNum) || cantidadNum <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }
    setSavingEdit(true);
    try {
      const updated = await window.MOCK.updateProduct(editingProduct.id, {
        cantidad: cantidadNum,
        estado: editForm.estado,
        accion: editForm.accion.trim(),
        fechaVencimiento: editForm.fechaVencimiento,
        nota: editForm.nota || '',
      });
      if (currentUser) {
        window.MOCK.addAuditEntry(
          'Editó producto',
          `${updated.nombre} en ${updated.sucursalName || updated.sucursal}`,
          currentUser.name,
          currentUser.role,
          currentUser.avatar
        );
      }
      closeEdit();
    } catch (e) {
      alert('Error al guardar: ' + e.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteProduct = async (p) => {
    if (!p) return;
    if (!window.confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await window.MOCK.deleteProduct(p.id);
      if (currentUser) {
        window.MOCK.addAuditEntry(
          'Eliminó producto',
          `${p.nombre} de ${p.sucursalName || p.sucursal}`,
          currentUser.name,
          currentUser.role,
          currentUser.avatar
        );
      }
    } catch (e) {
      alert('Error al eliminar: ' + e.message);
    }
  };

  const FILTER_DEFS = [
    { key: 'categoria', label: 'Categoría', icon: 'M4 6h16M4 12h16M4 18h16',
      opts: ['Todos', ...new Set(products.map(p => p.cat1).filter(Boolean))] },
    { key: 'proveedor', label: 'Proveedor', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      opts: ['Todos', ...new Set(products.map(p => p.proveedor).filter(Boolean).sort())] },
    { key: 'sucursal', label: 'Sucursal', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      opts: ['Todos', ...window.MOCK.SUCURSALES.map(s => s.name)] },
    { key: 'origen', label: 'Origen', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      opts: ['Todos', ...window.MOCK.ORIGENES], hidden: true },
    { key: 'abc', label: 'Análisis ABC', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      opts: ['Todos', ...window.MOCK.ABC_VALUES], hidden: true },
    { key: 'etiqueta', label: 'Etiqueta', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      opts: ['Todos', ...window.MOCK.ETIQUETAS], hidden: true },
    { key: 'abcSucursal', label: 'ABC Sucursal', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      opts: ['Todos', ...window.MOCK.ABC_VALUES], hidden: true },
    { key: 'cobertura', label: 'Cobertura', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      opts: ['Todos', ...window.MOCK.COBERTURA_RANGES] },
    { key: 'estado', label: 'Estado', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      opts: ['Todos', ...window.MOCK.ESTADOS.map(e => e.id)] },
    { key: 'tipo', label: 'Tipo', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      opts: ['Todos', 'vencido', 'dañado'] },
    { key: 'accion', label: 'Plan de acción', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      opts: ['Todos', ...new Set(products.map(p => p.accion).filter(Boolean).sort())] },
    { key: 'vencido', label: 'Ya vencidos', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      opts: ['Todos', 'Si'] },
  ];

  const ts = {
    container: { padding: '24px', maxWidth: '100%', margin: '0 auto' },
    toolbar: {
      display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center',
    },
    searchWrap: { flex: '1 1 280px', minWidth: 200 },
    filterToggle: {
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '10px 16px', borderRadius: 'var(--radius-md)',
      background: showFilters ? 'var(--accent-subtle)' : 'var(--bg-tertiary)',
      color: showFilters ? 'var(--accent)' : 'var(--text-secondary)',
      border: `1px solid ${showFilters ? 'var(--accent-muted)' : 'var(--border-color)'}`,
      cursor: 'pointer', fontWeight: 600, fontSize: 13,
      fontFamily: 'var(--font-body)', transition: 'all var(--transition-fast)',
      position: 'relative',
    },
    filterBadge: {
      position: 'absolute', top: -6, right: -6,
      width: 18, height: 18, borderRadius: '50%',
      background: 'var(--accent)', color: 'white',
      fontSize: 10, fontWeight: 700, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    },
    filtersPanel: {
      display: showFilters ? 'flex' : 'none',
      flexDirection: 'column', gap: 12, marginBottom: 20, padding: '16px 18px',
      background: 'var(--card-bg)', border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)', animation: showFilters ? 'slideDown 0.25s ease both' : 'none',
    },
    filtersGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10,
    },
    filterItem: {
      display: 'flex', flexDirection: 'column', gap: 4,
    },
    filterLabel: {
      fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
      textTransform: 'uppercase', letterSpacing: '0.05em',
      display: 'flex', alignItems: 'center', gap: 4,
    },
    filterClear: {
      display: 'flex', justifyContent: 'flex-end',
    },
    resultBar: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 12, fontSize: 13, color: 'var(--text-secondary)',
    },
    tableWrap: {
      overflow: 'hidden', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)', background: 'var(--card-bg)',
    },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
    th: {
      textAlign: 'left', padding: '12px 14px', fontWeight: 600,
      color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-tertiary)', cursor: 'pointer', userSelect: 'none',
      whiteSpace: 'nowrap', fontSize: 12, position: 'sticky', top: 0, zIndex: 2,
    },
    td: {
      padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)',
      verticalAlign: 'middle', whiteSpace: 'nowrap',
    },
    row: { transition: 'background var(--transition-fast)' },
    pager: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 16px', borderTop: '1px solid var(--border-color)',
      fontSize: 13, color: 'var(--text-secondary)',
    },
    pageBtn: (disabled) => ({
      padding: '6px 14px', borderRadius: 'var(--radius-sm)',
      background: disabled ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
      border: '1px solid var(--border-color)', cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1, fontFamily: 'var(--font-body)', fontSize: 13,
      color: 'var(--text-primary)',
    }),
    statusDot: (estado) => {
      const e = window.MOCK.ESTADOS.find(x => x.id === estado);
      return { width: 8, height: 8, borderRadius: '50%', display: 'inline-block', marginRight: 6, background: e ? e.color : 'var(--text-tertiary)' };
    },
    tipoBadge: (tipo) => ({
      padding: '2px 8px', borderRadius: 'var(--radius-full)',
      fontSize: 11, fontWeight: 600,
      background: tipo === 'dañado' ? 'var(--status-danger-bg)' : 'var(--status-warning-bg)',
      color: tipo === 'dañado' ? 'var(--status-danger)' : 'var(--status-warning)',
    }),
    accionBadge: (accion) => {
      let bg = 'var(--bg-tertiary)';
      let color = 'var(--text-secondary)';
      let border = '1px solid var(--border-color)';
      
      const acc = (accion || '').toLowerCase();
      if (acc.includes('descuento') || acc.includes('impulsar')) {
        bg = 'var(--status-warning-bg)';
        color = 'var(--status-warning)';
        border = '1px solid oklch(0.75 0.14 80 / 0.15)';
      } else if (acc.includes('traspaso') || acc.includes('cambio')) {
        bg = 'var(--status-info-bg)';
        color = 'var(--status-info)';
        border = '1px solid oklch(0.7 0.13 250 / 0.15)';
      } else if (acc.includes('baja') || acc.includes('tester')) {
        bg = 'var(--status-danger-bg)';
        color = 'var(--status-danger)';
        border = '1px solid oklch(0.7 0.18 25 / 0.15)';
      }
      
      return {
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '11px',
        fontWeight: 700,
        background: bg,
        color: color,
        border: border,
        whiteSpace: 'normal',
        lineHeight: '1.3',
        maxWidth: '220px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      };
    },
    actionButtons: { display: 'flex', gap: 6 },
    actionBtn: {
      border: '1px solid var(--border-color)',
      background: 'var(--bg-secondary)',
      color: 'var(--text-secondary)',
      borderRadius: 'var(--radius-sm)',
      fontSize: 11,
      padding: '4px 8px',
      cursor: 'pointer',
    },
    modalOverlay: {
      position: 'fixed', inset: 0, zIndex: 1200,
      background: 'rgba(0,0,0,0.45)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20,
    },
    modalCard: {
      width: '100%', maxWidth: 520, background: 'var(--card-bg)',
      border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xl)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
    },
    modalTitle: { fontSize: 16, fontWeight: 700 },
    modalGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
    modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
  };

  return (
    <div style={ts.container}>
      <div style={ts.toolbar}>
        <div style={ts.searchWrap}>
          <input placeholder="Buscar por producto, código o proveedor..."
            value={filters.search} onChange={e => setFilter('search', e.target.value)} />
        </div>
        <div style={{position: 'relative'}}>
          <button style={ts.filterToggle} onClick={() => setShowFilters(!showFilters)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
            </svg>
            Filtros {showFilters ? '▲' : '▼'}
          </button>
          {activeFilterCount > 0 && <div style={ts.filterBadge}>{activeFilterCount}</div>}
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleExport}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Exportar Excel
        </button>
      </div>

      <div style={ts.filtersPanel}>
        <div style={ts.filtersGrid}>
          {FILTER_DEFS.filter(f => !f.hidden).map(f => (
            <div key={f.key} style={ts.filterItem}>
              <div style={ts.filterLabel}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon}/></svg>
                {f.label}
              </div>
              <CustomSelect value={filters[f.key]}
                onChange={val => setFilter(f.key, val)}
                style={{ fontSize: 12 }}
                options={f.opts.map(o => ({ value: o, label: o }))} />
            </div>
          ))}
        </div>
        {activeFilterCount > 0 && (
          <div style={ts.filterClear}>
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}
              style={{fontSize: 12, color: 'var(--status-danger)'}}>
              Limpiar {activeFilterCount} filtro{activeFilterCount > 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>

      <div style={ts.resultBar}>
        <span style={{fontWeight: 600}}>{filtered.length} productos encontrados</span>
        <span>Página {page + 1} de {totalPages || 1}</span>
      </div>

      <div style={ts.tableWrap}>
        <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 380px)' }}>
          <table style={ts.table}>
            <thead>
              <tr>
                {[
                  ['nombre', 'Producto'], ['proveedor', 'Proveedor'], ['sucursalName', 'Sucursal'],
                  ['tipo', 'Tipo'], ['cantidad', 'Cant.'], ['fechaVencimiento', 'Vence'],
                  ['diasRestantes', 'Vence en'], ['stock', 'Stock'], ['coverageDays', 'Cobertura'],
                  ['estado', 'Estado'], ['accion', 'Acción'],
                  ...(isAdmin ? [['admin_actions', 'Acciones']] : []),
                ].map(([k, label]) => (
                  <th key={k} style={ts.th} onClick={() => k !== 'admin_actions' && toggleSort(k)}>
                    {label}{k !== 'admin_actions' && <SortIcon k={k} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr>
                  <td colSpan={12} style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, color: 'var(--text-tertiary)' }}>
                      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
                      </svg>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-secondary)' }}>Sin productos</div>
                      <div style={{ fontSize: 13 }}>No hay productos que coincidan con los filtros aplicados.</div>
                    </div>
                  </td>
                </tr>
              )}
              {paged.map(p => (
                <tr key={p.id} style={ts.row}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ ...ts.td, whiteSpace: 'normal', minWidth: 200, maxWidth: 300 }}>
                    <div style={{ fontWeight: 600 }}>{p.nombre}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{p.codigo}</div>
                  </td>
                  <td style={{...ts.td, maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 12}}>
                    {p.proveedor}
                  </td>
                  <td style={ts.td}>
                    <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)', fontSize: 11, fontWeight: 600 }}>
                      {p.sucursalName}
                    </span>
                  </td>
                  <td style={ts.td}>
                    <span style={ts.tipoBadge(p.tipo)}>
                      {p.tipo === 'vencido' ? 'Vencido' : 'Dañado'}
                    </span>
                  </td>
                  <td style={{...ts.td, textAlign: 'center', fontWeight: 600}}>{p.cantidad}</td>
                  <td style={{...ts.td, fontSize: 12}}>{p.fechaVencimiento}</td>
                  <td style={ts.td}>
                    <span style={{
                      fontWeight: 700, fontSize: 12,
                      color: p.diasRestantes < 0 ? 'var(--status-danger)' : p.diasRestantes < 30 ? 'var(--status-warning)' : 'var(--status-success)',
                    }}>{p.diasRestantes}d</span>
                  </td>
                  <td style={{...ts.td, textAlign: 'center'}}>
                    {p.stock > 0
                      ? <span style={{fontSize: 12, fontWeight: 600, color: 'var(--status-success)'}}>{p.stock} u</span>
                      : <span style={{fontSize: 11, color: 'var(--text-tertiary)'}}>—</span>
                    }
                  </td>
                  <td style={ts.td}>
                    {p.coverageDays > 0
                      ? <span style={{
                          fontSize: 11, fontWeight: 600, padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: p.coverageDays > 120 ? 'var(--status-danger-bg)' : p.coverageDays > 60 ? 'var(--status-warning-bg)' : 'var(--status-success-bg)',
                          color: p.coverageDays > 120 ? 'var(--status-danger)' : p.coverageDays > 60 ? 'var(--status-warning)' : 'var(--status-success)',
                        }}>{p.coverageDays}d</span>
                      : <span style={{fontSize: 11, color: 'var(--text-tertiary)'}}>—</span>
                    }
                  </td>
                  <td style={ts.td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={ts.statusDot(p.estado)}></span>
                      <span style={{ fontSize: 12 }}>
                        {window.MOCK.ESTADOS.find(x => x.id === p.estado)?.label || p.estado}
                      </span>
                    </span>
                  </td>
                  <td style={{ ...ts.td, whiteSpace: 'normal' }}>
                    <span style={ts.accionBadge(p.accion)}>
                      {p.accion || 'Sin acción'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={ts.td}>
                      <div style={ts.actionButtons}>
                        <button style={ts.actionBtn} onClick={() => openEdit(p)}>Editar</button>
                        <button
                          style={{ ...ts.actionBtn, color: 'var(--status-danger)' }}
                          onClick={() => handleDeleteProduct(p)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={ts.pager}>
          <button style={ts.pageBtn(page === 0)} onClick={() => page > 0 && setPage(page - 1)}>← Anterior</button>
          <span>{page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} de {sorted.length}</span>
          <button style={ts.pageBtn(page >= totalPages - 1)} onClick={() => page < totalPages - 1 && setPage(page + 1)}>Siguiente →</button>
        </div>
      </div>

      {isAdmin && editingProduct && (
        <div style={ts.modalOverlay} onClick={closeEdit}>
          <div style={ts.modalCard} onClick={e => e.stopPropagation()}>
            <div style={ts.modalTitle}>Editar producto</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              {editingProduct.nombre}
            </div>
            <div style={ts.modalGrid}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={editForm.cantidad}
                  onChange={e => setEditForm(f => ({ ...f, cantidad: e.target.value }))}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Estado</label>
                <CustomSelect value={editForm.estado}
                  onChange={val => setEditForm(f => ({ ...f, estado: val }))}
                  options={window.MOCK.ESTADOS.map(e => ({ value: e.id, label: e.label }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Vence</label>
                <input
                  type="date"
                  value={editForm.fechaVencimiento}
                  onChange={e => setEditForm(f => ({ ...f, fechaVencimiento: e.target.value }))}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Plan de acción</label>
                <CustomSelect value={editForm.accion}
                  onChange={val => setEditForm(f => ({ ...f, accion: val }))}
                  options={[
                    { value: '', label: 'Sin acción' },
                    ...[...new Set([...window.MOCK.ACCIONES_VENCIDOS, ...window.MOCK.ACCIONES_DANADOS])].map(a => ({ value: a, label: a })),
                  ]} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Nota</label>
              <input
                value={editForm.nota}
                onChange={e => setEditForm(f => ({ ...f, nota: e.target.value }))}
                placeholder="Observación..."
              />
            </div>
            <div style={ts.modalFooter}>
              <button className="btn btn-secondary" onClick={closeEdit}>Cancelar</button>
              <button className="btn btn-primary" disabled={savingEdit} onClick={handleSaveEdit}>
                {savingEdit ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

window.DataTableView = DataTableView;
