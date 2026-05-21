"""
Vencidos — FastAPI Backend
Runs on port 5176, proxied via nginx /api/ → localhost:5176
All routes under /api/ prefix (nginx passes full path).
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel
from typing import Optional, Any
import sqlite3, os
from datetime import date, datetime

# ── App ───────────────────────────────────────────
app = FastAPI(title="Vencidos API")

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(__file__), "vencidos.db")

# ── DB helpers ────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def calc_dias(fecha_vencimiento: str) -> Optional[int]:
    if not fecha_vencimiento:
        return None
    try:
        return (date.fromisoformat(fecha_vencimiento) - date.today()).days
    except Exception:
        return None

def calc_estado_venc(dias: Optional[int]) -> str:
    if dias is None:
        return ""
    if dias < -30: return "Ya vencido"
    if dias < 0:   return "Vencido"
    if dias < 90:  return "Vence en menos de 3 meses"
    if dias < 180: return "Vence en más de 3 meses"
    return "Próximo a vencer"

OLD_ESTADOS = {'pendiente', 'en_proceso', 'resuelto'}

def derive_estado(fecha_vencimiento: str, proveedor_cambio: bool) -> str:
    if not fecha_vencimiento:
        return 'proximo_vencer'
    dias = calc_dias(fecha_vencimiento)
    if dias is None:
        return 'proximo_vencer'
    if dias < 0:
        return 'devoluciones' if proveedor_cambio else 'ya_vencido'
    if dias < 90:
        return 'vence_menos_3m'
    if dias < 180:
        return 'vence_mas_3m'
    return 'proximo_vencer'

def prod_to_dict(row) -> dict:
    d = dict(row)
    dias = calc_dias(d.get("fecha_vencimiento"))
    return {
        "id": d["id"],
        "codigo": d.get("codigo") or "",
        "nombre": d.get("nombre") or "",
        "tipo": d.get("tipo") or "vencido",
        "cantidad": d.get("cantidad") or 1,
        "estado": d.get("estado") or "proximo_vencer",
        "fechaVencimiento": d.get("fecha_vencimiento") or "",
        "diasRestantes": dias,
        "estadoVencimiento": calc_estado_venc(dias),
        "estadoDanado": d.get("estado_danado") or "",
        "fechaRegistro": d.get("fecha_registro") or "",
        "cat1": d.get("cat1") or "",
        "cat2": d.get("cat2") or "",
        "cat3": d.get("cat3") or "",
        "abc": d.get("abc") or "",
        "abcSucursal": d.get("abc_sucursal") or "",
        "etiqueta": d.get("etiqueta") or "",
        "origen": d.get("origen") or "",
        "sucursal": d.get("sucursal") or "",
        "sucursalName": d.get("sucursal_name") or "",
        "reportadoPor": d.get("reportado_por") or "",
        "reportadoPorId": d.get("reportado_por_id"),
        "proveedor": d.get("proveedor") or "",
        "proveedorCambio": bool(d.get("proveedor_cambio") or 0),
        "accion": d.get("accion") or "",
        "stock": d.get("stock") or 0,
        "sales": d.get("sales") or 0,
        "coverageDays": d.get("coverage_days") or 0,
        "cobertura": d.get("cobertura") or "",
        "nota": d.get("nota") or "",
    }

def user_to_dict(row, include_password=False) -> dict:
    d = dict(row)
    result = {
        "id": d["id"],
        "name": d["name"],
        "username": d.get("username") or "",
        "role": d["role"],
        "sucursal": d.get("sucursal"),
        "avatar": d.get("avatar") or "",
        "active": bool(d.get("active", 1)),
    }
    if include_password:
        result["password"] = d.get("password") or "123456"
    return result

def audit_to_dict(row) -> dict:
    d = dict(row)
    ts = d.get("timestamp") or ""
    try:
        dt = datetime.fromisoformat(ts)
        date_str = dt.strftime("%d %b %Y")
        time_str = dt.strftime("%H:%M")
    except Exception:
        date_str = ts[:10] if ts else ""
        time_str = ts[11:16] if len(ts) > 16 else ""
    return {
        "id": d["id"],
        "user": d.get("user_name") or "",
        "role": d.get("user_role") or "",
        "avatar": d.get("user_avatar") or "",
        "action": d.get("action") or "",
        "detail": d.get("detail") or "",
        "timestamp": ts,
        "date": date_str,
        "time": time_str,
    }

# ── Schema ────────────────────────────────────────
def init_db():
    with get_db() as conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT,
            nombre TEXT NOT NULL,
            tipo TEXT NOT NULL DEFAULT 'vencido',
            cantidad INTEGER DEFAULT 1,
            estado TEXT DEFAULT 'pendiente',
            fecha_vencimiento TEXT,
            estado_danado TEXT,
            fecha_registro TEXT,
            cat1 TEXT, cat2 TEXT, cat3 TEXT,
            abc TEXT, abc_sucursal TEXT,
            etiqueta TEXT, origen TEXT,
            sucursal TEXT, sucursal_name TEXT,
            reportado_por TEXT, reportado_por_id INTEGER,
            proveedor TEXT, proveedor_cambio INTEGER DEFAULT 0,
            accion TEXT,
            stock INTEGER DEFAULT 0,
            sales INTEGER DEFAULT 0,
            coverage_days INTEGER DEFAULT 0,
            cobertura TEXT,
            nota TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT UNIQUE,
            email TEXT,
            password TEXT DEFAULT '123456',
            role TEXT NOT NULL,
            sucursal TEXT,
            avatar TEXT,
            active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name TEXT NOT NULL,
            user_role TEXT,
            user_avatar TEXT,
            action TEXT NOT NULL,
            detail TEXT,
            timestamp TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            time_text TEXT,
            is_read INTEGER DEFAULT 0,
            type TEXT DEFAULT 'info',
            event TEXT DEFAULT 'general',
            product_id INTEGER,
            target_sucursal TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        );
        """)

        # Lightweight migration for older DBs
        notif_cols = {r[1] for r in conn.execute("PRAGMA table_info(notifications)").fetchall()}
        if "event" not in notif_cols:
            conn.execute("ALTER TABLE notifications ADD COLUMN event TEXT DEFAULT 'general'")
        if "product_id" not in notif_cols:
            conn.execute("ALTER TABLE notifications ADD COLUMN product_id INTEGER")
        if "target_sucursal" not in notif_cols:
            conn.execute("ALTER TABLE notifications ADD COLUMN target_sucursal TEXT")

        user_cols = {r[1] for r in conn.execute("PRAGMA table_info(users)").fetchall()}
        if "username" not in user_cols:
            conn.execute("ALTER TABLE users ADD COLUMN username TEXT")
            conn.execute(
                "UPDATE users SET username = LOWER(SUBSTR(name, 1, INSTR(name||' ',' ')-1)) WHERE username IS NULL"
            )

        # Seed users if empty
        count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
        if count == 0:
            seed_users = [
                (1,  'Pedro Copa',        'pedro',     '123456', 'admin',      None, 'PC', 1),
                (2,  'Fabiola Venegas',   'fabiola',   '123456', 'sala',       'SM', 'FV', 1),
                (3,  'María López',       'maria',     '123456', 'sala',       'AM', 'ML', 1),
                (4,  'Carla Rojas',       'carla',     '123456', 'sala',       'AM', 'CR', 1),
                (5,  'Lucía Fernández',   'lucia',     '123456', 'sala',       'PR', 'LF', 1),
                (6,  'Rosa Mamani',       'rosa',      '123456', 'sala',       'SH', 'RM', 1),
                (7,  'Andrea Quispe',     'andrea',    '123456', 'sala',       'MC', 'AQ', 1),
                (8,  'Patricia Flores',   'patricia',  '123456', 'sala',       'EQ', 'PF', 1),
                (9,  'Sandra Torrez',     'sandra',    '123456', 'sala',       'CB', 'ST', 1),
                (10, 'Jorge Álvarez',     'jorge',     '123456', 'supervisor', None, 'JA', 1),
                (11, 'Ana Gutiérrez',     'ana',       '123456', 'supervisor', None, 'AG', 1),
                (12, 'Carlos Mendoza',    'carlos',    '123456', 'admin',      None, 'CM', 1),
                (13, 'Gabriela Vargas',   'gabriela',  '123456', 'sala',       'VL', 'GV', 1),
                (14, 'Daniela Solís',     'daniela',   '123456', 'sala',       'BN', 'DS', 0),
            ]
            conn.executemany(
                "INSERT INTO users (id, name, username, password, role, sucursal, avatar, active) VALUES (?,?,?,?,?,?,?,?)",
                seed_users
            )

        # ── SOS v1 migration: wipe old-estado products ──
        old_count = conn.execute(
            "SELECT COUNT(*) FROM products WHERE estado IN ('pendiente','en_proceso','resuelto')"
        ).fetchone()[0]
        if old_count > 0:
            conn.execute("DELETE FROM notifications WHERE product_id IN (SELECT id FROM products WHERE estado IN ('pendiente','en_proceso','resuelto'))")
            conn.execute("DELETE FROM products WHERE estado IN ('pendiente','en_proceso','resuelto')")

        conn.commit()

def _clean_cat_path(val: str) -> str:
    parts = [s.strip() for s in val.split('/')]
    parts = [p for p in parts if p and p.lower() != 'all products']
    return parts[0] if parts else val

def migrate_cat1():
    with get_db() as conn:
        rows = conn.execute("SELECT id, cat1 FROM products WHERE cat1 LIKE '%/%'").fetchall()
        for row in rows:
            cleaned = _clean_cat_path(row['cat1'])
            conn.execute("UPDATE products SET cat1=? WHERE id=?", (cleaned, row['id']))
        conn.commit()

init_db()
migrate_cat1()

# ── Pydantic models ───────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str

class ProductCreate(BaseModel):
    codigo: Optional[str] = ""
    nombre: str
    tipo: str = "vencido"
    cantidad: int = 1
    estado: str = ""
    fechaVencimiento: Optional[str] = ""
    estadoDanado: Optional[str] = ""
    fechaRegistro: Optional[str] = ""
    cat1: Optional[str] = ""
    cat2: Optional[str] = ""
    cat3: Optional[str] = ""
    abc: Optional[str] = ""
    abcSucursal: Optional[str] = ""
    etiqueta: Optional[str] = ""
    origen: Optional[str] = ""
    sucursal: Optional[str] = ""
    sucursalName: Optional[str] = ""
    reportadoPor: Optional[str] = ""
    reportadoPorId: Optional[int] = None
    proveedor: Optional[str] = ""
    proveedorCambio: Optional[bool] = False
    accion: Optional[str] = ""
    stock: Optional[int] = 0
    sales: Optional[int] = 0
    coverageDays: Optional[int] = 0
    cobertura: Optional[str] = ""
    nota: Optional[str] = ""

class ProductUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    tipo: Optional[str] = None
    cantidad: Optional[int] = None
    estado: Optional[str] = None
    fechaVencimiento: Optional[str] = None
    estadoDanado: Optional[str] = None
    fechaRegistro: Optional[str] = None
    cat1: Optional[str] = None
    cat2: Optional[str] = None
    cat3: Optional[str] = None
    abc: Optional[str] = None
    abcSucursal: Optional[str] = None
    etiqueta: Optional[str] = None
    origen: Optional[str] = None
    sucursal: Optional[str] = None
    sucursalName: Optional[str] = None
    reportadoPor: Optional[str] = None
    reportadoPorId: Optional[int] = None
    proveedor: Optional[str] = None
    proveedorCambio: Optional[bool] = None
    accion: Optional[str] = None
    stock: Optional[int] = None
    sales: Optional[int] = None
    coverageDays: Optional[int] = None
    cobertura: Optional[str] = None
    nota: Optional[str] = None

class UserCreate(BaseModel):
    name: str
    username: str
    role: str
    sucursal: Optional[str] = None
    active: Optional[bool] = True
    password: Optional[str] = "123456"
    avatar: Optional[str] = ""

class UserUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    role: Optional[str] = None
    sucursal: Optional[str] = None
    active: Optional[bool] = None
    password: Optional[str] = None
    avatar: Optional[str] = None

class AuditCreate(BaseModel):
    action: str
    detail: Optional[str] = ""
    userName: str
    userRole: Optional[str] = ""
    avatar: Optional[str] = ""

class NotifUpdate(BaseModel):
    is_read: bool

# ── Auth ──────────────────────────────────────────
@app.post("/api/auth/login")
def login(req: LoginRequest):
    with get_db() as conn:
        user = conn.execute(
            "SELECT * FROM users WHERE LOWER(username)=LOWER(?) AND active=1",
            (req.username.strip(),)
        ).fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado o inactivo")
    expected = dict(user).get("password") or ""
    if req.password != expected:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    return user_to_dict(user, include_password=True)

# ── Products ──────────────────────────────────────
@app.get("/api/products")
def list_products():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM products ORDER BY id DESC").fetchall()
    return [prod_to_dict(r) for r in rows]

@app.post("/api/products", status_code=201)
def create_product(p: ProductCreate):
    today = date.today().isoformat()
    auto_estado = derive_estado(p.fechaVencimiento or '', bool(p.proveedorCambio))
    estado = auto_estado if (not p.estado or p.estado in OLD_ESTADOS) else p.estado
    with get_db() as conn:
        cur = conn.execute("""
            INSERT INTO products
            (codigo, nombre, tipo, cantidad, estado, fecha_vencimiento, estado_danado,
             fecha_registro, cat1, cat2, cat3, abc, abc_sucursal, etiqueta, origen,
             sucursal, sucursal_name, reportado_por, reportado_por_id,
             proveedor, proveedor_cambio, accion, stock, sales, coverage_days, cobertura, nota)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, (
            p.codigo, p.nombre, p.tipo, p.cantidad, estado,
            p.fechaVencimiento, p.estadoDanado,
            p.fechaRegistro or today,
            p.cat1, p.cat2, p.cat3, p.abc, p.abcSucursal, p.etiqueta, p.origen,
            p.sucursal, p.sucursalName, p.reportadoPor, p.reportadoPorId,
            p.proveedor, int(p.proveedorCambio or False), p.accion,
            p.stock, p.sales, p.coverageDays, p.cobertura, p.nota,
        ))
        new_id = cur.lastrowid
        row = conn.execute("SELECT * FROM products WHERE id=?", (new_id,)).fetchone()
        sucursal_label = p.sucursalName or p.sucursal or ''
        reporter = p.reportadoPor or 'Personal de sala'
        conn.execute("""
            INSERT INTO notifications (text, time_text, is_read, type, event, product_id, target_sucursal)
            VALUES (?, ?, 0, 'warning', 'new_product', ?, ?)
        """, (
            f"Nuevo registro: {p.nombre} ({p.cantidad} u.) en {sucursal_label} — por {reporter}",
            "Ahora",
            new_id,
            p.sucursal or '',
        ))
        conn.commit()
    return prod_to_dict(row)

@app.put("/api/products/{product_id}")
def update_product(product_id: int, p: ProductUpdate):
    with get_db() as conn:
        row = conn.execute("SELECT * FROM products WHERE id=?", (product_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        old_data = dict(row)
        updates = {k: v for k, v in p.model_dump().items() if v is not None}
        if not updates:
            return prod_to_dict(row)
        field_map = {
            "codigo": "codigo", "nombre": "nombre", "tipo": "tipo",
            "cantidad": "cantidad", "estado": "estado",
            "fechaVencimiento": "fecha_vencimiento", "estadoDanado": "estado_danado",
            "fechaRegistro": "fecha_registro",
            "cat1": "cat1", "cat2": "cat2", "cat3": "cat3",
            "abc": "abc", "abcSucursal": "abc_sucursal", "etiqueta": "etiqueta",
            "origen": "origen", "sucursal": "sucursal", "sucursalName": "sucursal_name",
            "reportadoPor": "reportado_por", "reportadoPorId": "reportado_por_id",
            "proveedor": "proveedor", "proveedorCambio": "proveedor_cambio",
            "accion": "accion", "stock": "stock", "sales": "sales",
            "coverageDays": "coverage_days", "cobertura": "cobertura", "nota": "nota",
        }
        set_clauses = []
        values = []
        for camel, val in updates.items():
            if camel in field_map:
                col = field_map[camel]
                set_clauses.append(f"{col}=?")
                values.append(int(val) if camel == "proveedorCambio" else val)
        if set_clauses:
            values.append(product_id)
            conn.execute(f"UPDATE products SET {', '.join(set_clauses)} WHERE id=?", values)
            conn.commit()
        row = conn.execute("SELECT * FROM products WHERE id=?", (product_id,)).fetchone()
        new_data = dict(row)
        old_estado = old_data.get("estado") or ""
        new_estado = new_data.get("estado") or ""
        if old_estado != new_estado:
            estado_label = {
                "proximo_vencer": "Próximo a vencer",
                "vence_mas_3m":   "Vence en más de 3 meses",
                "venta_impulso":  "Venta Impulso",
                "vence_menos_3m": "Vence en menos de 3 meses",
                "devoluciones":   "Devoluciones",
                "ya_vencido":     "Ya vencido",
            }
            status_type = "info"
            if new_estado in ("devoluciones", "ya_vencido"):
                status_type = "danger"
            elif new_estado in ("vence_menos_3m", "venta_impulso"):
                status_type = "warning"
            conn.execute("""
                INSERT INTO notifications (text, time_text, is_read, type, event, product_id, target_sucursal)
                VALUES (?, ?, 0, ?, 'status_change', ?, ?)
            """, (
                f"Cambio de estado: {new_data.get('nombre') or 'Producto'} → {estado_label.get(new_estado, new_estado)}",
                "Ahora",
                status_type,
                product_id,
                new_data.get("sucursal") or old_data.get("sucursal") or "",
            ))
            conn.commit()
    return prod_to_dict(row)

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int):
    with get_db() as conn:
        conn.execute("DELETE FROM products WHERE id=?", (product_id,))
        conn.commit()
    return {"ok": True}

# ── Users ─────────────────────────────────────────
@app.get("/api/users")
def list_users():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM users ORDER BY id").fetchall()
    return [user_to_dict(r, include_password=True) for r in rows]

@app.post("/api/users", status_code=201)
def create_user(u: UserCreate):
    avatar = u.avatar or "".join(w[0].upper() for w in u.name.split() if w)[:2]
    with get_db() as conn:
        try:
            cur = conn.execute(
                "INSERT INTO users (name, username, password, role, sucursal, avatar, active) VALUES (?,?,?,?,?,?,?)",
                (u.name, u.username, u.password or "123456", u.role,
                 u.sucursal if u.role == "sala" else None, avatar, int(u.active or True))
            )
            new_id = cur.lastrowid
            row = conn.execute("SELECT * FROM users WHERE id=?", (new_id,)).fetchone()
            conn.commit()
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
    return user_to_dict(row, include_password=True)

@app.put("/api/users/{user_id}")
def update_user(user_id: int, u: UserUpdate):
    with get_db() as conn:
        row = conn.execute("SELECT * FROM users WHERE id=?", (user_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        updates = {k: v for k, v in u.model_dump().items() if v is not None}
        if updates:
            field_map = {
                "name": "name", "username": "username", "password": "password",
                "role": "role", "sucursal": "sucursal", "avatar": "avatar", "active": "active",
            }
            set_clauses, values = [], []
            for k, v in updates.items():
                if k in field_map:
                    set_clauses.append(f"{field_map[k]}=?")
                    values.append(int(v) if k == "active" else v)
            if set_clauses:
                values.append(user_id)
                conn.execute(f"UPDATE users SET {', '.join(set_clauses)} WHERE id=?", values)
                conn.commit()
        row = conn.execute("SELECT * FROM users WHERE id=?", (user_id,)).fetchone()
    return user_to_dict(row, include_password=True)

@app.delete("/api/users/{user_id}")
def delete_user(user_id: int):
    with get_db() as conn:
        conn.execute("DELETE FROM users WHERE id=?", (user_id,))
        conn.commit()
    return {"ok": True}

# ── Audit ─────────────────────────────────────────
@app.get("/api/audit")
def list_audit():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 500"
        ).fetchall()
    return [audit_to_dict(r) for r in rows]

@app.post("/api/audit", status_code=201)
def create_audit(entry: AuditCreate):
    ts = datetime.now().isoformat()
    with get_db() as conn:
        cur = conn.execute(
            "INSERT INTO audit_log (user_name, user_role, user_avatar, action, detail, timestamp) VALUES (?,?,?,?,?,?)",
            (entry.userName, entry.userRole, entry.avatar, entry.action, entry.detail, ts)
        )
        new_id = cur.lastrowid
        row = conn.execute("SELECT * FROM audit_log WHERE id=?", (new_id,)).fetchone()
        conn.commit()
    return audit_to_dict(row)

# ── Notifications ─────────────────────────────────
@app.get("/api/notifications")
def list_notifications():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM notifications ORDER BY id DESC").fetchall()
    result = []
    for r in rows:
        d = dict(r)
        result.append({
            "id": d["id"],
            "text": d["text"],
            "time": d.get("time_text") or "",
            "read": bool(d.get("is_read", 0)),
            "type": d.get("type") or "info",
            "event": d.get("event") or "general",
            "productId": d.get("product_id"),
            "targetSucursal": d.get("target_sucursal") or "",
        })
    return result

@app.put("/api/notifications/read-all")
def mark_all_read():
    with get_db() as conn:
        conn.execute("UPDATE notifications SET is_read=1")
        conn.commit()
    return {"ok": True}

@app.put("/api/notifications/{notif_id}/read")
def mark_read(notif_id: int):
    with get_db() as conn:
        conn.execute("UPDATE notifications SET is_read=1 WHERE id=?", (notif_id,))
        conn.commit()

@app.delete("/api/notifications/{notif_id}")
def delete_notification(notif_id: int):
    with get_db() as conn:
        conn.execute("DELETE FROM notifications WHERE id=?", (notif_id,))
        conn.commit()
    return {"ok": True}

@app.delete("/api/notifications")
def delete_all_notifications():
    with get_db() as conn:
        conn.execute("DELETE FROM notifications")
        conn.commit()
    return {"ok": True}
    return {"ok": True}

# ── Monthly data (computed from products) ─────────
@app.get("/api/monthly")
def get_monthly():
    with get_db() as conn:
        rows = conn.execute("""
            SELECT
                substr(fecha_registro, 1, 7) as month,
                estado,
                COUNT(*) as cnt
            FROM products
            WHERE fecha_registro IS NOT NULL AND fecha_registro != ''
            GROUP BY month, estado
            ORDER BY month
        """).fetchall()

    sos_estados = ["proximo_vencer", "vence_mas_3m", "venta_impulso", "vence_menos_3m", "devoluciones", "ya_vencido"]
    monthly_map: dict[str, dict] = {}
    for r in rows:
        m = r["month"]
        if m not in monthly_map:
            monthly_map[m] = {e: 0 for e in sos_estados}
        if r["estado"] in sos_estados:
            monthly_map[m][r["estado"]] = r["cnt"]

    result = []
    for month_key in sorted(monthly_map.keys()):
        counts = monthly_map[month_key]
        year, mon = month_key.split("-")
        mes_names = {
            "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr",
            "05": "May", "06": "Jun", "07": "Jul", "08": "Ago",
            "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
        }
        mes_label = f"{mes_names.get(mon, mon)} {year[2:]}"
        result.append({
            "mes": mes_label,
            "fecha": f"{month_key}-01",
            "proximoVencer": counts["proximo_vencer"],
            "venceMas3m": counts["vence_mas_3m"],
            "ventaImpulso": counts["venta_impulso"],
            "venceMenos3m": counts["vence_menos_3m"],
            "devoluciones": counts["devoluciones"],
            "yaVencido": counts["ya_vencido"],
        })

    return result


# ═══════════════════════════════════════════════════
# CATALOG — reads from Quiebra's Odoo sync cache
# ═══════════════════════════════════════════════════

import json
from pathlib import Path

QUIEBRA_CACHE_DEFAULT = "/home/gabriel/Quiebra/backend/last_sync_cache.json"
QUIEBRA_CACHE = Path(os.environ.get("QUIEBRA_CACHE_PATH", QUIEBRA_CACHE_DEFAULT))

# Vencidos sucursal ID → Quiebra warehouse ID
SUCURSAL_TO_WH = {
    "AM": 16, "PR": 24, "SH": 19, "MC": 18,
    "ML": 31, "EQ": 10, "CB": 44, "BN": 8,
    "CO": 13, "PN": 7,  "SM": 45, "SG": 4,
    "SU": 15, "VN": 9,  "AG": 17, "VL": 33,
}

_catalog_raw: list = []
_catalog_mtime: float = 0.0
_catalog_processed: dict = {}   # sucursal_key -> list of processed rows

def _load_catalog() -> list:
    global _catalog_raw, _catalog_mtime, _catalog_processed
    try:
        mtime = QUIEBRA_CACHE.stat().st_mtime
        if mtime != _catalog_mtime:
            with open(QUIEBRA_CACHE, encoding="utf-8") as f:
                data = json.load(f)
            _catalog_raw = data.get("products", [])
            _catalog_mtime = mtime
            _catalog_processed = {}   # invalidate processed cache
    except Exception:
        pass
    return _catalog_raw

def _get_processed(sucursal: str, show_all: bool) -> list:
    key = f"{sucursal}|{show_all}"
    if key not in _catalog_processed:
        raw = _load_catalog()
        result = []
        for p in raw:
            row = _product_for_sucursal(p, sucursal)
            if sucursal and not show_all and row["fallback"]:
                continue
            result.append(row)
        _catalog_processed[key] = result
    return _catalog_processed[key]

def _calc_cobertura(stock: float, sales_30d: float) -> dict:
    if sales_30d and sales_30d > 0:
        days = round((stock / sales_30d) * 30)
        if days <= 7:     rng = "0-7"
        elif days <= 14:  rng = "7-14"
        elif days <= 30:  rng = "14-30"
        elif days <= 60:  rng = "30-60"
        elif days <= 180: rng = ">60"
        else:             rng = ">180"
        return {"coverageDays": days, "cobertura": rng}
    return {"coverageDays": 0, "cobertura": ""}

_PER_WH_FIELDS = ("stock_by_wh", "sales_by_wh", "sales_by_wh_90d", "sales_by_wh_180d",
                  "pending_by_wh", "orderpoints_by_wh", "abc_by_wh", "sale_price_by_wh")

def _product_for_sucursal(p: dict, sucursal: str) -> dict:
    wh_id = SUCURSAL_TO_WH.get(sucursal)
    wh_key = str(wh_id) if wh_id else None
    stock_by_wh = p.get("stock_by_wh") or {}
    sales_by_wh = p.get("sales_by_wh") or {}
    has_sucursal_data = bool(wh_key and any(wh_key in (p.get(f) or {}) for f in _PER_WH_FIELDS))
    if wh_key and wh_key in stock_by_wh:
        stock = float(stock_by_wh[wh_key])
        sales = float(sales_by_wh.get(wh_key, 0))
    else:
        stock = float(p.get("total_stock") or 0)
        sales = float(p.get("sales_30d") or 0)
    cov = _calc_cobertura(stock, sales)

    def _abc_str(v):
        if isinstance(v, dict):
            return v.get("category") or ""
        return v or ""

    abc_raw = p.get("abc_category")
    abc_wh_raw = (p.get("abc_by_wh") or {}).get(wh_key or "", "") if wh_key else ""
    return {
        "id": p.get("id"),
        "nombre": p.get("name", ""),
        "barcode": p.get("barcode") or p.get("default_code") or "",
        "proveedor": p.get("provider") or "",
        "categoria": p.get("category_name") or "",
        "abc": _abc_str(abc_raw),
        "abcSucursal": _abc_str(abc_wh_raw),
        "stock": stock,
        "sales30d": sales,
        "coverageDays": cov["coverageDays"],
        "cobertura": cov["cobertura"],
        "fallback": (not has_sucursal_data) and bool(sucursal),
    }

@app.on_event("startup")
async def warmup_catalog():
    import threading
    def _warm():
        try:
            _load_catalog()
            for suc in SUCURSAL_TO_WH:
                _get_processed(suc, False)
            _get_processed("", True)
        except Exception:
            pass
    threading.Thread(target=_warm, daemon=True).start()

@app.get("/api/catalog/search")
def search_catalog(q: str = "", sucursal: str = "", limit: int = 0, show_all: bool = False):
    processed = _get_processed(sucursal, show_all)
    q_lower = q.lower().strip()
    if not q_lower:
        return processed[:limit] if limit else processed
    if len(q_lower) < 2:
        return []
    results = []
    for r in processed:
        if q_lower in r["nombre"].lower() or q == r["barcode"]:
            results.append(r)
            if limit and len(results) >= limit:
                break
    return results

@app.get("/api/catalog/export")
def export_catalog(
    q: str = "", sucursal: str = "", show_all: bool = False,
    f_stock: str = "all", f_vtas: str = "all", f_cob: str = "all", f_abc: str = ""
):
    import io, xlsxwriter
    from fastapi.responses import StreamingResponse

    rows = list(search_catalog(q=q, sucursal=sucursal, limit=0, show_all=show_all))

    # Apply same client-side filters server-side for export
    abc_filter = [c for c in f_abc.split(",") if c] if f_abc else []
    def keep(r):
        if f_stock == "con" and r["stock"] <= 0: return False
        if f_stock == "sin" and r["stock"] > 0: return False
        if f_vtas == "con" and r["sales30d"] <= 0: return False
        if f_vtas == "sin" and r["sales30d"] > 0: return False
        if f_cob != "all":
            if f_cob == "sd" and r["coverageDays"] > 0: return False
            if f_cob != "sd" and r.get("cobertura") != f_cob: return False
        if abc_filter:
            abc = r.get("abcSucursal") or r.get("abc") or ""
            if abc not in abc_filter: return False
        return True
    rows = [r for r in rows if keep(r)]

    buf = io.BytesIO()
    wb = xlsxwriter.Workbook(buf, {"in_memory": True})
    ws = wb.add_worksheet("Catálogo")

    # Formats
    hdr = wb.add_format({"bold": True, "font_color": "#FFFFFF", "bg_color": "#1e3a5f",
                          "border": 1, "align": "center", "valign": "vcenter", "font_size": 11})
    cell = wb.add_format({"border": 1, "valign": "vcenter", "font_size": 10})
    cell_alt = wb.add_format({"border": 1, "valign": "vcenter", "font_size": 10, "bg_color": "#f0f4ff"})
    num = wb.add_format({"border": 1, "valign": "vcenter", "font_size": 10, "num_format": "#,##0", "align": "right"})
    num_alt = wb.add_format({"border": 1, "valign": "vcenter", "font_size": 10, "num_format": "#,##0", "align": "right", "bg_color": "#f0f4ff"})
    abc_fmt = {
        "A": wb.add_format({"bold": True, "font_color": "#166534", "bg_color": "#dcfce7", "border": 1, "align": "center"}),
        "B": wb.add_format({"bold": True, "font_color": "#1d4ed8", "bg_color": "#dbeafe", "border": 1, "align": "center"}),
        "C": wb.add_format({"bold": True, "font_color": "#854d0e", "bg_color": "#fef9c3", "border": 1, "align": "center"}),
        "D": wb.add_format({"bold": True, "font_color": "#7e22ce", "bg_color": "#f3e8ff", "border": 1, "align": "center"}),
        "E": wb.add_format({"bold": True, "font_color": "#9f1239", "bg_color": "#ffe4e6", "border": 1, "align": "center"}),
    }
    cob_red = wb.add_format({"bold": True, "font_color": "#991b1b", "bg_color": "#fee2e2", "border": 1, "align": "center"})
    cob_ok  = wb.add_format({"border": 1, "align": "center", "font_size": 10})

    headers = ["#", "Producto", "Código", "Proveedor", "Stock", "Ventas 30d", "Cobertura (d)", "Rango", "ABC"]
    col_w   = [5,   45,         16,        28,           9,       10,            14,              10,      6]
    for c, (h, w) in enumerate(zip(headers, col_w)):
        ws.write(0, c, h, hdr)
        ws.set_column(c, c, w)
    ws.set_row(0, 20)

    suc_label = sucursal or "General"
    ws.merge_range("A1:I1", f"Catálogo — {suc_label}  ({len(rows)} productos)", hdr)
    # Re-write actual header on row 1
    for c, (h, w) in enumerate(zip(headers, col_w)):
        ws.write(1, c, h, hdr)
    ws.set_row(1, 18)

    for i, r in enumerate(rows):
        row_i = i + 2
        alt = i % 2 == 1
        cf, nf = (cell_alt, num_alt) if alt else (cell, num)
        abc_val = r.get("abcSucursal") or r.get("abc") or ""
        cov_days = r.get("coverageDays", 0)
        cob_str = r.get("cobertura", "")

        ws.write(row_i, 0, i + 1, cf)
        ws.write(row_i, 1, r.get("nombre", ""), cf)
        ws.write(row_i, 2, r.get("barcode", ""), cf)
        ws.write(row_i, 3, r.get("proveedor", ""), cf)
        ws.write(row_i, 4, r.get("stock", 0), nf)
        ws.write(row_i, 5, r.get("sales30d", 0), nf)
        ws.write(row_i, 6, cov_days if cov_days > 0 else "S/D", cf)
        ws.write(row_i, 7, cob_str or "S/D", cob_red if cob_str in ("0-7", "") else cob_ok)
        ws.write(row_i, 8, abc_val or "—", abc_fmt.get(abc_val, cf))
        ws.set_row(row_i, 16)

    ws.freeze_panes(2, 0)
    ws.autofilter(1, 0, 1 + len(rows), len(headers) - 1)

    wb.close()
    buf.seek(0)
    fname = f"catalogo_{sucursal or 'general'}.xlsx"
    return StreamingResponse(
        buf,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={fname}"}
    )

@app.get("/api/sync/status")
def sync_status():
    try:
        stat = QUIEBRA_CACHE.stat()
        with open(QUIEBRA_CACHE, encoding="utf-8") as f:
            data = json.load(f)
        last_update = data.get("last_update", "")
        next_sync = data.get("next_sync", "")
        return {
            "lastSync": last_update,
            "nextSync": next_sync,
            "productCount": len(data.get("products", [])),
            "cacheSize": round(stat.st_size / 1024 / 1024, 1),
            "ok": True,
        }
    except Exception as e:
        return {"ok": False, "error": str(e)}

@app.get("/api/dev/reload")
async def dev_reload():
    from fastapi.responses import StreamingResponse
    import asyncio, glob as _glob

    frontend = Path("/home/gabriel/vencidos")

    def get_mtime():
        files = list(frontend.glob("components/*.jsx")) + \
                list(frontend.glob("components/*.js")) + \
                list(frontend.glob("components/*.css")) + \
                [frontend / "index.html"]
        return max((f.stat().st_mtime for f in files if f.exists()), default=0)

    async def stream():
        last = get_mtime()
        yield "data: ok\n\n"
        while True:
            await asyncio.sleep(0.1)
            current = get_mtime()
            if current != last:
                last = current
                yield "data: reload\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
