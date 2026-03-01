# Berlin Wallet

Plataforma B2B SaaS para programas de fidelización de clientes con integración de wallet digital (Apple Wallet y Google Wallet).

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19 + TypeScript
- **Estilos:** Tailwind CSS v4
- **Backend:** Firebase (Auth + Firestore)
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React
- **QR:** qrcode.react
- **Notificaciones:** react-hot-toast

## Funcionalidades

### Landing Page
- Hero con mockup animado de teléfono
- Sección de features, industrias, cómo funciona
- Precios, testimonios, FAQ
- CTA y footer
- Navegación móvil con bottom nav

### Autenticación
- Registro con email/contraseña
- Login con email/contraseña y Google OAuth
- Selección de tipo de negocio y tema

### Dashboard
- **Inicio:** KPIs, accesos rápidos, actividad reciente
- **Tarjetas:** Crear/gestionar programas de lealtad (sellos, puntos, visitas, eventos)
- **Escáner:** Escaneo QR, búsqueda de clientes, registro manual
- **Clientes:** Tabla de clientes, filtros, historial de interacciones
- **Analíticas:** Gráficos de interacciones, distribución por tipo, progreso promedio, ranking de tarjetas
- **Ajustes:** Perfil de negocio, preferencia de tema dark/light

### Tipos de Programa
| Tipo | Mecánica |
|------|----------|
| Sellos | Estrellas visuales con animación |
| Puntos | Barra de progreso numérica |
| Visitas | Barra de progreso de visitas |
| Eventos | Ticket QR con validación de entrada |

## Estructura del Proyecto

```
src/
├── app/                    # Páginas (App Router)
│   ├── page.tsx           # Landing
│   ├── login/             # Login
│   ├── registro/          # Registro
│   └── dashboard/         # Panel (protegido)
│       ├── tarjetas/      # Gestión de tarjetas
│       ├── scanner/       # Escáner QR
│       ├── clientes/      # Lista de clientes
│       ├── analitica/     # Reportes y métricas
│       └── ajustes/       # Configuración
├── components/
│   ├── ui/                # Componentes reutilizables
│   ├── landing/           # Secciones del landing
│   └── dashboard/         # Componentes del panel
└── lib/                   # Lógica de negocio
    ├── firebase.ts        # Config Firebase
    ├── auth.ts            # Autenticación
    ├── firestore.ts       # Operaciones Firestore
    └── ThemeContext.tsx    # Sistema de temas
```

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Firebase

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## Variables de Entorno

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Deploy

El proyecto se exporta como sitio estático y se despliega en Firebase Hosting:

```bash
npm run build
firebase deploy
```
