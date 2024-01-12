import NextAuth from 'next-auth'
import authOptions from './options'
// Export it like this so that next auth can use this
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}