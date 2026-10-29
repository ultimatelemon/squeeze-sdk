// The Squeeze schema format. Schemas are plain JSON data, defined in code and
// pushed per site; the dashboard builds its forms from them.

export type FieldType =
  | 'text'
  | 'slug'
  | 'richtext'
  | 'number'
  | 'boolean'
  | 'date'
  | 'select'
  | 'image'
  | 'file'
  | 'reference'
  | 'array'
  | 'object'
  | 'blocks';

/**
 * Name and title are optional here because inline array members do without;
 * Field requires them through NamedField.
 */
interface BaseField {
  /** Field name, unique within its type (snake_case recommended). */
  name?: string;
  /** Label in the dashboard. */
  title?: string;
  description?: string;
  required?: boolean;
  /** Has a value per language. */
  translatable?: boolean;
}

interface NamedField {
  name: string;
  title: string;
}

export interface TextField extends BaseField {
  type: 'text';
  multiline?: boolean;
  minLength?: number;
  maxLength?: number;
}

export interface SlugField extends BaseField {
  type: 'slug';
  /** Name of the field the slug is generated from. */
  source?: string;
}

export interface RichtextField extends BaseField {
  type: 'richtext';
}

export interface NumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
  integer?: boolean;
}

export interface BooleanField extends BaseField {
  type: 'boolean';
}

export interface DateField extends BaseField {
  type: 'date';
  /** true for date and time; date only otherwise. */
  withTime?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectField extends BaseField {
  type: 'select';
  options: SelectOption[];
  multiple?: boolean;
}

export interface ImageField extends BaseField {
  type: 'image';
}

export interface FileField extends BaseField {
  type: 'file';
}

export interface ReferenceField extends BaseField {
  type: 'reference';
  /** Document types that may be referenced. */
  to: string[];
}

export interface ArrayField extends BaseField {
  type: 'array';
  /** Allowed item types; inline types need no name. */
  of: ArrayMember[];
}

export interface ObjectField extends BaseField {
  type: 'object';
  fields: Field[];
}

/**
 * Rich content: text blocks (paragraphs, headings, lists) mixed with inline
 * objects such as images.
 */
export interface BlocksField extends BaseField {
  type: 'blocks';
  /** Block types besides text, e.g. an image or embed object. */
  of?: ArrayMember[];
}

/** Array items are fields whose name and title are optional. */
export type ArrayMember =
  | TextField
  | SlugField
  | RichtextField
  | NumberField
  | BooleanField
  | DateField
  | SelectField
  | ImageField
  | FileField
  | ReferenceField
  | ArrayField
  | ObjectField
  | BlocksField;

/** A field of a document or object; name and title are required. */
export type Field = ArrayMember & NamedField;

export interface DocumentTypePreview {
  /** Field shown as the title in lists. */
  titleField?: string;
  subtitleField?: string;
}

export const TYPE_ICONS = [
  'document',
  'article',
  'page',
  'person',
  'people',
  'box',
  'cart',
  'tag',
  'folder',
  'calendar',
  'image',
  'star',
  'pin',
  'chat',
  'link',
  'gear'
] as const;

export type TypeIcon = (typeof TYPE_ICONS)[number];

export interface DocumentType {
  type: 'document';
  /** Type name, unique within the schema (snake_case recommended). */
  name: string;
  title: string;
  description?: string;
  /** Dashboard icon; guessed from the name when omitted. */
  icon?: TypeIcon;
  fields: Field[];
  preview?: DocumentTypePreview;
}

export interface SiteSchema {
  /** Format version; matches SCHEMA_FORMAT_VERSION. */
  version: number;
  types: DocumentType[];
}
