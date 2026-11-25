import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Inbox as InboxIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { getInbox, markAllNotificationsRead, markNotificationRead } from '../api/inbox';
import { formatDate, handleApiError } from '../utils/helpers';
import AmbientBackground from '../components/common/AmbientBackground';
import Navbar from '../components/common/Navbar';
import Pagination from '../components/common/Pagination';
import './Inbox.css';

const Inbox = () => {
  const [notifications, setNotifications] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadInbox = async (page = 1) => {
    setIsLoading(true);
    try {
      const result = await getInbox({ page });
      setNotifications(result.data?.data || []);
      setMeta(result.data);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadInbox(); }, []);

  const openNotification = async (notification) => {
    if (!notification.read_at) {
      await markNotificationRead(notification.id);
      setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, read_at: new Date().toISOString() } : item));
    }
  };

  const markAll = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((items) => items.map((item) => ({ ...item, read_at: item.read_at || new Date().toISOString() })));
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  return <div className="inbox-page"><AmbientBackground /><Navbar /><main className="inbox-container"><header className="inbox-header"><div className="inbox-icon"><Bell size={28} /></div><div><h1><span className="text-gradient">Inbox</span></h1><p>Status laporan, klaim, serta pembaruan barang.</p></div><button className="inbox-read-all" onClick={markAll} type="button"><CheckCheck size={17} /> Tandai semua dibaca</button></header>{isLoading ? <p className="inbox-loading">Memuat inbox...</p> : notifications.length === 0 ? <section className="inbox-empty"><InboxIcon size={54} /><h2>Inbox kosong</h2><p>Pembaruan akan muncul di sini.</p></section> : <section className="inbox-list">{notifications.map((notification) => <Link className={`inbox-item ${notification.read_at ? '' : 'is-unread'}`} key={notification.id} onClick={() => openNotification(notification)} to={notification.link || '/inbox'}><div><h2>{notification.title}</h2><p>{notification.body}</p><small>{formatDate(notification.created_at)}</small></div></Link>)}</section>}<Pagination meta={meta} onPageChange={loadInbox} /></main></div>;
};

export default Inbox;
