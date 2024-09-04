import {
  sendEmailVerification as _sendEmailVerification,
  signOut as _signOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./config";

//Sign Up Auth function
export async function signUp(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred;
}
//login Auth function
export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred;
}
//Google Login and signup Auth function
export async function googleAuth() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  return cred;
}

//logout Auth function
export async function signOut() {
  await _signOut(auth);
}
//Password Reset Auth function
export async function resetPass(email: string) {
  await sendPasswordResetEmail(auth, email);
}
//Send Email Verification Auth Function
export async function sendEmailVerification() {
  if (auth.currentUser == null) {
    console.log("No user found");
    return;
  }
  await _sendEmailVerification(auth.currentUser);
}
