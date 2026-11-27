import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Image as ImageIcon, Package, Phone, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { createClaim } from '../../api/claims';
import { getReportById } from '../../api/reports';
import { getStorageUrl, handleApiError } from '../../utils/helpers';
import AmbientBackground from '../../components/common/AmbientBackground';
import Navbar from '../../components/common/Navbar';
import '../reports/CreateReport.css';

const CreateClaim = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [formData, setFormData] = useState({
    proof_description: '',
    contact_info: '',
  });

  useEffect(() => {
    getReportById(id)
      .then((data) => {
        if (data.type !== 'found' || data.status !== 'approved') {
          throw new Error('Barang tidak tersedia untuk diklaim');
        }

        if (data.removal_deadline_at && new Date(data.removal_deadline_at) < new Date()) {
          throw new Error('Batas klaim barang ini sudah lewat');
        }

        setReport(data);
      })
      .catch((error) => {
        toast.error(handleApiError(error));
        navigate('/items/found', { replace: true });
      })
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleProofFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Bukti maksimal 2MB');
      event.target.value = '';
      return;
    }

    setProofFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('report_id', id);
      payload.append('proof_description', formData.proof_description);
      payload.append('contact_info', formData.contact_info);
      if (proofFile) {
        payload.append('proof_file', proofFile);
      }

      await createClaim(payload);
      toast.success('Klaim terkirim. Menunggu verifikasi admin.');
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.email_verified === false) {
        toast.error('Verifikasi email Anda dulu sebelum mengajukan klaim.');
        navigate('/verify-email');
        return;
      }
      toast.error(handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-report-page">
      <AmbientBackground />
      <Navbar />
      <div className="create-report-container">
        <Link className="back-link claim-back-link" to={`/items/${id}`}>
          <ArrowLeft size={20} /> Kembali ke detail barang
        </Link>
        <motion.div className="create-report-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="header-icon"><Package size={32} /></div>
          <h1 className="create-report-title"><span className="text-gradient">Klaim</span> Barang</h1>
          <p className="create-report-subtitle">Buktikan bahwa barang ini milik Anda.</p>
        </motion.div>

        {isLoading ? (
          <div className="detail-loading">Memuat barang...</div>
        ) : report && (
          <motion.form className="report-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="claim-item-summary">
              {report.photo_path && <img src={getStorageUrl(report.photo_path)} alt={report.item_name} />}
              <div><span>Barang ditemukan</span><strong>{report.item_name}</strong><small>{report.location}</small></div>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label" htmlFor="proof_description"><FileText size={18} /> Detail Bukti *</label>
                <textarea className="form-textarea" id="proof_description" name="proof_description" value={formData.proof_description} onChange={handleChange} placeholder="Contoh: warna, isi tas, tanda khusus, atau bukti kepemilikan." rows={4} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact_info"><Phone size={18} /> Kontak *</label>
                <input className="form-input" id="contact_info" name="contact_info" value={formData.contact_info} onChange={handleChange} placeholder="Email atau WhatsApp aktif" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="proof_file"><ImageIcon size={18} /> Bukti Pendukung</label>
                <label className="file-upload-label" htmlFor="proof_file"><Upload size={18} /> {proofFile ? proofFile.name : 'Upload JPG, PNG, atau PDF'}</label>
                <input accept=".jpg,.jpeg,.png,.pdf" className="file-input" id="proof_file" onChange={handleProofFile} type="file" />
                <small className="file-hint">Opsional. Maksimal 2MB.</small>
              </div>
            </div>
            <button className="submit-button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Mengirim...' : 'Kirim Klaim'}</button>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default CreateClaim;
