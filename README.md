# 📚 Sistema de Bibliotecas Públicas - Región de Los Ríos

Una plataforma web moderna para el sistema de bibliotecas públicas de la Región de Los Ríos, Chile. Desarrollada con Next.js, Material-UI y Supabase, ofrece una experiencia completa para usuarios y administradores.

## 🌟 Características

### Para Usuarios
- 🔍 **Búsqueda de libros** - Sistema avanzado de búsqueda con scraping automático
- 📅 **Talleres y eventos** - Inscripción a actividades culturales y educativas
- 👤 **Perfil de usuario** - Gestión de información personal y historial
- 📢 **Anuncios importantes** - Información actualizada sobre servicios y eventos
- 📱 **Diseño responsivo** - Optimizado para todos los dispositivos

### Para Administradores
- 👥 **Gestión de usuarios** - Control completo de cuentas y perfiles
- 🎯 **Gestión de talleres** - Crear, editar y gestionar eventos
- 📢 **Sistema de anuncios** - Publicar información importante
- 📊 **Panel de control** - Estadísticas y métricas del sistema

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15.5.2 con TypeScript
- **UI Components**: Material-UI (MUI) v7
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Animaciones**: Framer Motion
- **Web Scraping**: Puppeteer + Cheerio
- **Deployment**: Vercel
- **Styling**: Material-UI + CSS-in-JS

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Una cuenta en [Supabase](https://supabase.com)

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/biblioteca-valdivia.git
   cd biblioteca-valdivia
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
   ```

   > **Importante**: Estas credenciales las obtienes desde tu [Dashboard de Supabase](https://supabase.com/dashboard) → Project Settings → API

4. **Configurar la base de datos**

   En tu proyecto de Supabase, ejecuta las siguientes tablas:

   ```sql
   -- Tabla de perfiles de usuario
   CREATE TABLE user_profiles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     phone TEXT,
     address TEXT,
     birth_date DATE,
     emergency_contact TEXT,
     emergency_phone TEXT,
     role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Tabla de talleres
   CREATE TABLE workshops (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     instructor TEXT NOT NULL,
     max_participants INTEGER DEFAULT 20,
     current_participants INTEGER DEFAULT 0,
     start_date TIMESTAMP WITH TIME ZONE NOT NULL,
     end_date TIMESTAMP WITH TIME ZONE NOT NULL,
     schedule TEXT NOT NULL,
     location TEXT NOT NULL,
     image_url TEXT,
     requirements TEXT,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Tabla de inscripciones a talleres
   CREATE TABLE workshop_enrollments (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
     status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'cancelled', 'completed')),
     enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id, workshop_id)
   );

   -- Tabla de anuncios
   CREATE TABLE announcements (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     content TEXT NOT NULL,
     type TEXT DEFAULT 'general' CHECK (type IN ('general', 'event', 'important', 'maintenance')),
     is_active BOOLEAN DEFAULT true,
     priority INTEGER DEFAULT 1,
     start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     end_date TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo con Turbopack
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta ESLint para verificar el código

## 🚀 Deployment en Vercel

1. **Conectar con Vercel**
   - Crear cuenta en [Vercel](https://vercel.com)
   - Conectar tu repositorio de GitHub

2. **Configurar variables de entorno en Vercel**
   - Ve a Settings → Environment Variables
   - Agrega las mismas variables del archivo `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY
     ```

3. **Deploy automático**
   - Cada push a la rama principal deployará automáticamente

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── admin/             # Panel de administración
│   ├── auth/              # Páginas de autenticación
│   ├── workshops/         # Gestión de talleres
│   ├── profile/           # Perfil de usuario
│   └── api/               # API routes
├── components/            # Componentes reutilizables
├── contexts/              # Context providers (Auth, etc.)
├── lib/                   # Utilidades y configuraciones
│   └── supabase/          # Cliente de Supabase
└── types/                 # Definiciones de TypeScript
```

## 🔑 Funcionalidades Principales

### Autenticación
- Registro e inicio de sesión con email
- Gestión de perfiles de usuario
- Roles: `user` y `admin`

### Gestión de Talleres
- CRUD completo para talleres
- Sistema de inscripciones
- Control de capacidad
- Gestión de participantes

### Sistema de Anuncios
- Publicación de noticias importantes
- Categorización por tipo y prioridad
- Control de fechas de publicación

### Búsqueda de Libros
- Scraping automatizado de catálogos
- Interfaz de búsqueda intuitiva
- Resultados en tiempo real

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

Desarrollado para el Sistema de Bibliotecas Públicas de la Región de Los Ríos, Chile.

## 🐛 Reportar Problemas

Si encuentras algún bug o tienes sugerencias, por favor crea un [issue](https://github.com/tu-usuario/biblioteca-valdivia/issues) en GitHub.

## 📞 Contacto

- **Email**: info@bibliotecaslosrios.cl
- **Teléfono**: (63) 221-1234
- **Dirección**: Av. Picarte 1785, Valdivia, Los Ríos

---

⭐ Si este proyecto te fue útil, no olvides darle una estrella en GitHub!
