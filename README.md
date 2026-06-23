# Vencidos — Gestión de Productos por Vencer

Aplicación web para controlar productos **próximos a vencer y vencidos** en una cadena de tiendas/sucursales. Permite registrar productos con su fecha de vencimiento, visualizar alertas y reportes, y gestionar usuarios por rol (`sala`, `supervisor`, `admin`).

## 🧱 Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 (SPA en JSX, transpilado en el navegador con Babel Standalone) + Chart.js, cargados desde CDN — sin bundler |
| Backend | Python · FastAPI · Uvicorn |
| Base de datos | SQLite (`vencidos.db`) |
| Despliegue | Uvicorn detrás de Nginx (proxy en `/api/`) |

## 📁 Estructura

```
Vencidos/
├── index.html            # Punto de entrada de la SPA
├── Vencidos App.html      # Vista alternativa / standalone
├── components/            # Componentes React (.jsx)
└── backend/
    ├── main.py            # API REST FastAPI
    ├── start.sh           # Arranque en desarrollo
    └── run-backend.sh     # Arranque en producción (nohup/reboot)
```

## 🚀 Cómo ejecutar

### Backend (API)

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
./start.sh        # uvicorn main:app --host 127.0.0.1 --port 5177
```

### Frontend

El frontend es estático (no requiere build). Sírvelo con cualquier servidor estático:

```bash
python3 -m http.server 8080
# Abre http://localhost:8080/index.html
```

> En producción, Nginx sirve los archivos estáticos y redirige `/api/` al backend en el puerto 5177.

## 🔐 Roles

| Rol | Permisos |
|---|---|
| `sala` | Registro y consulta de productos |
| `supervisor` | Supervisión y reportes |
| `admin` | Gestión de usuarios y configuración |

## ⚠️ Notas de seguridad (pendientes para producción)

Este proyecto es una demo funcional. Antes de un uso real conviene:

- **Hashear las contraseñas** (bcrypt/argon2) — actualmente se comparan en texto plano.
- **No devolver contraseñas** en las respuestas de la API.
- **Restringir CORS** (hoy permite `*`).

La contraseña por defecto para usuarios nuevos es `123456` (debe cambiarse en el primer acceso).
