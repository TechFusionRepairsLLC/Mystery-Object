// Lightweight schema validation for puzzle documents stored in MongoDB.
export function validatePuzzlePayload(payload = {}) {
  const requiredFields = [
    'date',
    'objectName',
    'clue1Image',
    'clue2Image',
    'clue3Image',
    'fullImage'
  ];

  const missingFields = requiredFields.filter(
    (field) => !payload[field] || typeof payload[field] !== 'string'
  );

  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `Missing required fields: ${missingFields.join(', ')}`
    };
  }

  return { valid: true };
}

export function normalizeGuess(value = '') {
  // Normalize guess input so punctuation/case differences do not block valid answers.
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
