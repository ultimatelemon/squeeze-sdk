import { SCHEMA_FORMAT_VERSION } from './version.js';
import type { DocumentType, Field, SiteSchema } from './types.js';

// Identity helpers: no runtime effect, they only give type-checking and
// autocomplete when defining a schema in code.
export function defineField<F extends Field>(field: F): F {
  return field;
}

export function defineType(type: Omit<DocumentType, 'type'>): DocumentType {
  return { type: 'document', ...type };
}

export function defineSchema(schema: { types: DocumentType[] }): SiteSchema {
  return { version: SCHEMA_FORMAT_VERSION, types: schema.types };
}
