export function getDaysRemaining(dueDate: string): number {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getDaysSince(startDate: string): number {
  const today = new Date();
  const start = new Date(startDate);
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatDaysRemaining(dueDate: string): string {
  const days = getDaysRemaining(dueDate);
  
  if (days < 0) {
    return `${Math.abs(days)} days overdue`;
  } else if (days === 0) {
    return 'Due today';
  } else if (days === 1) {
    return 'Due tomorrow';
  } else {
    return `Due in ${days} days`;
  }
}

export function formatDaysConnected(connectedDate: string): string {
  const days = getDaysSince(connectedDate);
  
  if (days === 0) {
    return 'Connected today';
  } else if (days === 1) {
    return '1 day connected';
  } else {
    return `${days} days connected`;
  }
}

export function formatNextNudge(nudgeDate: string): string {
  const days = getDaysRemaining(nudgeDate);
  
  if (days < 0) {
    return 'OVERDUE';
  } else if (days === 0) {
    return 'NOTIFYING TODAY';
  } else if (days === 1) {
    return 'NOTIFYING TOMORROW';
  } else {
    return `NOTIFYING IN ${days} DAYS`;
  }
}

export function isDueSoon(dueDate: string, thresholdDays: number = 7): boolean {
  const days = getDaysRemaining(dueDate);
  return days >= 0 && days <= thresholdDays;
}

export function isOverdue(dueDate: string): boolean {
  return getDaysRemaining(dueDate) < 0;
}
