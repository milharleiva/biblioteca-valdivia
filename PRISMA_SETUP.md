# 🗄️ Configuración de Prisma para Biblioteca Valdivia

## ✅ ¿Qué ya está configurado?

- ✅ Prisma instalado
- ✅ Schema completo definido (`prisma/schema.prisma`)
- ✅ Cliente Prisma generado
- ✅ Scripts de npm configurados
- ✅ Cliente de Prisma global (`src/lib/prisma.ts`)
- ✅ APIs de ejemplo creadas

## 🔧 Próximos pasos para completar la configuración

### 1. Obtener la contraseña de la base de datos

1. Ve a **Supabase Dashboard** → **Settings** → **Database**
2. En "Connection string", verás:
   ```
   postgresql://postgres.duhthdwmswbeimgbxguw:[YOUR-PASSWORD]@...
   ```
3. Copia tu contraseña y edita `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres.duhthdwmswbeimgbxguw:TU_PASSWORD_AQUI@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres.duhthdwmswbeimgbxguw:TU_PASSWORD_AQUI@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
   ```

### 2. Crear las tablas en Supabase

Una vez configurada la contraseña:

```bash
# Crear todas las tablas en Supabase
npm run db:push

# Verificar que funcionó
npm run db:studio
```

### 3. Hacer tu usuario administrador

```typescript
// En Prisma Studio o en una API
await prisma.userProfile.create({
  data: {
    userId: "tu-supabase-user-id", // Obtener de auth.users
    name: "Tu Nombre",
    role: "ADMIN"
  }
})
```

## 📊 Scripts disponibles

```bash
# Generar cliente Prisma después de cambios en schema
npm run db:generate

# Sincronizar schema con base de datos (desarrollo)
npm run db:push

# Crear migraciones (producción)
npm run db:migrate

# Abrir Prisma Studio (interfaz web para ver datos)
npm run db:studio

# Poblar base de datos con datos de ejemplo
npm run db:seed
```

## 🎯 Ventajas de usar Prisma

### ✅ Ventajas sobre SQL directo:

- **Type Safety**: TypeScript automático para todas las consultas
- **Intellisense**: Autocompletado en VS Code
- **Migrations**: Control de versiones de la base de datos
- **Relations**: Consultas relacionales fáciles
- **Performance**: Query optimization automático

### 🔄 Comparación:

**Antes (Supabase directo):**
```typescript
const { data, error } = await supabase
  .from('workshops')
  .select('*, user_profiles(name)')
  .eq('is_active', true)
```

**Ahora (Prisma):**
```typescript
const workshops = await prisma.workshop.findMany({
  where: { isActive: true },
  include: {
    creator: { select: { name: true } }
  }
})
// ✅ Completamente tipado!
// ✅ Autocompletado en VS Code
// ✅ Errores de tipo en tiempo de compilación
```

## 🔨 Ejemplos de uso

### Crear un usuario:
```typescript
import { prisma } from '@/lib/prisma'

const user = await prisma.userProfile.create({
  data: {
    userId: "supabase-user-id",
    name: "Juan Pérez",
    phone: "+56912345678",
    role: "USER"
  }
})
```

### Obtener talleres con participantes:
```typescript
const workshops = await prisma.workshop.findMany({
  where: { isActive: true },
  include: {
    enrollments: {
      where: { status: "ENROLLED" },
      include: {
        user: { select: { name: true } }
      }
    },
    _count: {
      select: { enrollments: true }
    }
  }
})
```

### Inscribir usuario a taller:
```typescript
const enrollment = await prisma.workshopEnrollment.create({
  data: {
    userId: "user-id",
    workshopId: "workshop-id",
    status: "ENROLLED"
  }
})
```

## 🚀 APIs ya creadas

- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `GET /api/workshops` - Listar talleres
- `POST /api/workshops` - Crear taller

## 🔄 Migrar código existente

Para reemplazar las consultas Supabase existentes:

1. **Identifica** las consultas en tu código actual
2. **Reemplaza** usando Prisma
3. **Aprovecha** el type safety
4. **Elimina** las interfaces manuales (Prisma las genera)

## 🎉 Próximos pasos recomendados

1. ✅ Configura la contraseña de BD
2. ✅ Ejecuta `npm run db:push`
3. ✅ Crea tu usuario admin
4. ✅ Prueba las APIs con `npm run db:studio`
5. ✅ Migra gradualmente el código existente