import { GlobalConfig } from 'payload'

export const Bottom: GlobalConfig = {
  slug: 'bottom',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      label: 'Bottom Text',
      required: true,
      defaultValue: 'Trae Zeeofor Tech',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
  ],
}
