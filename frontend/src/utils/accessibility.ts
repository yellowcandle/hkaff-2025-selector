/**
 * Accessibility Utilities
 *
 * Helper functions for improving accessibility in the application.
 */

/**
 * Sets focus to an element with optional delay
 */
export const setFocus = (element: HTMLElement, delay = 0): void => {
  if (delay > 0) {
    setTimeout(() => element.focus(), delay);
  } else {
    element.focus();
  }
};

/**
 * Traps focus within a container element for modal dialogs
 */
export const trapFocus = (container: HTMLElement): (() => void) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Announces content to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';

  document.body.appendChild(announcement);
  announcement.textContent = message;

  // Remove after announcement
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
    }
  }, 1000);
};

/**
 * Generates accessible labels for film cards
 */
export const generateFilmCardLabel = (
  title: string,
  director: string,
  runtimeMinutes?: number,
  category?: string
): string => {
  const parts = [title, director];
  if (runtimeMinutes) {
    parts.push(`${runtimeMinutes} min`);
  }
  if (category) {
    parts.push(category);
  }
  return parts.join(', ');
};

/**
 * Handles keyboard navigation for custom components
 */
export const handleKeyboardNavigation = (
  event: KeyboardEvent,
  handlers: {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onHome?: () => void;
    onEnd?: () => void;
  }
): void => {
  switch (event.key) {
    case 'Enter':
      handlers.onEnter?.();
      break;
    case ' ':
      event.preventDefault();
      handlers.onSpace?.();
      break;
    case 'Escape':
      handlers.onEscape?.();
      break;
    case 'ArrowUp':
      event.preventDefault();
      handlers.onArrowUp?.();
      break;
    case 'ArrowDown':
      event.preventDefault();
      handlers.onArrowDown?.();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      handlers.onArrowLeft?.();
      break;
    case 'ArrowRight':
      event.preventDefault();
      handlers.onArrowRight?.();
      break;
    case 'Home':
      event.preventDefault();
      handlers.onHome?.();
      break;
    case 'End':
      event.preventDefault();
      handlers.onEnd?.();
      break;
  }
};

/**
 * Checks if an element is visible in the viewport
 */
export const isElementVisible = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Gets the next focusable element in a container
 */
export const getNextFocusableElement = (container: HTMLElement, currentElement: HTMLElement): HTMLElement | null => {
  const focusableElements = Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[];

  const currentIndex = focusableElements.indexOf(currentElement);
  if (currentIndex === -1 || currentIndex === focusableElements.length - 1) {
    return focusableElements[0] || null;
  }

  return focusableElements[currentIndex + 1];
};

/**
 * Gets the previous focusable element in a container
 */
export const getPreviousFocusableElement = (container: HTMLElement, currentElement: HTMLElement): HTMLElement | null => {
  const focusableElements = Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[];

  const currentIndex = focusableElements.indexOf(currentElement);
  if (currentIndex === -1 || currentIndex === 0) {
    return focusableElements[focusableElements.length - 1] || null;
  }

  return focusableElements[currentIndex - 1];
};

/**
 * Creates a unique ID for ARIA relationships
 */
export const generateUniqueId = (prefix = 'a11y'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

/**
 * Manages ARIA expanded state for collapsible elements
 */
export const manageAriaExpanded = (button: HTMLElement, isExpanded: boolean): void => {
  button.setAttribute('aria-expanded', isExpanded.toString());
};

/**
 * Validates ARIA attributes on an element
 */
export const validateAriaAttributes = (element: HTMLElement): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check aria-labelledby references existing element
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (!labelElement) {
      errors.push(`aria-labelledby references non-existent element: ${labelledBy}`);
    }
  }

  // Check aria-describedby references existing element
  const describedBy = element.getAttribute('aria-describedby');
  if (describedBy) {
    const descElement = document.getElementById(describedBy);
    if (!descElement) {
      errors.push(`aria-describedby references non-existent element: ${describedBy}`);
    }
  }

  // Check aria-expanded is boolean string
  const expanded = element.getAttribute('aria-expanded');
  if (expanded && !['true', 'false'].includes(expanded)) {
    errors.push('aria-expanded must be "true" or "false"');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};