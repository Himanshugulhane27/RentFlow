import React, { useState } from 'react';

const PropertyForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ address: '', rent: '', bedrooms: '', bathrooms: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!formData.address.trim()) errs.address = 'Address is required';
    if (!formData.rent || Number(formData.rent) <= 0) errs.rent = 'Rent must be greater than 0';
    if (formData.bedrooms && Number(formData.bedrooms) < 0) errs.bedrooms = 'Bedrooms cannot be negative';
    if (formData.bathrooms && Number(formData.bathrooms) < 0) errs.bathrooms = 'Bathrooms cannot be negative';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({ ...formData, rent: Number(formData.rent), bedrooms: Number(formData.bedrooms), bathrooms: Number(formData.bathrooms) });
    setFormData({ address: '', rent: '', bedrooms: '', bathrooms: '' });
    setErrors({});
  };

  const fieldError = (field) => errors[field]
    ? <p style={{ color: '#e53935', fontSize: '13px', margin: '0 0 6px' }}>{errors[field]}</p>
    : null;

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Property</h3>
      <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
      {fieldError('address')}
      <input name="rent" type="number" placeholder="Monthly Rent ($)" value={formData.rent} onChange={handleChange} />
      {fieldError('rent')}
      <input name="bedrooms" type="number" placeholder="Bedrooms" value={formData.bedrooms} onChange={handleChange} />
      {fieldError('bedrooms')}
      <input name="bathrooms" type="number" placeholder="Bathrooms" value={formData.bathrooms} onChange={handleChange} />
      {fieldError('bathrooms')}
      <button type="submit">Add Property</button>
    </form>
  );
};

export default PropertyForm;