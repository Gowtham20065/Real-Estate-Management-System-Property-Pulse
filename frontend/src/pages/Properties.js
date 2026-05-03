import React, { useState, useEffect } from 'react';
import { propertyAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ city: '', type: '', bhk: '', maxPrice: '' });
  const [loading, setLoading] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const res = await propertyAPI.getAll(params);
      setProperties(res.data.properties);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Browse Properties</h2>
      <div style={styles.filters}>
        <input placeholder="City" style={styles.input} value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })} />
        <select style={styles.input} value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>
        <select style={styles.input} value={filters.bhk} onChange={e => setFilters({ ...filters, bhk: e.target.value })}>
          <option value="">Any BHK</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4+ BHK</option>
        </select>
        <input placeholder="Max Price (Lakhs)" style={styles.input} value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
        <button onClick={fetchProperties} style={styles.btn}>Search</button>
      </div>
      {loading ? (
        <p style={styles.msg}>Loading...</p>
      ) : properties.length === 0 ? (
        <p style={styles.msg}>No properties found.</p>
      ) : (
        <div style={styles.grid}>
          {properties.map(p => <PropertyCard key={p._id} property={p} />)}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  heading: { marginBottom: '1.5rem', color: '#1a1a2e' },
  filters: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' },
  input: { padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  msg: { color: '#666', textAlign: 'center', marginTop: '2rem' },
};
