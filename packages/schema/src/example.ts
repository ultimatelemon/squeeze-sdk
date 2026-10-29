import { defineField, defineSchema, defineType } from './define.js';

// Exercises every field type, so a format regression fails the typecheck.
export const exampleSchema = defineSchema({
  types: [
    defineType({
      name: 'post',
      title: 'Blogpost',
      icon: 'article',
      fields: [
        defineField({
          name: 'title',
          title: 'Titel',
          type: 'text',
          required: true,
          translatable: true,
          maxLength: 120
        }),
        defineField({
          name: 'slug',
          title: 'Slug',
          type: 'slug',
          source: 'title',
          required: true
        }),
        defineField({
          name: 'intro',
          title: 'Introductie',
          type: 'richtext',
          translatable: true
        }),
        defineField({
          name: 'body',
          title: 'Inhoud',
          type: 'blocks',
          translatable: true,
          of: [{ type: 'image' }]
        }),
        defineField({
          name: 'reading_minutes',
          title: 'Leestijd (minuten)',
          type: 'number',
          min: 1,
          integer: true
        }),
        defineField({
          name: 'published',
          title: 'Gepubliceerd',
          type: 'boolean'
        }),
        defineField({
          name: 'published_at',
          title: 'Publicatiedatum',
          type: 'date',
          withTime: true
        }),
        defineField({
          name: 'status',
          title: 'Status',
          type: 'select',
          options: [
            { value: 'draft', label: 'Concept' },
            { value: 'review', label: 'In review' },
            { value: 'final', label: 'Definitief' }
          ]
        }),
        defineField({
          name: 'cover',
          title: 'Coverafbeelding',
          type: 'image',
          required: true
        }),
        defineField({
          name: 'attachment',
          title: 'Bijlage',
          type: 'file'
        }),
        defineField({
          name: 'author',
          title: 'Auteur',
          type: 'reference',
          to: ['author'],
          required: true
        }),
        defineField({
          name: 'tags',
          title: 'Tags',
          type: 'array',
          of: [{ type: 'text' }]
        }),
        defineField({
          name: 'seo',
          title: 'SEO',
          type: 'object',
          fields: [
            defineField({
              name: 'meta_title',
              title: 'Meta-titel',
              type: 'text',
              translatable: true
            }),
            defineField({
              name: 'meta_description',
              title: 'Meta-omschrijving',
              type: 'text',
              multiline: true,
              translatable: true
            })
          ]
        })
      ],
      preview: { titleField: 'title', subtitleField: 'status' }
    }),
    defineType({
      name: 'author',
      title: 'Auteur',
      icon: 'person',
      fields: [
        defineField({
          name: 'name',
          title: 'Naam',
          type: 'text',
          required: true
        }),
        defineField({ name: 'avatar', title: 'Avatar', type: 'image' })
      ],
      preview: { titleField: 'name' }
    })
  ]
});
