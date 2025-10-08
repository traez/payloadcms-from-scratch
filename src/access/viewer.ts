import type { Access } from 'payload'

export const viewer: Access = ({ req: { user } }) => {
  return Boolean(user && ['admin', 'editor', 'viewer'].includes(user.role))
}

/*
Viewers are the lowest tier — mostly read-only access.
*/
