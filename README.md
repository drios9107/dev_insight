# DevInsights 🚀

> Plataforma de métricas y análisis para equipos de desarrollo

DevInsights es una aplicación web que centraliza y visualiza las métricas de tus repositorios de GitHub para ayudarte a entender el rendimiento de tu equipo, detectar cuellos de botella y tomar decisiones basadas en datos.

---

## ✨ Características

- **📊 Dashboard de métricas** — Visualiza commits, pull requests, issues y reviews desde tres perspectivas: por repositorio, por proyecto y por desarrollador
- **👥 Gestión de equipos** — Organiza desarrolladores, proyectos y sprints
- **🔗 Integración con GitHub** — Sincroniza repositorios, commits, PRs, issues y reviews; importa repos individuales o todos los de un usuario
- **📈 Análisis de productividad** — Rankings, velocidad del equipo y tendencias
- **⚠️ Alertas inteligentes** — Detecta PRs estancados, desarrolladores inactivos y tareas vencidas
- **📅 Actividad por desarrollador** — Días sin commits, estado de actividad y más
- **🎯 Code quality** — Tasa de aprobación, tiempo de revisión y merge rate
- **📝 Activity Log** — Registro detallado de acciones (creación, actualización, eliminación, importación y sincronización) con vista de diff campo por campo

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

#### Sincronizar todos los repos de un usuario

1. Ve a **GitHub Repositories** en el sidebar
2. Haz clic en **Sync All Repos**
3. Ingresa el username de GitHub
4. Espera a que se complete la sincronización

#### Importar un repositorio específico

1. Ve a **GitHub Repositories** en el sidebar
2. Haz clic en **Import Repository**
3. Ingresa el **owner** y el **nombre del repositorio**
4. El sistema importará el repositorio y sincronizará su contenido (commits, PRs, issues, reviews)

#### Sincronizar un repositorio existente

1. En la tabla de repositorios, usa la acción **Sync** de la fila
2. El sistema re-sincronizará commits, PRs, issues y reviews

### Ver métricas

1. Ve a **Metrics** en el sidebar
2. Elige una de las tres vistas disponibles:
    - **📊 By Repository** — Métricas agregadas por repositorio
    - **📁 By Project** — Métricas agregadas por proyecto
    - **👥 By Developer** — Métricas agregadas por desarrollador
3. Usa el selector del header para filtrar por la entidad correspondiente al tab activo
4. Explora el dashboard con:
    - Cards de resumen
    - Gráficos de actividad
    - Rankings de desarrolladores
    - Alertas y acciones

### Gestionar proyectos, sprints y tareas

**Proyectos**

1. Ve a **Projects** en el sidebar
2. Crea uno con **New Project**, y haz clic en 👁️ para ver detalles, tareas y progreso

**Sprints**

1. Ve a **Sprints** en el sidebar
2. Crea uno con **New Sprint**, y haz clic en 👁️ para ver detalles, tareas y velocidad

**Tareas**

1. Ve a **Tasks** en el sidebar
2. Filtra por estado, prioridad, proyecto, sprint o assignee
3. Haz clic en 👁️ para ver detalles, comentarios y metadata
4. Edita o elimina según necesites

---

## 📊 Métricas Disponibles

| Categoría         | Métricas                                                 |
| ----------------- | -------------------------------------------------------- |
| **Commits**       | Total, por día, por desarrollador, promedio diario       |
| **Pull Requests** | Abiertos, mergeados, tiempo de merge, tasa de merge      |
| **Issues**        | Abiertos, cerrados, tiempo de resolución                 |
| **Reviews**       | Total, tasa de aprobación, tiempo de revisión            |
| **Equipo**        | Desarrolladores activos, inactivos, ranking              |
| **Sprints**       | Velocidad, tasa de completamiento                        |
| **Tareas**        | En progreso, en review, vencidas, tasa de completamiento |
| **Proyectos**     | Activos, totales, duración promedio                      |

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
- Portfolio: [driosportfolio.netlify.app](https://driosportfolio.netlify.app/)

---

**⭐ Si te gusta el proyecto, dale una estrella ⭐**
