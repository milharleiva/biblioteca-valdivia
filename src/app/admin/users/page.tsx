'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  People,
  Search,
  AdminPanelSettings,
  Person
} from '@mui/icons-material';
import { MotionDiv } from '@/components/MotionWrapper';
import Link from 'next/link';

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export default function AdminUsersPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: UserProfile | null }>({
    open: false,
    user: null
  });
  const [editDialog, setEditDialog] = useState<{ open: boolean; user: UserProfile | null }>({
    open: false,
    user: null
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    address: '',
    birth_date: '',
    role: 'user' as 'user' | 'admin'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const supabase = createClient();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError('Error al cargar los usuarios');
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      setError('Error inesperado al cargar los usuarios');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async () => {
    if (!deleteDialog.user) return;

    try {
      // First delete the user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', deleteDialog.user.user_id);

      if (profileError) {
        setError('Error al eliminar el perfil del usuario');
        console.error('Error deleting user profile:', profileError);
        return;
      }

      // Then delete the auth user (this requires service role key)
      const { error: authError } = await supabase.auth.admin.deleteUser(deleteDialog.user.user_id);

      if (authError) {
        setError('Error al eliminar la cuenta del usuario');
        console.error('Error deleting auth user:', authError);
        return;
      }

      setSuccess('Usuario eliminado exitosamente');
      fetchUsers(); // Refresh the list
      setDeleteDialog({ open: false, user: null });
    } catch (error) {
      setError('Error inesperado al eliminar el usuario');
      console.error('Error:', error);
    }
  };

  const handleEditSubmit = async () => {
    if (!editDialog.user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(editFormData)
        .eq('user_id', editDialog.user.user_id);

      if (error) {
        setError('Error al actualizar el usuario');
        console.error('Error updating user:', error);
      } else {
        setSuccess('Usuario actualizado exitosamente');
        fetchUsers(); // Refresh the list
        setEditDialog({ open: false, user: null });
      }
    } catch (error) {
      setError('Error inesperado al actualizar el usuario');
      console.error('Error:', error);
    }
  };

  const openEditDialog = (user: UserProfile) => {
    setEditFormData({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      birth_date: user.birth_date || '',
      role: user.role
    });
    setEditDialog({ open: true, user });
  };

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchUsers();
    }
  }, [profile]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  // Redirect if not admin
  if (profile?.role !== 'admin') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Acceso denegado. Esta página es solo para administradores.</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Cargando usuarios...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="xl">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Button
              component={Link}
              href="/admin"
              startIcon={<ArrowBack />}
              sx={{ mb: 2 }}
            >
              Volver al Panel Admin
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Gestión de Usuarios
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Administra todos los usuarios del sistema
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          {/* Filters */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
              gap: 3,
              alignItems: 'center'
            }}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Filtrar por rol</InputLabel>
                <Select
                  value={roleFilter}
                  label="Filtrar por rol"
                  onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'admin')}
                >
                  <MenuItem value="all">Todos los roles</MenuItem>
                  <MenuItem value="user">Usuarios</MenuItem>
                  <MenuItem value="admin">Administradores</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <People color="action" />
                <Typography variant="body2" color="text.secondary">
                  {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Users Table */}
          <Paper elevation={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Contacto</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Registro</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          {searchTerm || roleFilter !== 'all' ? 'No se encontraron usuarios con los filtros aplicados' : 'No hay usuarios registrados'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
                            >
                              {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                {user.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                ID: {user.user_id.slice(0, 8)}...
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            {user.phone && (
                              <Typography variant="body2" color="text.secondary">
                                Tel: {user.phone}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.role === 'admin' ? 'Administrador' : 'Usuario'}
                            color={user.role === 'admin' ? 'warning' : 'default'}
                            size="small"
                            icon={user.role === 'admin' ? <AdminPanelSettings /> : <Person />}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(user.created_at).toLocaleDateString('es-ES')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => openEditDialog(user)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteDialog({ open: true, user })}
                              disabled={user.user_id === profile?.user_id} // Prevent self-deletion
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </MotionDiv>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, user: null })}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que quieres eliminar al usuario &quot;{deleteDialog.user?.name}&quot;?
              Esta acción eliminará permanentemente su cuenta, perfil y todas sus inscripciones.
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, user: null })}>
              Cancelar
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Eliminar Usuario
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog
          open={editDialog.open}
          onClose={() => setEditDialog({ open: false, user: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="Nombre Completo"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Teléfono"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              />
              <TextField
                fullWidth
                label="Dirección"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
              />
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                type="date"
                value={editFormData.birth_date}
                onChange={(e) => setEditFormData({ ...editFormData, birth_date: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={editFormData.role}
                  label="Rol"
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as 'user' | 'admin' })}
                >
                  <MenuItem value="user">Usuario</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog({ open: false, user: null })}>
              Cancelar
            </Button>
            <Button onClick={handleEditSubmit} variant="contained">
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}