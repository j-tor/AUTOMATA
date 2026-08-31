/**
 * Input validation helpers for DFA components.
 */

/**
 * Validates a single state name.
 * State names must be alphanumeric or underscores, and cannot contain commas or parentheses
 * (as those are reserved for formatting compound states in product automata).
 * 
 * @param {string} name 
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateStateName = (name) => {
  if (!name || name.trim() === '') {
    return { isValid: false, message: 'El nombre del estado no puede estar vacío.' };
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length > 15) {
    return { isValid: false, message: 'El nombre del estado es demasiado largo (máximo 15 caracteres).' };
  }

  // Allow only alphanumeric and underscores
  const regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(trimmed)) {
    return { isValid: false, message: 'El nombre del estado solo puede contener letras, números y guiones bajos (_).' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validates a single alphabet symbol.
 * Must be a single non-whitespace character and not be a reserved symbol.
 * 
 * @param {string} symbol 
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateAlphabetSymbol = (symbol) => {
  if (!symbol || symbol.trim() === '') {
    return { isValid: false, message: 'El símbolo no puede estar vacío o ser un espacio.' };
  }

  const trimmed = symbol.trim();

  if (trimmed.length !== 1) {
    return { isValid: false, message: 'El símbolo del alfabeto debe ser un único carácter.' };
  }

  // Reserved symbols check
  const reserved = ['ε', 'λ', '(', ')', ',', '-', ' ', '\t', '\n'];
  if (reserved.includes(trimmed)) {
    return { isValid: false, message: `El símbolo "${trimmed}" está reservado o no está permitido.` };
  }

  return { isValid: true, message: '' };
};

/**
 * Validates the DFA name.
 * 
 * @param {string} name 
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateDFAName = (name) => {
  if (!name || name.trim() === '') {
    return { isValid: false, message: 'El nombre del DFA es obligatorio.' };
  }

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { isValid: false, message: 'El nombre del DFA debe tener al menos 2 caracteres.' };
  }

  if (trimmed.length > 30) {
    return { isValid: false, message: 'El nombre del DFA no puede superar los 30 caracteres.' };
  }

  // Allow letters (incluye acentos áéíóú ü y ñ), numbers, spaces, hyphens, and underscores
  const regex = /^[a-zA-Z0-9_ \-áéíóúÁÉÍÓÚüÜñÑ]+$/;
  if (!regex.test(trimmed)) {
    return { isValid: false, message: 'El nombre solo puede contener letras (incluye acentos y ñ), números, espacios, guiones (-) y guiones bajos (_).' };
  }

  return { isValid: true, message: '' };
};
