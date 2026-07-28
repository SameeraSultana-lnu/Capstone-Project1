export function sanitizeText(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim();
}

export function createSafePersistencePayload(state) {
  return {
    session: state?.session ? { email: state.session.email } : null,
    activeTab: typeof state?.activeTab === 'string' ? state.activeTab : 'chat'
  };
}
