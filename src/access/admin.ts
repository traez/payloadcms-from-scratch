import { type Access } from 'payload'

export const admin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

/*
Admins can do everything editors and viewers can, plus their own exclusive actions.
*/