
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import {baseUrl} from "@/api/ports";

export const options = {
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/error",
  },

  session: {
    strategy: "jwt",
},

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {label: "email:", type: "email", placeholder: "your-cool-email", },
        password: { label: "Password:", type: "password", placeholder: "your-awesome-password", },
      },
      async authorize(credentials) {
        // This is where you need to retrieve user data
        // to verify with credentials
        // Docs: https://next-auth.js.org/configuration/providers/credentials
        //console.log("credentials ==>", credentials);
        try {
          const response = await axios.post(`${baseUrl}/api/users/login`,credentials);

          return response.data;
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        try {
          const response = await axios.post(`${baseUrl}/api/users/google/login`,{account, profile });
       //   return response.data;
          console.log("🚀 ~ SIGNIN ~ response:", response.data)
          return response.data;
        } catch (e) {
          console.log(e);
          return false;
        }
         
      }

      return true
     // return token // Do different verification for other providers that don't have `email_verified`
    },
    async jwt({ token, account, user }) {
      if (user) {
        token.user = user.user || user;
        token.accessToken = user.token || token.accessToken;
        token.userId = user._id || token.userId;
        token.id = user.user?._id || user._id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.id = token.userId;
      return session;
     
    },
    
  },
  
};
