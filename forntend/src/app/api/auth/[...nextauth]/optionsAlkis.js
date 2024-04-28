
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
    async signIn(signInParams) {
      const { account, profile, user } = signInParams
            console.log("🚀signInParams:", signInParams)
            // console.log("🚀 ~ signIn ~ account:", account)
      // console.log("🚀 ~ signIn ~ user:", user)
      if (account.provider === "google") {
        try {
          const response = await axios.post(`${baseUrl}/api/users/google/login`,{account, profile });
          account.Garen = response.data
       //   return response.data;
          console.log("🚀 ~ SIGNIN ~ response:", response.data)
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
         
      }

      return true
     // return token // Do different verification for other providers that don't have `email_verified`
    },
    async jwt(params) {
      console.log("PARAMS", params);
      
      const { token, account, user, profile  } = params
      console.log("JWT", account?.Garen);
      
      // console.log("jwt callback { token, user }", { token, user,account, profile});
      // If user object exists, it means it's a new sign-in
      if (user?.token) {
        token.provider = 'credentials'
        token.user = user.user;
        token.role = user.user.role;
        token.accessToken = user.token;
        token.userId = user._id;
      } else if (account?.Garen){
         token.user = account.Garen
      }
        
       else {
        // const response = await axios.post(`${baseUrl}/api/users/google/login`,{account, profile });
        // token.userId = response.data._id
      }
       return token;
    },
    async session(sessionParams) {
      const { session, token , user} = sessionParams
      console.log("🚀 sessionParams:", sessionParams)
      // console.log("🚀 ~ session ~ user:", user)
      // console.log("🚀 ~ session ~ session:", session , token)
      // if(token.provider === 'credentials'){
      //   session.user = token.user;
      //   session.accessToken = token.accessToken;
      //   session.role = token.role;
      //   session.id = token.userId;
      //   return session;
      //  }
      //  return session;
      session.custom = token.user
      return { ...session , token}

    },
  },
};