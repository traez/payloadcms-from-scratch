import { type Access } from 'payload'

export const admin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

/* 
this is an access control rule that only lets users with role admin perform certain actions.

Admins can do everything editors and users can (plus their own exclusive actions).
Editors can do everything users can (plus their own exclusive actions), but not admin-only stuff.
Users are the lowest tier — they only get the general access.
*/