import type { Payment } from '../types/models';

export type HealthScore = 'reliable' | 'watch' | 'at-risk';

export interface HealthScoreResult {
  score: HealthScore;
  label: string;
  points: number;
  breakdown: {
    onTime: number;
    slightlyLate: number;
    veryLate: number;
  };
}

export function computeHealthScore(payments: Payment[]): HealthScoreResult {
  // Take last 6 payments only
  const recent = [...payments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  let points = 0;
  let onTime = 0;
  let slightlyLate = 0;  
  let veryLate = 0;

  recent.forEach(payment => {
    // Calculate days late based on payment.paidDate vs payment.dueDate
    if (!payment.dueDate || !payment.paidDate) {
      // Unpaid: treat as very late if overdue
      if (payment.status === 'overdue' || payment.isOverdue) {
        points -= 10;
        veryLate++;
      }
      return;
    }
    
    const due = new Date(payment.dueDate);
    const paid = new Date(payment.paidDate);
    const daysLate = Math.floor((paid.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLate <= 0) {
      points += 10;
      onTime++;
    } else if (daysLate <= 7) {
      points += 3;
      slightlyLate++;
    } else {
      points -= 10;
      veryLate++;
    }
  });

  let score: HealthScore;
  if (points >= 50) score = 'reliable';
  else if (points >= 20) score = 'watch';
  else score = 'at-risk';

  const labels = {
    'reliable': 'Reliable',
    'watch': 'Watch',
    'at-risk': 'At Risk'
  };

  return { 
    score, 
    label: labels[score], 
    points,
    breakdown: { onTime, slightlyLate, veryLate }
  };
}

// Convenience badge props getter
export function getHealthBadgeVariant(score: HealthScore): 'success' | 'warning' | 'danger' {
  return {
    'reliable': 'success',
    'watch': 'warning', 
    'at-risk': 'danger'
  }[score] as 'success' | 'warning' | 'danger';
}
