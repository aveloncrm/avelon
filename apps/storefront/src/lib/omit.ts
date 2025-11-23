export function omitUser<User, Key extends keyof User>(
   user: User,
   ...keys: Key[]
): Omit<User, Key> {
   for (const _key of keys) {
      delete user[_key]
   }
   return user
}
