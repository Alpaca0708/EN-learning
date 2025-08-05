import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider) {
        user.provider = account.provider;
      }
      await dbConnect();
      // if user not found, create a new user
      let dbUser = await User.findOne({ email: user.email });
      if (!dbUser) {
        dbUser = await User.create({
          googleId: user.id, // Google ID
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (user) {
        token.provider = user.provider;
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) token.id = dbUser._id.toString();
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.provider = token.provider;
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export { authOptions };
