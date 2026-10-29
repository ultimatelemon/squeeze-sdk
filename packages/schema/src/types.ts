// Squeeze schema-formaat: single source of truth voor dashboard-forms,
// validatie en gegenereerde site-types. Schema's zijn pure JSON-data
// (serialiseerbaar), gedefinieerd in code en per site gepusht (ULT-16).

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
 * Basis met optionele naam/titel: als inline array-member zijn die niet
 * nodig; het exporteerde Field-type dwingt ze af via NamedField.
 */
interface BaseField {
  /** Veldnaam, uniek binnen het omliggende type (snake_case aangeraden). */
  name?: string;
  /** Label in het dashboard. */
  title?: string;
  description?: string;
  required?: boolean;
  /** Vertaalbaar per taal (i18n, fase 7). */
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
  /** Naam van het veld waaruit de slug wordt afgeleid. */
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
  /** true = datum + tijd, false/afwezig = alleen datum. */
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
  /** Document-typenamen waarnaar verwezen mag worden. */
  to: string[];
}

export interface ArrayField extends BaseField {
  type: 'array';
  /** Toegestane item-types; inline types hebben geen eigen naam nodig. */
  of: ArrayMember[];
}

export interface ObjectField extends BaseField {
  type: 'object';
  fields: Field[];
}

/**
 * Rich content: een lijst van tekstblokken (paragrafen, koppen, lijsten)
 * gemengd met inline objecten zoals afbeeldingen.
 */
export interface BlocksField extends BaseField {
  type: 'blocks';
  /** Extra bloktypes naast tekst (bijv. een image- of embed-object). */
  of?: ArrayMember[];
}

/** Array-items zijn velden met optionele naam/titel (inline types). */
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

/** Een volwaardig veld binnen een document of object: naam verplicht. */
export type Field = ArrayMember & NamedField;

export interface DocumentTypePreview {
  /** Veld dat als titel in lijstweergaven wordt getoond. */
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
  /** Formaatversie; hoort bij SCHEMA_FORMAT_VERSION. */
  version: number;
  types: DocumentType[];
}
