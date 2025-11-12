"use client";

import { User } from "@firebase/auth";
import { signInWithGoogle, signOut } from "../utils/firebase/firebase";

export default function SignIn({ user }: { user: User | null }) {
  return (
    <>
      {user ? (
        <button className='signin-button' onClick={signOut}>
          Sign Out
        </button>
      ) : (
        <button className='signin-button' onClick={signInWithGoogle}>
          Sign In
        </button>
      )}
    </>
  );
}
