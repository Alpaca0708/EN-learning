import NextAuth from "next-auth"
import Providers from "next-auth/providers"

export default NextAuth({
  // 配置一个或多个身份验证提供者
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // 你可以添加更多的提供者
  ],

  // 数据库可选配置
  database: process.env.DATABASE_URL,

  // 配置回调函数，例如：重定向
  callbacks: {
    async signIn(user, account, profile) {
      return true;  // 可以根据情况进行逻辑处理
    },
    async redirect(url, baseUrl) {
      return baseUrl;
    },
    async session(session, user) {
      session.userId = user.id;  // 将用户 ID 添加到会话中
      return session;
    },
    async jwt(token, user, account, profile, isNewUser) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },

  // 可以添加更多配置选项，比如自定义页面
  pages: {
    signIn: '/auth/signin',  // 登录页面路径
    signOut: '/auth/signout', // 登出页面路径
    error: '/auth/error', // 错误页面路径
    verifyRequest: '/auth/verify-request', // 验证请求页面路径
    newUser: null // 如果使用者是新用户，将重定向到此路径
  }
});