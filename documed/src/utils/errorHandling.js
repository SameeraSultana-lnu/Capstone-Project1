export function getSafeErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message;
  return fallback;
}

export function withErrorHandling(operation, fallbackMessage, onError) {
  try {
    return operation();
  } catch (error) {
    const message = getSafeErrorMessage(error, fallbackMessage);
    if (typeof onError === 'function') onError(message);
    return null;
  }
}
