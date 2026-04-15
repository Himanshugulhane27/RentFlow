import React, { useState } from 'react';

const CalendarView = ({ leases }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getLeasesForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return leases.filter(lease => {
      const start = lease.startDate;
      const end = lease.endDate;
      return dateStr >= start && dateStr <= end && lease.status === 'active';
    });
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={prevMonth}>&lt;</button>
        <h3>{monthNames[currentMonth]} {currentYear}</h3>
        <button onClick={nextMonth}>&gt;</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px' }}>{day}</div>
        ))}

        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} style={{ padding: '10px' }}></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dayLeases = getLeasesForDate(day);
          return (
            <div key={day} style={{ border: '1px solid #eee', padding: '10px', minHeight: '60px', position: 'relative' }}>
              <div style={{ fontWeight: 'bold' }}>{day}</div>
              {dayLeases.map(lease => (
                <div key={lease.leaseId} style={{ fontSize: '10px', backgroundColor: '#e3f2fd', margin: '2px 0', padding: '2px', borderRadius: '2px' }}>
                  {lease.tenantName}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;