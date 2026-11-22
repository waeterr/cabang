import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Search, Trash2, Users, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  activateUser,
  deleteUser,
  deactivateUser,
  getUsers,
} from '../../api/admin';
import { handleApiError } from '../../utils/helpers';
import AmbientBackground from '../../components/common/AmbientBackground';
import Navbar from '../../components/common/Navbar';
import './AdminUsers.css';

const statusLabel = {
  pending: 'Menunggu',
  approved: 'Terverifikasi',
  rejected: 'Ditolak',
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filter !== 'all') {
        params.verification_status = filter;
      }
      if (search.trim()) {
        params.search = search.trim();
      }
      const data = await getUsers(params);
      setUsers(data.data || []);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const runAction = async (id, action, successMessage) => {
    setProcessingId(id);
    try {
      await action(id);
      toast.success(successMessage);
      fetchUsers();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Hapus akun ${name}? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }
    runAction(id, deleteUser, 'Akun dihapus');
  };

  return (
    <div className="admin-users-page">
      <AmbientBackground />
      <Navbar />
      <main className="admin-users-container">
        <motion.header className="admin-users-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="admin-users-icon"><Users size={30} /></div>
          <div>
            <h1><span className="text-gradient">Manage</span> Users</h1>
            <p>Kelola akun mahasiswa dan status verifikasi KTM.</p>
          </div>
        </motion.header>

        <form
          className="admin-users-toolbar"
          onSubmit={(event) => {
            event.preventDefault();
            fetchUsers();
          }}
        >
          <div className="admin-users-search">
            <Search size={18} />
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama, NIM, atau email"
              value={search}
            />
          </div>
          <button type="submit">Cari</button>
        </form>

        <div className="filter-tabs">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              key={status}
              onClick={() => setFilter(status)}
              type="button"
            >
              {status === 'all' ? 'Semua' : statusLabel[status]}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="claims-loading">Memuat mahasiswa...</div>
        ) : users.length === 0 ? (
          <div className="claims-empty">
            <Users size={56} />
            <h2>Tidak ada mahasiswa</h2>
            <p>Coba ubah kata kunci atau filter status.</p>
          </div>
        ) : (
          <div className="admin-users-table">
            <div className="admin-users-row admin-users-head">
              <span>Mahasiswa</span>
              <span>NIM</span>
              <span>Status</span>
              <span>Aksi</span>
            </div>
            {users.map((student, index) => (
              <motion.div
                className="admin-users-row"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                key={student.id}
                transition={{ delay: index * 0.04 }}
              >
                <div className="admin-users-identity">
                  <div className="admin-users-avatar">{student.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong>{student.name}</strong>
                    <small>{student.email}</small>
                  </div>
                </div>
                <span className="admin-users-nim">{student.nim || '-'}</span>
                <span className={`claim-status status-${student.verification_status}`}>
                  {statusLabel[student.verification_status] || student.verification_status}
                </span>
                <div className="admin-users-actions">
                  {student.verification_status === 'approved' ? (
                    <button
                      className="admin-users-action danger"
                      disabled={processingId === student.id}
                      onClick={() => runAction(student.id, deactivateUser, 'Akses mahasiswa dicabut')}
                      title="Cabut verifikasi"
                      type="button"
                    >
                      <XCircle size={16} />
                    </button>
                  ) : (
                    <button
                      className="admin-users-action success"
                      disabled={processingId === student.id}
                      onClick={() => runAction(student.id, activateUser, 'Mahasiswa diverifikasi')}
                      title="Verifikasi manual"
                      type="button"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button
                    className="admin-users-action danger"
                    disabled={processingId === student.id}
                    onClick={() => handleDelete(student.id, student.name)}
                    title="Hapus akun"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUsers;
