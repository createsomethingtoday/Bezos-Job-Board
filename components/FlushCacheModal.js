// components/FlushCacheModal.js
import { useState } from 'react';
import styles from './JobList.module.css';

const FlushCacheModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFlushCache = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/flushCache', {
        method: 'POST',
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while flushing the cache.');
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h2 className={styles['c-board-title']}>Flush Cache</h2>
      <div className={styles['c-board-card-wrapper']}>
        <p>Click the button below to flush the cache and refresh the job board data.</p>
        <button onClick={handleFlushCache} disabled={isLoading}>
          {isLoading ? 'Flushing Cache...' : 'Flush Cache'}
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default FlushCacheModal;