import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, Package, X, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';
import { getReports } from '../../api/reports';
import { getCategories } from '../../api/categories';
import Navbar from '../../components/common/Navbar';
import AmbientBackground from '../../components/common/AmbientBackground';
import Pagination from '../../components/common/Pagination';
import { getStorageUrl, formatDate } from '../../utils/helpers';
import './BrowseItems.css';

const BrowseItems = () => {
  const location = useLocation();
  const itemType = location.pathname.endsWith('/found') ? 'found' : 'lost';
  const isLost = itemType === 'lost';
  const titleWord = isLost ? 'Barang Hilang' : 'Barang Temuan';

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    location: '',
  });

  useEffect(() => {
    fetchItems(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemType]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const fetchItems = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getReports({
        type: itemType,
        category: categories.find((category) => category.id === Number(filters.category_id))?.name || undefined,
        location: filters.location || undefined,
        search: filters.search || undefined,
        page,
      });
      setItems(response.data || []);
      setMeta(response);
    } catch (error) {
      toast.error('Gagal memuat barang');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(1);
  };

  const handlePageChange = (page) => {
    fetchItems(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category_id: '',
      location: '',
    });
    setIsLoading(true);
    setTimeout(() => fetchItems(1), 0);
  };

  return (
    <div className="browse-page">
      <AmbientBackground />
      <Navbar />

      <div className="browse-container">
        <motion.div
          className="browse-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="browse-title">
            <span className="text-gradient">{titleWord}</span>
          </h1>
          <p className="browse-subtitle">
            {isLost ? 'Cari barang hilang yang dilaporkan' : 'Lihat barang temuan yang terdaftar'} di Perpustakaan UNDIP
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="search-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Cari berdasarkan nama barang..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => handleFilterChange('search', '')}
                  className="search-clear"
                  aria-label="Hapus pencarian"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="search-button">
              Cari
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
            >
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              className="filters-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filters-grid">
                <div className="filter-group">
                  <label htmlFor="category" className="filter-label">
                    Kategori
                  </label>
                  <select
                    id="category"
                    value={filters.category_id}
                    onChange={(e) => handleFilterChange('category_id', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="location" className="filter-label">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    id="location"
                    placeholder="Contoh: Ruang Baca Lt. 3"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="filter-input"
                  />
                </div>
              </div>

              <div className="filters-actions">
                <button onClick={() => fetchItems(1)} className="filter-apply">
                  Terapkan Filter
                </button>
                <button onClick={clearFilters} className="filter-clear">
                  Hapus Semua
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Items Grid */}
        <div className="items-section">
          {isLoading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="item-skeleton" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Package size={64} />
              <h3 className="empty-title">Tidak ada barang ditemukan</h3>
              <p className="empty-description">
                {isLost
                  ? 'Belum ada laporan barang hilang yang cocok dengan pencarian Anda'
                  : 'Belum ada barang temuan yang cocok dengan pencarian Anda'}
              </p>
            </motion.div>
          ) : (
            <div className="items-list">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <Link to={`/items/${item.id}`} className="item-row">
                    <div className="item-row-thumb">
                      {item.image_path ? (
                        <img src={getStorageUrl(item.image_path)} alt={item.item_name} />
                      ) : (
                        <Package size={22} />
                      )}
                    </div>

                    <div className="item-row-main">
                      <div className="item-row-title">
                        <h3 className="item-name">{item.item_name}</h3>
                        <span className={`item-badge-inline ${itemType}`}>{titleWord}</span>
                      </div>
                      <div className="item-row-meta">
                        <span><MapPin size={13} /> {item.location}</span>
                        <span><Calendar size={13} /> {formatDate(item.date_lost || item.created_at)}</span>
                      </div>
                    </div>

                    <div className="item-row-side">
                      {item.category && <span className="item-category">{item.category.name}</span>}
                      {item.removal_deadline_at && (
                        <span className="item-removal-note"><Megaphone size={13} /> Dihapus {formatDate(item.removal_deadline_at)}</span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <Pagination meta={meta} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
};

export default BrowseItems;
