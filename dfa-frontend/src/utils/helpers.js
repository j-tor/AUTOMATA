/**
 * Utility helper functions
 */

/**
 * Generates a standard short unique identifier.
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return 'dfa-' + Math.random().toString(36).substring(2, 11);
};

/**
 * Checks if two arrays are equal as sets (contains the same elements regardless of order).
 * @param {Array} a 
 * @param {Array} b 
 * @returns {boolean} True if equal
 */
export const arraysEqualAsSets = (a, b) => {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every(item => setA.has(item));
};

/**
 * Deep clones an object safely.
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
