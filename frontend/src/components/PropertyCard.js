import React from 'react';
import { Link } from 'react-router-dom';

export default function PropertyCard({ property }) {
  return (
    <div style={styles.card}>
      <div style={styles.badge}>{property.type}</div>
      <h3 style={styles.title}>{property.title}</h3>
      <p style={styles.location}>{property.location?.area}, {property.location?.city}</p>
      <div style={styles.row}>
        {property.bhk && <span style={styles.tag}>{property.bhk} BHK</span>}
        {property.location?.nearMetro && <span style={styles.tagGreen}>Near Metro</span>}
        {property.area?.size && <span style={styles.tag}>{property.area.size} sqft</span>}
      </div>
      <p style={styles.price}>₹{property.price} Lakhs</p>
      <Link to={`/properties/${property._id}`} style={styles.btn}>View Details</Link>
    </div>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: '8px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'relative' },
  badge: { position: 'absolute', top: '1rem', right: '1rem', background: '#1a1a2e', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'capitalize' },
  title: { margin: '0 0 0.4rem', fontSize: '1rem', color: '#1a1a2e' },
  location: { color: '#666', fontSize: '0.85rem', margin: '0 0 0.6rem' },
  row: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' },
  tag: { background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' },
  tagGreen: { background: '#d4edda', color: '#155724', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' },
  price: { color: '#e94560', fontWeight: 'bold', fontSize: '1.1rem', margin: '0.5rem 0' },
  btn: { display: 'inline-block', marginTop: '0.5rem', background: '#e94560', color: '#fff', padding: '0.4rem 1rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem' },
};
