import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Plus, Tag, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../../api/categories';
import { handleApiError } from '../../utils/helpers';
import AmbientBackground from '../../components/common/AmbientBackground';
import Navbar from '../../components/common/Navbar';
import './AdminCategories.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => {
    setName('');
    setEditingCategory(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }
    setIsSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, name.trim());
        toast.success('Kategori diperbarui');
      } else {
        await createCategory(name.trim());
        toast.success('Kategori ditambahkan');
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Hapus kategori ${category.name}?`)) {
      return;
    }
    try {
      await deleteCategory(category.id);
      toast.success('Kategori dihapus');
      if (editingCategory?.id === category.id) {
        resetForm();
      }
      fetchCategories();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  return (
    <div className="admin-categories-page">
      <AmbientBackground />
      <Navbar />
      <main className="admin-categories-container">
        <motion.header className="admin-categories-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="admin-categories-icon"><Tag size={30} /></div>
          <div><h1><span className="text-gradient">Manage</span> Categories</h1><p>Atur kategori barang untuk laporan CaBang.</p></div>
        </motion.header>

        <form className="category-form" onSubmit={handleSubmit}>
          <input onChange={(event) => setName(event.target.value)} placeholder="Nama kategori" value={name} />
          <button disabled={isSaving} type="submit"><Plus size={18} /> {isSaving ? 'Menyimpan...' : editingCategory ? 'Simpan' : 'Tambah'}</button>
          {editingCategory && <button className="category-cancel" onClick={resetForm} type="button"><X size={18} /> Batal</button>}
        </form>

        {isLoading ? <div className="claims-loading">Memuat kategori...</div> : (
          <section className="categories-grid">
            {categories.map((category, index) => (
              <motion.article className="category-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} key={category.id} transition={{ delay: index * .04 }}>
                <Tag size={20} /><strong>{category.name}</strong>
                <div className="category-actions"><button aria-label={`Edit ${category.name}`} onClick={() => handleEdit(category)} type="button"><Pencil size={16} /></button><button aria-label={`Hapus ${category.name}`} className="category-delete" onClick={() => handleDelete(category)} type="button"><Trash2 size={16} /></button></div>
              </motion.article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminCategories;
