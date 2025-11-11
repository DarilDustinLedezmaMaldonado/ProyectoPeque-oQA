export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateTodoTitle = (title: string): ValidationResult => {
  if (!title || title.trim().length === 0) {
    return {
      isValid: false,
      error: 'Title cannot be empty',
    };
  }

  if (title.length > 500) {
    return {
      isValid: false,
      error: 'Title cannot exceed 500 characters',
    };
  }

  return { isValid: true };
};

export const sanitizeTodoTitle = (title: string): string => {
  return title.trim();
};
