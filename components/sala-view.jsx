/* ═══════════════════════════════════════════════
   SALA VIEW — Product Registration (Mobile-first)
   ═══════════════════════════════════════════════ */

const SalaView = ({ user }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [cantidad, setCantidad] = React.useState('');
  const [fechaVenc, setFechaVenc] = React.useState('');
  const [nota, setNota] = React.useState('');
  const [tipo, setTipo] = React.useState('vencido');
  const [estadoDanado, setEstadoDanado] = React.useState('');
  const [filtroEstado, setFiltroEstado] = React.useState('todos');
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [searchResults, setSearchResults] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [confirmDelete, setConfirmDelete] = React.useState(null);

  const [saving, setSaving] = React.useState(false);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const searchTimerRef = React.useRef(null);
  const sucId = user.sucursal || 'SM';
  const draftKey = React.useMemo(() => `vencidos_sala_draft_${user.id || 'anon'}_${sucId}`, [user.id, sucId]);
  const sortByArrival = React.useCallback((items) => {
    return [...items].sort((a, b) => (b.id || 0) - (a.id || 0));
  }, []);

  const [localProducts, setLocalProducts] = React.useState(
    sortByArrival(window.MOCK.MOCK_PRODUCTS.filter(p => p.sucursal === sucId))
  );

  React.useEffect(() => {
    const handler = () => {
      setLocalProducts(sortByArrival(window.MOCK.MOCK_PRODUCTS.filter(p => p.sucursal === sucId)));
    };
    window.addEventListener('vencidos_data_changed', handler);
    return () => window.removeEventListener('vencidos_data_changed', handler);
  }, [sucId, sortByArrival]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (!draft || typeof draft !== 'object') return;
      setSearchTerm(draft.searchTerm || '');
      setCantidad(draft.cantidad || '');
      setFechaVenc(draft.fechaVenc || '');
      setNota(draft.nota || '');
      setTipo(draft.tipo || 'vencido');
      setEstadoDanado(draft.estadoDanado || '');
      setShowForm(Boolean(draft.showForm));
      if (draft.selectedProduct && typeof draft.selectedProduct === 'object') {
        setSelectedProduct(draft.selectedProduct);
      }
    } catch {}
  }, [draftKey]);

  React.useEffect(() => {
    try {
      const draft = {
        searchTerm,
        cantidad,
        fechaVenc,
        nota,
        tipo,
        estadoDanado,
        showForm,
        selectedProduct,
      };
      localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch {}
  }, [draftKey, searchTerm, cantidad, fechaVenc, nota, tipo, estadoDanado, showForm, selectedProduct]);

  const filteredProducts = filtroEstado === 'todos'
    ? localProducts
    : localProducts.filter(p => p.estado === filtroEstado);

  const counts = React.useMemo(() => {
    const c = {};
    window.MOCK.ESTADOS.forEach(e => { c[e.id] = 0; });
    localProducts.forEach(p => { if (c[p.estado] !== undefined) c[p.estado]++; });
    return c;
  }, [localProducts]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setSelectedProduct(null);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (term.length < 2) { setSearchResults([]); return; }
    setSearchLoading(true);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/vencidos/api/catalog/search?q=${encodeURIComponent(term)}&sucursal=${sucId}&limit=8`);
        const data = await res.json();
        setSearchResults(data);
      } catch { setSearchResults([]); }
      setSearchLoading(false);
    }, 300);
  };

  const selectProduct = (prod) => {
    setSelectedProduct(prod);
    setSearchTerm(prod.nombre);
    setSearchResults([]);
  };

  const handleAdd = async () => {
    const editingProduct = editingId
      ? window.MOCK.MOCK_PRODUCTS.find(p => p.id === editingId)
      : null;
    if (!selectedProduct && !editingProduct) return;
    if (!cantidad || (tipo === 'vencido' && !fechaVenc)) return;
    if (tipo === 'dañado' && !estadoDanado) return;
    setSaving(true);
    try {
      const now = new Date();
      const baseProduct = selectedProduct || {
        nombre: editingProduct.nombre,
        barcode: editingProduct.codigo || '',
        proveedor: editingProduct.proveedor || '',
        categoria: editingProduct.cat1 || '',
        abc: editingProduct.abc || '',
        abcSucursal: editingProduct.abcSucursal || '',
        stock: editingProduct.stock || 0,
        sales30d: editingProduct.sales || 0,
        coverageDays: editingProduct.coverageDays || 0,
        cobertura: editingProduct.cobertura || '',
      };
      const cantidadNum = parseInt(cantidad, 10);
      const stockDisponible = Number(baseProduct.stock || 0);
      if (!Number.isFinite(cantidadNum) || cantidadNum <= 0) {
        alert('La cantidad debe ser mayor a 0');
        return;
      }
      if (cantidadNum > stockDisponible) {
        alert(`No puedes registrar más de ${stockDisponible} u (stock disponible).`);
        return;
      }
      const dias = tipo === 'vencido' ? window.MOCK.calcDiasRestantes(fechaVenc) : null;
      const estadoVenc = window.MOCK.calcEstadoVencimiento(dias);
      const provNombre = baseProduct.proveedor || window.MOCK.PROVEEDORES[0].name;
      const provCambio = window.MOCK.PROVEEDORES.find(p => p.name === provNombre)?.cambio ?? false;
      const accion = tipo === 'vencido'
        ? window.MOCK.calcAccionVencido(provNombre, provCambio, estadoVenc, !fechaVenc)
        : window.MOCK.calcAccionDanado(estadoDanado, provCambio, '');
      const payload = {
        codigo: baseProduct.barcode || '',
        nombre: baseProduct.nombre,
        proveedor: provNombre,
        proveedorCambio: provCambio,
        sucursal: sucId,
        sucursalName: window.MOCK.SUCURSALES.find(s => s.id === sucId)?.name || sucId,
        tipo,
        cantidad: cantidadNum,
        fechaVencimiento: tipo === 'vencido' ? fechaVenc : '',
        estadoDanado: tipo === 'dañado' ? estadoDanado : '',
        estado: tipo === 'vencido'
          ? window.MOCK.calcEstadoSOS(fechaVenc, provCambio)
          : (editingProduct?.estado || 'proximo_vencer'),
        accion,
        reportadoPor: user.name,
        reportadoPorId: user.id,
        fechaRegistro: editingProduct?.fechaRegistro || now.toISOString().split('T')[0],
        nota,
        cat1: (baseProduct.categoria || '').split('/').map(s => s.trim()).filter(s => s && s.toLowerCase() !== 'all products')[0] || '',
        abc: baseProduct.abc || '',
        abcSucursal: baseProduct.abcSucursal || '',
        stock: baseProduct.stock || 0,
        sales: baseProduct.sales30d || 0,
        coverageDays: baseProduct.coverageDays || 0,
        cobertura: baseProduct.cobertura || '',
      };
      if (editingProduct) {
        const updated = await window.MOCK.updateProduct(editingId, payload);
        setLocalProducts(prev => sortByArrival(prev.map(p => p.id === editingId ? updated : p)));
        window.MOCK.addAuditEntry('Editó producto', `${updated.nombre} en ${updated.sucursalName}`, user.name, user.role, user.avatar);
      } else {
        const created = await window.MOCK.addProduct(payload);
        if (created.sucursal === sucId) {
          setLocalProducts(prev => sortByArrival([created, ...prev]));
        }
        window.MOCK.addAuditEntry('Registró producto', `${created.nombre} en ${created.sucursalName}`, user.name, user.role, user.avatar);
      }
      resetForm();
    } catch (e) {
      alert((editingId ? 'Error al editar: ' : 'Error al registrar: ') + e.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setSearchTerm(''); setCantidad(''); setFechaVenc('');
    setNota(''); setSelectedProduct(null); setSearchResults([]);
    setTipo('vencido'); setEstadoDanado('');
    setShowForm(false); setEditingId(null);
    try { localStorage.removeItem(draftKey); } catch {}
  };

  const handleDelete = async (id) => {
    const target = window.MOCK.MOCK_PRODUCTS.find(p => p.id === id);
    try {
      await window.MOCK.deleteProduct(id);
      setLocalProducts(prev => prev.filter(p => p.id !== id));
      if (target) {
        window.MOCK.addAuditEntry('Eliminó producto', `${target.nombre} de ${target.sucursalName || target.sucursal}`, user.name, user.role, user.avatar);
      }
    } catch (e) {
      alert('Error al eliminar: ' + e.message);
    }
    setConfirmDelete(null);
  };

  const handleEdit = (prod) => {
    setEditingId(prod.id);
    setShowForm(true);
    setTipo(prod.tipo || 'vencido');
    setCantidad(String(prod.cantidad || 1));
    setFechaVenc(prod.fechaVencimiento || '');
    setEstadoDanado(prod.estadoDanado || '');
    setNota(prod.nota || '');
    setSearchTerm(prod.nombre || '');
    setSearchResults([]);
    setSelectedProduct({
      id: prod.id,
      nombre: prod.nombre,
      barcode: prod.codigo || '',
      proveedor: prod.proveedor || '',
      categoria: prod.cat1 || '',
      abc: prod.abc || '',
      abcSucursal: prod.abcSucursal || '',
      stock: prod.stock || 0,
      sales30d: prod.sales || 0,
      coverageDays: prod.coverageDays || 0,
      cobertura: prod.cobertura || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDaysColor = (dias) => {
    if (dias < 0) return 'var(--status-danger)';
    if (dias < 30) return 'var(--status-danger)';
    if (dias < 90) return 'var(--status-warning)';
    return 'var(--status-success)';
  };

  const s = {
    container: { padding: '24px', maxWidth: 800, margin: '0 auto', paddingBottom: 100 },
    statsRow: {
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24,
    },
    stat: (color, bgColor) => ({
      padding: '16px', borderRadius: 'var(--radius-lg)',
      background: bgColor, border: '1px solid var(--border-subtle)',
    }),
    statNum: (color) => ({
      fontSize: 28, fontWeight: 800, color, letterSpacing: '-0.03em', lineHeight: 1,
    }),
    statLabel: { fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4, fontWeight: 500 },
    addBtn: {
      width: '100%', padding: '14px', borderRadius: 'var(--radius-md)',
      fontSize: 15, fontWeight: 700, marginBottom: 20,
    },
    form: {
      background: 'var(--card-bg)', border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 20,
      animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
    },
    formTitle: {
      fontSize: 16, fontWeight: 700, marginBottom: 16,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 },
    field: { marginBottom: 12 },
    fieldLabel: {
      display: 'block', fontSize: 12, fontWeight: 600,
      color: 'var(--text-secondary)', marginBottom: 6,
    },
    searchDropdown: {
      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
      background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden', marginTop: 4,
    },
    searchItem: {
      padding: '10px 14px', cursor: 'pointer', fontSize: 13,
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'background var(--transition-fast)',
    },
    searchCode: { fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 },
    stockWarn: {
      marginTop: 6, fontSize: 11, color: 'var(--status-danger)', fontWeight: 600,
    },
    tipoTabs: {
      display: 'flex', gap: 4, padding: 3, borderRadius: 'var(--radius-md)',
      background: 'var(--bg-tertiary)', marginBottom: 12,
    },
    tipoTab: (active) => ({
      flex: 1, padding: '8px', textAlign: 'center', borderRadius: 'var(--radius-sm)',
      fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
      background: active ? 'var(--bg-secondary)' : 'transparent',
      color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
      boxShadow: active ? 'var(--shadow-xs)' : 'none',
      fontFamily: 'var(--font-body)', transition: 'all var(--transition-fast)',
    }),
    filterRow: {
      display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap',
    },
    filterChip: (active) => ({
      padding: '6px 14px', borderRadius: 'var(--radius-full)',
      fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
      background: active ? 'var(--accent)' : 'var(--bg-tertiary)',
      color: active ? 'white' : 'var(--text-secondary)',
      fontFamily: 'var(--font-body)', transition: 'all var(--transition-fast)',
    }),
    listHeader: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 12, fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 600,
    },
    productCard: {
      background: 'var(--card-bg)', border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 8,
      transition: 'all var(--transition-fast)',
      animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1) both',
    },
    prodTop: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
    },
    prodName: { fontSize: 14, fontWeight: 700, lineHeight: 1.3, flex: 1 },
    prodMeta: {
      fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4,
      display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
    },
    prodActions: {
      display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end',
    },
    daysBadge: (color) => ({
      padding: '2px 8px', borderRadius: 'var(--radius-full)',
      fontSize: 11, fontWeight: 700, color: 'white',
      background: color, whiteSpace: 'nowrap',
    }),
    qtyBadge: {
      padding: '2px 8px', borderRadius: 'var(--radius-full)',
      fontSize: 11, fontWeight: 600, background: 'var(--bg-tertiary)',
      color: 'var(--text-secondary)',
    },
    deleteOverlay: {
      position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    },
    deleteModal: {
      background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
      padding: 24, maxWidth: 340, width: '100%', textAlign: 'center',
      boxShadow: 'var(--shadow-xl)',
    },
  };

  return (
    <div style={s.container}>
      {/* Stats */}
      <div style={{...s.statsRow, gridTemplateColumns: 'repeat(3, 1fr)'}} className="stagger">
        {window.MOCK.ESTADOS.map(e => (
          <div key={e.id} style={{
            background: e.color + '18', border: `1px solid ${e.color}44`,
            borderRadius: 'var(--radius-lg)', padding: '10px 12px', textAlign: 'center',
          }}>
            <div style={{fontSize: 22, fontWeight: 700, color: e.color, lineHeight: 1}}>{counts[e.id] || 0}</div>
            <div style={{fontSize: 10, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.2}}>{e.label}</div>
          </div>
        ))}
      </div>

      {/* Add button or form */}
      {!showForm ? (
        <button className="btn btn-primary" style={s.addBtn} onClick={() => setShowForm(true)}>
          ＋ Registrar producto
        </button>
      ) : (
        <div style={s.form}>
          <div style={s.formTitle}>
            <span>{editingId ? 'Editar registro' : 'Nuevo registro'}</span>
            <button className="btn btn-ghost btn-sm" onClick={resetForm}>✕</button>
          </div>

          <div style={s.tipoTabs}>
            <button style={s.tipoTab(tipo === 'vencido')} onClick={() => setTipo('vencido')}>Vencido</button>
            <button style={s.tipoTab(tipo === 'dañado')} onClick={() => setTipo('dañado')}>Dañado</button>
          </div>

          <div style={{...s.field, position: 'relative'}}>
            <label style={s.fieldLabel}>
              Producto
              {searchLoading && <span style={{marginLeft: 8, fontSize: 11, color: 'var(--text-tertiary)'}}>Buscando...</span>}
            </label>
            <input placeholder="Buscar por nombre o código de barras..."
              value={searchTerm} onChange={e => handleSearch(e.target.value)}
              style={selectedProduct ? {borderColor: 'var(--status-success)'} : {}} />
            {searchResults.length > 0 && (
              <div style={s.searchDropdown}>
                {searchResults.map(r => (
                  <div key={r.id} style={s.searchItem}
                    onClick={() => selectProduct(r)}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{fontWeight: 600}}>{r.nombre}</div>
                    <div style={s.searchCode}>
                      {r.barcode && <span style={{marginRight: 8}}>{r.barcode}</span>}
                      {r.proveedor && <span style={{marginRight: 8}}>{r.proveedor}</span>}
                      {r.stock > 0 && <span style={{color: 'var(--status-success)'}}>Stock: {r.stock} u</span>}
                      {r.stock === 0 && <span style={{color: 'var(--status-danger)'}}>Sin stock</span>}
                      {r.fallback && (
                        <span style={{
                          marginLeft: 8, padding: '1px 6px', borderRadius: 'var(--radius-full)',
                          background: 'var(--status-warning-bg)', color: 'var(--status-warning)',
                          fontSize: 10, fontWeight: 700,
                        }} title="Sin datos para esta sucursal — se muestran totales generales">
                          DATOS GENERALES
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedProduct && (
              <React.Fragment>
                <div style={{
                  marginTop: 8, padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  background: selectedProduct.fallback ? 'var(--status-warning-bg)' : 'var(--accent-subtle)',
                  border: `1px solid ${selectedProduct.fallback ? 'var(--status-warning)' : 'var(--accent)'}`,
                  fontSize: 12, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center',
                }}>
                  <span><b>Stock:</b> {selectedProduct.stock} u</span>
                  <span><b>Cobertura:</b> {selectedProduct.coverageDays > 0 ? `${selectedProduct.coverageDays} días` : 'S/D'}</span>
                  <span><b>Ventas 30d:</b> {selectedProduct.sales30d} u</span>
                  {selectedProduct.abc && <span><b>ABC:</b> {selectedProduct.abcSucursal || selectedProduct.abc}</span>}
                  {selectedProduct.proveedor && <span style={{color: 'var(--text-secondary)'}}>{selectedProduct.proveedor}</span>}
                  {selectedProduct.fallback && (
                    <span style={{
                      marginLeft: 'auto', padding: '2px 8px', borderRadius: 'var(--radius-full)',
                      background: 'var(--status-warning)', color: '#000',
                      fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
                    }}>
                      DATOS GENERALES
                    </span>
                  )}
                </div>
                {selectedProduct.fallback && (
                  <div style={{
                    marginTop: 4, fontSize: 11, color: 'var(--status-warning)',
                    fontStyle: 'italic',
                  }}>
                    ⚠ Sin datos específicos para tu sucursal — se muestran totales generales.
                  </div>
                )}
              </React.Fragment>
            )}
          </div>

          <div style={s.fieldRow}>
            <div>
              <label style={s.fieldLabel}>Cantidad</label>
              <input type="number" placeholder="0" min="1"
                max={selectedProduct?.stock ?? ''}
                value={cantidad} onChange={e => setCantidad(e.target.value)} />
              {selectedProduct && Number(cantidad || 0) > Number(selectedProduct.stock || 0) && (
                <div style={s.stockWarn}>No puede exceder el stock ({selectedProduct.stock} u).</div>
              )}
            </div>
            <div>
              <label style={s.fieldLabel}>{tipo === 'vencido' ? 'Fecha vencimiento' : 'Fecha detección'}</label>
              <input type="date" value={fechaVenc} onChange={e => setFechaVenc(e.target.value)} />
            </div>
          </div>

          {tipo === 'dañado' && (
            <div style={s.field}>
              <label style={s.fieldLabel}>Estado del daño</label>
              <CustomSelect value={estadoDanado} onChange={setEstadoDanado}
                placeholder="Seleccionar..."
                options={[
                  { value: '', label: 'Seleccionar...' },
                  { value: 'USO PARA TESTER', label: 'USO PARA TESTER' },
                  { value: 'DESECHO/INSERVIBLE', label: 'DESECHO/INSERVIBLE' },
                  { value: 'VERDE', label: 'VERDE' },
                  { value: 'VENTA INTERNA', label: 'VENTA INTERNA' },
                  { value: 'TRASPASO', label: 'TRASPASO' },
                ]} />
            </div>
          )}

          <div style={s.field}>
            <label style={s.fieldLabel}>Nota (opcional)</label>
            <input placeholder="Observación adicional..." value={nota} onChange={e => setNota(e.target.value)} />
          </div>

          <button className="btn btn-primary" style={{width:'100%', padding: '12px'}}
            onClick={handleAdd} disabled={saving}>
            {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Agregar registro'}
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={s.filterRow}>
        {[
          { id: 'todos', label: 'Todos' },
          ...window.MOCK.ESTADOS.map(e => ({ id: e.id, label: `${e.label} (${counts[e.id] || 0})` })),
        ].map(f => (
          <button key={f.id} style={s.filterChip(filtroEstado === f.id)}
            onClick={() => setFiltroEstado(f.id)}>{f.label}</button>
        ))}
      </div>

      {/* List header */}
      <div style={s.listHeader}>
        <span>{user.sucursal} — {filteredProducts.length} registros</span>
      </div>

      {/* Product list */}
      {filteredProducts.map((p, i) => (
        <div key={p.id} style={{...s.productCard, animationDelay: `${Math.min(i * 30, 300)}ms`}}>
          <div style={s.prodTop}>
            <div style={{flex: 1}}>
              <div style={s.prodName}>{p.nombre}</div>
              <div style={s.prodMeta}>
                <span>{p.reportadoPor || user.name}</span>
                <span>·</span>
                <span>{p.sucursalName || user.sucursal}</span>
                {p.tipo === 'dañado' && (
                  <React.Fragment><span>·</span><span style={{color: 'var(--status-danger)'}}>Dañado</span></React.Fragment>
                )}
              </div>
              <div style={{marginTop: 6, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap'}}>
                {(() => {
                  const e = window.MOCK.ESTADOS.find(x => x.id === p.estado);
                  return e ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
                      borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 600,
                      background: e.color + '22', color: e.color, border: `1px solid ${e.color}55`,
                    }}>{e.label}</span>
                  ) : null;
                })()}
                {p.accion && (
                  <span style={{fontSize: 11, color: 'var(--text-tertiary)'}}>{p.accion}</span>
                )}
              </div>
            </div>
            <div style={{display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0}}>
              <span style={s.daysBadge(getDaysColor(p.diasRestantes))}>
                {p.diasRestantes !== undefined ? `${p.diasRestantes}d` : '—'}
              </span>
              <span style={s.qtyBadge}>{p.cantidad} u</span>
            </div>
          </div>
          <div style={s.prodActions}>
            <button className="btn btn-ghost btn-sm" style={{fontSize: 12}}
              onClick={() => handleEdit(p)}>Editar</button>
            <button className="btn btn-ghost btn-sm" style={{fontSize: 12, color: 'var(--status-danger)'}}
              onClick={() => setConfirmDelete(p.id)}>Eliminar</button>
          </div>
        </div>
      ))}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div style={s.deleteOverlay} onClick={() => setConfirmDelete(null)}>
          <div style={s.deleteModal} onClick={e => e.stopPropagation()}>
            <div style={{fontSize: 18, fontWeight: 700, marginBottom: 8}}>¿Eliminar registro?</div>
            <div style={{fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20}}>
              Esta acción no se puede deshacer.
            </div>
            <div style={{display: 'flex', gap: 10, justifyContent: 'center'}}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn" style={{background: 'var(--status-danger)', color: 'white'}}
                onClick={() => handleDelete(confirmDelete)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SalaHistorialView = ({ user }) => {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const handler = () => setTick(t => t + 1);
    window.addEventListener('vencidos_data_changed', handler);
    return () => window.removeEventListener('vencidos_data_changed', handler);
  }, []);

  const fullLog = window.MOCK.AUDIT_LOG;
  const myLogs = fullLog.filter(entry => {
    const mySucursalId = user.sucursal || 'SM';
    const mySucursalObj = window.MOCK.SUCURSALES.find(s => s.id === mySucursalId);
    const mySucursalName = mySucursalObj ? mySucursalObj.name : '';

    // 1. Check if the user who did the action belongs to the same sucursal
    const entryUserObj = window.MOCK.USERS.find(u => u.name === entry.user);
    if (entryUserObj && entryUserObj.sucursal === mySucursalId) {
      return true;
    }

    // 2. Check if the log detail or action mentions our sucursal name or code
    const detailLower = entry.detail.toLowerCase();
    const actionLower = entry.action.toLowerCase();
    const hasMySucName = mySucursalName && (detailLower.includes(mySucursalName.toLowerCase()) || actionLower.includes(mySucursalName.toLowerCase()));
    const hasMySucCode = detailLower.includes(` en ${mySucursalId.toLowerCase()}`) || detailLower.includes(` - ${mySucursalId.toLowerCase()}`);

    return hasMySucName || hasMySucCode;
  });

  const [searchTerm, setSearchTerm] = React.useState('');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');

  const filteredLogs = myLogs.filter(entry => {
    // 1. Text filter
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      const matchesText = 
        entry.action.toLowerCase().includes(s) || 
        entry.detail.toLowerCase().includes(s) || 
        entry.user.toLowerCase().includes(s);
      if (!matchesText) return false;
    }

    // 2. Date Range filter
    const entryDate = new Date(entry.timestamp);

    if (dateFrom) {
      const fromLimit = new Date(dateFrom + 'T00:00:00');
      if (entryDate < fromLimit) return false;
    }

    if (dateTo) {
      const toLimit = new Date(dateTo + 'T23:59:59');
      if (entryDate > toLimit) return false;
    }

    return true;
  });

  const hs = {
    container: {
      padding: '24px 20px', maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20
    },
    header: {
      display: 'flex', flexDirection: 'column', gap: 4
    },
    title: { fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' },
    subtitle: { fontSize: 13, color: 'var(--text-tertiary)' },
    filterPanel: {
      background: 'var(--card-bg)', border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex',
      flexDirection: 'column', gap: 14, boxShadow: 'var(--shadow-sm)'
    },
    searchField: {
      display: 'flex', flexDirection: 'column', gap: 4
    },
    dateFields: {
      display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap'
    },
    dateCol: {
      flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: 4
    },
    filterLabel: {
      fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'
    },
    clearBtn: {
      color: 'var(--status-danger)', border: '1px solid var(--border-subtle)', height: 38, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    logList: {
      display: 'flex', flexDirection: 'column', gap: 12
    },
    logCard: {
      background: 'var(--card-bg)', border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex',
      flexDirection: 'column', gap: 8, transition: 'all var(--transition-fast)'
    },
    cardHeader: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    actionBadge: (action) => {
      const isDelete = action.includes('Eliminó') || action.includes('Desactivó');
      const isCreate = action.includes('Registró') || action.includes('Creó');
      return {
        fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--radius-sm)',
        background: isDelete ? 'rgba(239, 68, 68, 0.15)' : isCreate ? 'rgba(99, 102, 241, 0.15)' : 'rgba(59, 130, 246, 0.15)',
        color: isDelete ? '#ef4444' : isCreate ? 'var(--accent)' : '#3b82f6'
      };
    },
    dateText: { fontSize: 11, color: 'var(--text-tertiary)' },
    detailText: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 },
    emptyState: {
      padding: '40px 20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14,
      background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1.5px dashed var(--border-color)'
    }
  };

  return (
    <div style={hs.container}>
      <div style={hs.header}>
        <h2 style={hs.title}>Historial de Actividades</h2>
        <p style={hs.subtitle}>Consulta la bitácora de tus acciones y registros en esta sucursal</p>
      </div>

      <div style={hs.filterPanel}>
        <div style={hs.searchField}>
          <label style={hs.filterLabel}>Buscar por texto</label>
          <input
            type="text"
            placeholder="Buscar por producto, acción o usuario..."
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={hs.dateFields}>
          <div style={hs.dateCol}>
            <label style={hs.filterLabel}>Fecha desde</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              style={{ width: '100%', height: 38 }}
            />
          </div>
          <div style={hs.dateCol}>
            <label style={hs.filterLabel}>Fecha hasta</label>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              style={{ width: '100%', height: 38 }}
            />
          </div>
          {(searchTerm || dateFrom || dateTo) && (
            <button className="btn btn-ghost btn-sm" style={hs.clearBtn}
              onClick={() => { setSearchTerm(''); setDateFrom(''); setDateTo(''); }}>
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div style={hs.logList}>
        {filteredLogs.length > 0 ? (
          filteredLogs.map(entry => (
            <div key={entry.id} style={hs.logCard} className="log-card-item">
              <div style={hs.cardHeader}>
                <span style={hs.actionBadge(entry.action)}>{entry.action}</span>
                <span style={hs.dateText}>{entry.date} · {entry.time}</span>
              </div>
              <div style={hs.detailText}>{entry.detail}</div>
            </div>
          ))
        ) : (
          <div style={hs.emptyState}>
            No se encontraron registros de actividad
          </div>
        )}
      </div>
    </div>
  );
};

window.SalaView = SalaView;
window.SalaHistorialView = SalaHistorialView;
