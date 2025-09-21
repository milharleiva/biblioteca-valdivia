-- ============================================================================
-- 📚 SISTEMA DE BIBLIOTECAS PÚBLICAS - REGIÓN DE LOS RÍOS
-- Script de configuración completa de la base de datos
-- ============================================================================

-- Eliminar tablas existentes si las hay (para empezar limpio)
DROP TABLE IF EXISTS workshop_enrollments CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS workshops CASCADE;
DROP TABLE IF EXISTS book_searches CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- ============================================================================
-- 1. TABLA DE PERFILES DE USUARIO
-- ============================================================================

CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  birth_date DATE,
  emergency_contact TEXT,
  emergency_phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para user_profiles
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_is_active ON user_profiles(is_active);

-- ============================================================================
-- 2. TABLA DE TALLERES
-- ============================================================================

CREATE TABLE workshops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructor TEXT NOT NULL,
  instructor_bio TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'tecnologia', 'arte', 'literatura', 'educacion', 'cultura')),
  max_participants INTEGER DEFAULT 20 CHECK (max_participants > 0),
  current_participants INTEGER DEFAULT 0 CHECK (current_participants >= 0),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  schedule TEXT NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  requirements TEXT,
  materials TEXT,
  target_audience TEXT,
  difficulty_level TEXT DEFAULT 'principiante' CHECK (difficulty_level IN ('principiante', 'intermedio', 'avanzado')),
  price DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_dates CHECK (start_date < end_date),
  CONSTRAINT valid_participants CHECK (current_participants <= max_participants)
);

-- Índices para workshops
CREATE INDEX idx_workshops_is_active ON workshops(is_active);
CREATE INDEX idx_workshops_is_featured ON workshops(is_featured);
CREATE INDEX idx_workshops_start_date ON workshops(start_date);
CREATE INDEX idx_workshops_category ON workshops(category);
CREATE INDEX idx_workshops_created_by ON workshops(created_by);

-- ============================================================================
-- 3. TABLA DE INSCRIPCIONES A TALLERES
-- ============================================================================

CREATE TABLE workshop_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'cancelled', 'completed', 'no_show')),
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completion_date TIMESTAMP WITH TIME ZONE,
  attendance_confirmed BOOLEAN DEFAULT false,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  certificate_issued BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraint para evitar inscripciones duplicadas
  UNIQUE(user_id, workshop_id)
);

-- Índices para workshop_enrollments
CREATE INDEX idx_enrollments_user_id ON workshop_enrollments(user_id);
CREATE INDEX idx_enrollments_workshop_id ON workshop_enrollments(workshop_id);
CREATE INDEX idx_enrollments_status ON workshop_enrollments(status);
CREATE INDEX idx_enrollments_enrollment_date ON workshop_enrollments(enrollment_date);

-- ============================================================================
-- 4. TABLA DE ANUNCIOS
-- ============================================================================

CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT, -- Resumen corto para vista previa
  type TEXT DEFAULT 'general' CHECK (type IN ('general', 'event', 'important', 'maintenance', 'news', 'emergency')),
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  is_active BOOLEAN DEFAULT true,
  is_pinned BOOLEAN DEFAULT false,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  link_url TEXT,
  link_text TEXT,
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'users', 'staff')),
  created_by UUID REFERENCES auth.users(id),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraint para fechas válidas
  CONSTRAINT valid_announcement_dates CHECK (end_date IS NULL OR start_date <= end_date)
);

-- Índices para announcements
CREATE INDEX idx_announcements_is_active ON announcements(is_active);
CREATE INDEX idx_announcements_is_pinned ON announcements(is_pinned);
CREATE INDEX idx_announcements_type ON announcements(type);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_announcements_start_date ON announcements(start_date);
CREATE INDEX idx_announcements_created_by ON announcements(created_by);

-- ============================================================================
-- 5. TABLA DE BÚSQUEDAS DE LIBROS (para tracking y analytics)
-- ============================================================================

CREATE TABLE book_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  search_term TEXT NOT NULL,
  search_type TEXT DEFAULT 'general' CHECK (search_type IN ('general', 'title', 'author', 'isbn')),
  results_count INTEGER DEFAULT 0,
  search_source TEXT DEFAULT 'internal',
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para book_searches
CREATE INDEX idx_book_searches_user_id ON book_searches(user_id);
CREATE INDEX idx_book_searches_search_term ON book_searches(search_term);
CREATE INDEX idx_book_searches_created_at ON book_searches(created_at);

-- ============================================================================
-- 6. CONFIGURACIÓN DE ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_searches ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 7. POLÍTICAS DE SEGURIDAD - USER_PROFILES
-- ============================================================================

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Los usuarios pueden insertar su propio perfil
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Los admins pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Los admins pueden actualizar cualquier perfil
CREATE POLICY "Admins can update any profile" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 8. POLÍTICAS DE SEGURIDAD - WORKSHOPS
-- ============================================================================

-- Cualquiera puede ver talleres activos
CREATE POLICY "Anyone can view active workshops" ON workshops
  FOR SELECT USING (is_active = true);

-- Solo admins pueden crear talleres
CREATE POLICY "Only admins can create workshops" ON workshops
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Solo admins pueden actualizar talleres
CREATE POLICY "Only admins can update workshops" ON workshops
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Solo admins pueden eliminar talleres
CREATE POLICY "Only admins can delete workshops" ON workshops
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 9. POLÍTICAS DE SEGURIDAD - WORKSHOP_ENROLLMENTS
-- ============================================================================

-- Los usuarios pueden ver sus propias inscripciones
CREATE POLICY "Users can view own enrollments" ON workshop_enrollments
  FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios pueden inscribirse
CREATE POLICY "Users can enroll in workshops" ON workshop_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus propias inscripciones
CREATE POLICY "Users can update own enrollments" ON workshop_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- Los admins pueden ver todas las inscripciones
CREATE POLICY "Admins can view all enrollments" ON workshop_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Los admins pueden actualizar cualquier inscripción
CREATE POLICY "Admins can update any enrollment" ON workshop_enrollments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Los admins pueden eliminar inscripciones
CREATE POLICY "Admins can delete enrollments" ON workshop_enrollments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 10. POLÍTICAS DE SEGURIDAD - ANNOUNCEMENTS
-- ============================================================================

-- Cualquiera puede ver anuncios activos
CREATE POLICY "Anyone can view active announcements" ON announcements
  FOR SELECT USING (is_active = true);

-- Solo admins pueden crear anuncios
CREATE POLICY "Only admins can create announcements" ON announcements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Solo admins pueden actualizar anuncios
CREATE POLICY "Only admins can update announcements" ON announcements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Solo admins pueden eliminar anuncios
CREATE POLICY "Only admins can delete announcements" ON announcements
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 11. POLÍTICAS DE SEGURIDAD - BOOK_SEARCHES
-- ============================================================================

-- Los usuarios pueden ver sus propias búsquedas
CREATE POLICY "Users can view own searches" ON book_searches
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Cualquiera puede insertar búsquedas
CREATE POLICY "Anyone can insert searches" ON book_searches
  FOR INSERT WITH CHECK (true);

-- Los admins pueden ver todas las búsquedas
CREATE POLICY "Admins can view all searches" ON book_searches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 12. TRIGGERS PARA ACTUALIZAR TIMESTAMPS
-- ============================================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas relevantes
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshop_enrollments_updated_at BEFORE UPDATE ON workshop_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 13. TRIGGER PARA ACTUALIZAR CONTADOR DE PARTICIPANTES
-- ============================================================================

-- Función para actualizar current_participants en workshops
CREATE OR REPLACE FUNCTION update_workshop_participants()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar contador al insertar inscripción
    IF TG_OP = 'INSERT' AND NEW.status = 'enrolled' THEN
        UPDATE workshops
        SET current_participants = current_participants + 1
        WHERE id = NEW.workshop_id;
        RETURN NEW;
    END IF;

    -- Actualizar contador al cambiar status
    IF TG_OP = 'UPDATE' THEN
        -- Si cambió de no-enrolled a enrolled
        IF OLD.status != 'enrolled' AND NEW.status = 'enrolled' THEN
            UPDATE workshops
            SET current_participants = current_participants + 1
            WHERE id = NEW.workshop_id;
        -- Si cambió de enrolled a no-enrolled
        ELSIF OLD.status = 'enrolled' AND NEW.status != 'enrolled' THEN
            UPDATE workshops
            SET current_participants = current_participants - 1
            WHERE id = NEW.workshop_id;
        END IF;
        RETURN NEW;
    END IF;

    -- Actualizar contador al eliminar inscripción
    IF TG_OP = 'DELETE' AND OLD.status = 'enrolled' THEN
        UPDATE workshops
        SET current_participants = current_participants - 1
        WHERE id = OLD.workshop_id;
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ language 'plpgsql';

-- Aplicar trigger
CREATE TRIGGER workshop_participants_trigger
    AFTER INSERT OR UPDATE OR DELETE ON workshop_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_workshop_participants();

-- ============================================================================
-- 14. VISTAS ÚTILES PARA REPORTES
-- ============================================================================

-- Vista de estadísticas de talleres
CREATE VIEW workshop_stats AS
SELECT
    w.id,
    w.title,
    w.max_participants,
    w.current_participants,
    ROUND((w.current_participants::DECIMAL / w.max_participants) * 100, 2) as occupancy_percentage,
    COUNT(we.id) as total_enrollments,
    COUNT(CASE WHEN we.status = 'completed' THEN 1 END) as completed_count,
    AVG(we.rating) as average_rating
FROM workshops w
LEFT JOIN workshop_enrollments we ON w.id = we.workshop_id
GROUP BY w.id, w.title, w.max_participants, w.current_participants;

-- Vista de usuarios activos
CREATE VIEW active_users AS
SELECT
    up.id,
    up.name,
    up.role,
    up.created_at,
    COUNT(we.id) as workshops_enrolled,
    COUNT(bs.id) as searches_made
FROM user_profiles up
LEFT JOIN workshop_enrollments we ON up.user_id = we.user_id
LEFT JOIN book_searches bs ON up.user_id = bs.user_id
WHERE up.is_active = true
GROUP BY up.id, up.name, up.role, up.created_at;

-- ============================================================================
-- 15. DATOS DE EJEMPLO (OPCIONAL)
-- ============================================================================

-- Comentar/descomentar según necesites datos de prueba

/*
-- Insertar un usuario admin de ejemplo
INSERT INTO user_profiles (user_id, name, role)
VALUES (
    'REEMPLAZAR_CON_UUID_REAL',  -- Reemplazar con UUID real de auth.users
    'Administrador Sistema',
    'admin'
);

-- Insertar talleres de ejemplo
INSERT INTO workshops (title, description, instructor, category, max_participants, start_date, end_date, schedule, location) VALUES
('Introducción a la Lectura Digital', 'Aprende a usar dispositivos digitales para la lectura', 'María González', 'tecnologia', 15, NOW() + INTERVAL '1 week', NOW() + INTERVAL '2 weeks', 'Lunes y Miércoles 16:00-18:00', 'Sala de Computación'),
('Taller de Escritura Creativa', 'Desarrolla tu creatividad literaria', 'Pedro Ramírez', 'literatura', 20, NOW() + INTERVAL '2 weeks', NOW() + INTERVAL '1 month', 'Sábados 10:00-12:00', 'Sala de Eventos'),
('Arte y Cultura Local', 'Conoce la historia cultural de Los Ríos', 'Ana Martínez', 'cultura', 25, NOW() + INTERVAL '3 weeks', NOW() + INTERVAL '6 weeks', 'Jueves 19:00-21:00', 'Auditorio Principal');

-- Insertar anuncios de ejemplo
INSERT INTO announcements (title, content, type, priority, is_pinned) VALUES
('Bienvenidos al Sistema de Bibliotecas', 'Estamos emocionados de presentar nuestra nueva plataforma digital.', 'important', 5, true),
('Nuevos Horarios de Atención', 'A partir del próximo mes, estaremos abiertos de 8:00 a 20:00.', 'general', 3, false),
('Mantenimiento del Sistema', 'El sistema estará en mantenimiento el domingo por la madrugada.', 'maintenance', 4, true);
*/

-- ============================================================================
-- 🎉 ¡CONFIGURACIÓN COMPLETADA!
-- ============================================================================

-- Para verificar que todo se creó correctamente, ejecuta:
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Para ver las políticas RLS creadas:
SELECT
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;