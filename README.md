# DevInsights 🚀

> Plataforma de métricas y análisis para equipos de desarrollo

DevInsights es una aplicación web que centraliza y visualiza las métricas de tus repositorios de GitHub para ayudarte a entender el rendimiento de tu equipo, detectar cuellos de botella y tomar decisiones basadas en datos.

---

## ✨ Características

- **📊 Dashboard de métricas** — Visualiza commits, pull requests, issues y reviews en tiempo real
- **👥 Gestión de equipos** — Organiza desarrolladores, proyectos y sprints
- **🔗 Integración con GitHub** — Sincroniza repositorios, commits, PRs e issues automáticamente
- **📈 Análisis de productividad** — Rankings, velocidad del equipo y tendencias
- **⚠️ Alertas inteligentes** — Detecta PRs estancados, desarrolladores inactivos y tareas vencidas
- **📅 Actividad por desarrollador** — Días sin commits, estado de actividad y más
- **🎯 Code quality** — Tasa de aprobación, tiempo de revisión y merge rate

---

## 🛠️ Stack Tecnológico

### Backend

- **Laravel 13** — Framework PHP
- **PostgreSQL** — Base de datos
- **Inertia.js** — Puente entre backend y frontend

### Frontend

- **React 19** — Librería UI
- **TypeScript** — Tipado estático
- **Tailwind CSS** — Estilos
- **Radix UI** — Componentes accesibles
- **Lucide React** — Iconos

### Integraciones

- **GitHub API** — Sincronización de datos
- **Wayfinder** — Generación de rutas tipadas

---

## 🚀 Instalación

### Requisitos previos

- PHP 8.3+
- Composer
- Node.js 20+
- PostgreSQL 15+

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/drios9107/dev_insight.git
cd dev_insight

# 2. Instalar dependencias
composer install
npm install

# 3. Configurar entorno
cp .env.example .env
php artisan key:generate

# 4. Configurar la base de datos
# Edita .env con tus credenciales de PostgreSQL

# 5. Ejecutar migraciones y seeders
php artisan migrate --seed

# 6. Iniciar servidores
php artisan serve
npm run dev
```

Accede a `http://localhost:8000`

---

## ⚙️ Configuración

### GitHub Token

Para sincronizar repositorios necesitas un **Personal Access Token** de GitHub.

1. Ve a [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Genera un token con los scopes: `repo`, `read:user`, `user:email`
3. Agrégalo a tu `.env`:

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_USERNAME=tu-usuario
```

---

## 📖 Uso

### Sincronizar repositorios

1. Ve a **GitHub Repositories** en el sidebar
2. Haz clic en **Sync All Repos**
3. Ingresa el username de GitHub
4. Espera a que se complete la sincronización

### Ver métricas

1. Ve a **Metrics** en el sidebar
2. Selecciona un repositorio en el filtro
3. Explora el dashboard con:
    - Cards de resumen
    - Gráficos de actividad
    - Rankings de desarrolladores
    - Alertas y acciones

### Gestionar tareas

1. Ve a **Tasks**
2. Haz clic en 👁️ para ver detalles
3. Agrega comentarios internos
4. Edita o elimina según necesites

---

## 📊 Métricas Disponibles

| Categoría         | Métricas                                               |
| ----------------- | ------------------------------------------------------ |
| **Commits**       | Total, por día, por desarrollador, promedio diario     |
| **Pull Requests** | Abiertos, mergeados, tiempo de merge, tasa de merge    |
| **Issues**        | Abiertos, cerrados, tiempo de resolución               |
| **Reviews**       | Total, tasa de aprobación, tiempo de revisión          |
| **Equipo**        | Desarrolladores activos, inactivos, ranking            |
| **Sprints**       | Velocidad, tasa de completación                        |
| **Tareas**        | En progreso, en review, vencidas, tasa de completación |
| **Proyectos**     | Activos, totales, duración promedio                    |

---

## 🎯 Roadmap

- [ ] Integración con Trello y Notion
- [ ] Notificaciones en tiempo real
- [ ] Exportación de reportes a PDF
- [ ] Gráficos avanzados (DORA metrics)
- [ ] Sistema de permisos granulares
- [ ] API pública

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 👤 Autor

**David Rios**

- GitHub: [@drios9107](https://github.com/drios9107)
- Portfolio: [driosportfolio.netlify.app](https://https://driosportfolio.netlify.app/)

---

**⭐ Si te gusta el proyecto, dale una estrella ⭐**
