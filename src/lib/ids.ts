let eventCounter = 100;

export function generateEventId(): string {
  eventCounter += 1;
  return `evt_${String(eventCounter).padStart(3, '0')}`;
}
