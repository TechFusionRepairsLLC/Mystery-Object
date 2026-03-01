'use client';

import { useState } from 'react';

const defaultForm = {
  date: new Date().toISOString().slice(0, 10),
  objectName: '',
  clue1Image: '',
  clue2Image: '',
  clue3Image: '',
  fullImage: ''
};

export default function AdminPage() {
  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    const response = await fetch('/api/admin/puzzle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    setMessage(data.message);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <main className="container">
      <h1>Admin · Create Daily Puzzle</h1>
      <p className="muted">Add one global puzzle for a date.</p>

      <form className="admin-form" onSubmit={onSubmit}>
        {Object.keys(defaultForm).map((key) => (
          <label key={key}>
            {key}
            <input
              type={key === 'date' ? 'date' : 'text'}
              value={form[key]}
              onChange={(event) => updateField(key, event.target.value)}
              required
            />
          </label>
        ))}
        <button type="submit">Save Puzzle</button>
      </form>

      {message && <p className="feedback">{message}</p>}
    </main>
  );
}
