import { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMyActivities } from '../api/inbox';
import { formatDate, handleApiError } from '../utils/helpers';
import AmbientBackground from '../components/common/AmbientBackground';
import Navbar from '../components/common/Navbar';
import Pagination from '../components/common/Pagination';
import './Inbox.css';

const HistoryPage = () => {
  const [activities, setActivities] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadActivities = async (page = 1) => {
    setIsLoading(true);
    try {
      const result = await getMyActivities({ page });
      setActivities(result.data || []);
      setMeta(result);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadActivities(); }, []);

  return <div className="inbox-page"><AmbientBackground /><Navbar /><main className="inbox-container"><header className="inbox-header"><div className="inbox-icon"><History size={28} /></div><div><h1><span className="text-gradient">Riwayat</span> Aktivitas</h1><p>Semua aktivitas laporan dan klaim Anda.</p></div></header>{isLoading ? <p className="inbox-loading">Memuat riwayat...</p> : activities.length === 0 ? <section className="inbox-empty"><History size={54} /><h2>Belum ada riwayat</h2><p>Aktivitas Anda akan tercatat di sini.</p></section> : <section className="inbox-list">{activities.map((activity) => <article className="inbox-item" key={activity.id}><div><h2>{activity.description}</h2><p>{activity.action}</p><small>{formatDate(activity.created_at)}</small></div></article>)}</section>}<Pagination meta={meta} onPageChange={loadActivities} /></main></div>;
};

export default HistoryPage;
