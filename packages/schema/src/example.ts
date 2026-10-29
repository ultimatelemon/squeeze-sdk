import { defineField, defineSchema, defineType } from './define.js';

// Exercises every field type, so a format regression fails the typecheck.
export const exampleSchema = defineSchema({
  types: [
    defineType({
      name: 'post',
      title: 'Blog post',
      icon: 'article',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
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
          title: 'Introduction',
          type: 'richtext',
          translatable: true
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'blocks',
          translatable: true,
          of: [{ type: 'image' }]
        }),
        defineField({
          name: 'reading_minutes',
          title: 'Reading time (minutes)',
          type: 'number',
          min: 1,
          integer: true
        }),
        defineField({
          name: 'published',
          title: 'Published',
          type: 'boolean'
        }),
        defineField({
          name: 'published_at',
          title: 'Publication date',
          type: 'date',
          withTime: true
        }),
        defineField({
          name: 'status',
          title: 'Status',
          type: 'select',
          options: [
            { value: 'draft', label: 'Draft' },
            { value: 'review', label: 'In review' },
            { value: 'final', label: 'Final' }
          ]
        }),
        defineField({
          name: 'cover',
          title: 'Cover image',
          type: 'image',
          required: true
        }),
        defineField({
          name: 'attachment',
          title: 'Attachment',
          type: 'file'
        }),
        defineField({
          name: 'author',
          title: 'Author',
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
              title: 'Meta title',
              type: 'text',
              translatable: true
            }),
            defineField({
              name: 'meta_description',
              title: 'Meta description',
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
      title: 'Author',
      icon: 'person',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'text',
          required: true
        }),
        defineField({ name: 'avatar', title: 'Avatar', type: 'image' })
      ],
      preview: { titleField: 'name' }
    })
  ]
});
