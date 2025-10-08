import type { CollectionConfig } from 'payload'
import { admin } from '@/access/admin'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true, // Makes this collection handle user authentication
  access: {
    read: () => true, //setting to read: viewer, would mean ean only logged in users(viewers) can view
    update: admin,
    create: admin,
    delete: admin,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' }, // highest tier
        { label: 'Editor', value: 'editor' }, // middle tier
        { label: 'Viewer', value: 'viewer' }, // lowest tier
      ],
      required: true,
      defaultValue: 'viewer',
    },
  ],
}
