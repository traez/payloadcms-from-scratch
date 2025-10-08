import { type Access } from 'payload'

export const editor: Access = ({ req: { user } }) => {
  return Boolean(user && ['admin', 'editor'].includes(user.role))
}

/*
Editors can do everything viewers can, but not admin-only actions.
*/