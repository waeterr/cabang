import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Upload, MapPin, Calendar, FileText, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { createReport } from '../../api/reports';
import { getCategories } from '../../api/categories';
import Navbar from '../../components/common/Navbar';
import AmbientBackground from '../../components/common/AmbientBackground';
import './CreateReport.css';

const CreateReport = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    category_id: '',
    location: '',
    date_lost: '',
    image: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      toast.error('Failed to load categories');
      console.error('Categories error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }

      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.item_name || !formData.description || !formData.category_id || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append('item_name', formData.item_name);
    data.append('description', formData.description);
    const selectedCategory = categories.find(c => c.id === parseInt(formData.category_id));
    data.append('category', selectedCategory?.name || '');
    data.append('location', formData.location);
    if (formData.date_lost) {
      data.append('date', formData.date_lost);
    } else {
      data.append('date', new Date().toISOString().split('T')[0]);
    }
    if (formData.image) {
      data.append('photo', formData.image);
    }

    try {
      await createReport(data);
      toast.success('Report created successfully!');
      navigate('/reports/my');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-report-page">
      <AmbientBackground />
      <Navbar />

      <div className="create-report-container">
        <motion.div
          className="create-report-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-icon">
            <Plus size={32} />
          </div>
          <h1 className="create-report-title">
            <span className="text-gradient">Report</span> Lost Item
          </h1>
          <p className="create-report-subtitle">
            Laporkan barang hilang Anda di Perpustakaan UNDIP
          </p>
        </motion.div>

        <motion.form
          className="report-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="item_name" className="form-label">
                <FileText size={18} />
                <span>Item Name *</span>
              </label>
              <input
                type="text"
                id="item_name"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                placeholder="e.g., Blue Backpack"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category_id" className="form-label">
                <FileText size={18} />
                <span>Category *</span>
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">
                <MapPin size={18} />
                <span>Location *</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Ruang Baca Lt. 3"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date_lost" className="form-label">
                <Calendar size={18} />
                <span>Date Lost</span>
              </label>
              <input
                type="date"
                id="date_lost"
                name="date_lost"
                value={formData.date_lost}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description" className="form-label">
                <FileText size={18} />
                <span>Description *</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item in detail..."
                className="form-textarea"
                rows={4}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="image" className="form-label">
                <ImageIcon size={18} />
                <span>Item Photo</span>
              </label>
              <div className="upload-area">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="upload-input"
                />
                <label htmlFor="image" className="upload-label">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="upload-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <Upload size={32} />
                      <span className="upload-text">Click to upload photo</span>
                      <span className="upload-hint">PNG, JPG up to 2MB</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-cancel"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Report'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateReport;
