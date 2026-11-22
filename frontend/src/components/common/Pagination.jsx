import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ meta, onPageChange }) => {
  if (!meta || !meta.last_page || meta.last_page <= 1) {
    return null;
  }

  const { current_page: current, last_page: last } = meta;
  const pages = [];

  for (let page = 1; page <= last; page += 1) {
    if (page === 1 || page === last || Math.abs(page - current) <= 1) {
      pages.push(page);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav aria-label="Navigasi halaman" className="pagination">
      <button
        aria-label="Halaman sebelumnya"
        className="pagination-btn"
        disabled={current <= 1}
        onClick={() => onPageChange(current - 1)}
        type="button"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page, index) => (
        page === '...' ? (
          <span className="pagination-gap" key={`gap-${index}`}>…</span>
        ) : (
          <button
            aria-current={page === current ? 'page' : undefined}
            className={`pagination-btn ${page === current ? 'is-active' : ''}`}
            key={page}
            onClick={() => onPageChange(page)}
            type="button"
          >
            {page}
          </button>
        )
      ))}

      <button
        aria-label="Halaman berikutnya"
        className="pagination-btn"
        disabled={current >= last}
        onClick={() => onPageChange(current + 1)}
        type="button"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};

export default Pagination;
