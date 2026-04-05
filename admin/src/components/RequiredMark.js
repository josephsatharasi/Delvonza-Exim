import React from 'react';

/** Red asterisk for required form fields */
export default function RequiredMark() {
  return (
    <span className="text-red-600 ml-0.5" aria-hidden="true" title="Required">
      *
    </span>
  );
}
