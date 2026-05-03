import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    propertyAPI.getOne(id).then(res => setProperty(res.data)).catch(() => navigate('/properties'));
  }, [id]);

  if (!property) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div style={styles.page}>
      <button onClick={() => navigate(-1)} style={styles.back}>Back</button>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>{property.title}</h2>
          <span style={styles.badge}>{property.type}</span>
        </div>
        <p style={styles.location}>{property.location?.area}, {property.location?.city} {property.location?.pincode}</p>
        <p style={styles.price}>₹{property.price} Lakhs</p>
        <div style={styles.tags}>
          {property.bhk && <span style={styles.tag}>{property.bhk} BHK</span>}
          {property.area?.size && <span style={styles.tag}>{property.area.size} sqft</span>}
          {property.location?.nearMetro && <span style={styles.tagGreen}>Near Metro</span>}
        </div>
        {property.description && <p style={styles.desc}>{property.description}</p>}
        {property.amenities?.length > 0 && (
          <div>
            <h4 style={styles.sectionTitle}>Amenities</h4>
            <div style={styles.tags}>
              {property.amenities.map(a => <span key={a} style={styles.tag}>{a}</span>)}
            </div>
          </div>
        )}
        {property.listedBy && (
          <div style={styles.contact}>
            <h4 style={styles.sectionTitle}>Listed By</h4>
            <p>{property.listedBy.name} — {property.listedBy.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '2rem', maxWidth: '800px', margin: '0 auto' },
  back: { background: 'none', border: '1px solid #ccc', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', marginBottom: '1rem' },
  card: { background: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' },
  title: { margin: 0, color: '#1a1a2e' },
  badge: { background: '#1a1a2e', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', textTransform: 'capitalize' },
  location: { color: '#666', marginBottom: '0.5rem' },
  price: { color: '#e94560', fontWeight: 'bold', fontSize: '1.5rem', margin: '0.5rem 0 1rem' },
  tags: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' },
  tag: { background: '#f0f0f0', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem' },
  tagGreen: { background: '#d4edda', color: '#155724', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem' },
  desc: { color: '#444', lineHeight: '1.6', marginBottom: '1rem' },
  sectionTitle: { color: '#1a1a2e', marginBottom: '0.5rem' },
  contact: { marginTop: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '6px' },
};
