"use client";
import Button from "@/components/Library/Button/Button";
import Divider from "@/components/Library/Divider/Divider";
import FormContainer from "@/components/Library/Form/FormContainer";
import FormInput, {
  CredentialsForm,
} from "@/components/Library/Form/FormInput";
import { useAuth } from "@/contexts/AuthContext";
import googleIcon from "@/public/Logos/global/Google.svg";
import INPUTS from "@/shared/constants/inputs";
import { GetRefinedFirebaseError } from "@/shared/functions/errorHandler";
import useErrorHandler from "@/shared/hooks/useErrorHandler";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, SyntheticEvent, useState } from "react";
import { FaRightToBracket } from "react-icons/fa6";
import styles from "./Auth.module.scss";

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleError, errorAlert } = useErrorHandler();
  const { signup, googleAccess, sendEV } = useAuth();
  const [values, setValues] = useState<CredentialsForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const redirectTo = searchParams.get("redirectTo");
  async function handleEmailSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (values.confirmPassword == values.password) {
      setLoading(true);
      signup(values.email, values.password)
        .then((userCred) => {
          sendEV();
        })
        .then(() => router.replace("/verifyEmail"))
        .catch((error: any) => handleError(GetRefinedFirebaseError(error)))
        .finally(() => setLoading(false));
    } else {
      handleError("Passwords dont match!");
    }
  }
  function handleGoogleSignup(e: SyntheticEvent<HTMLButtonElement>) {
    setLoading(true);
    googleAccess()
      .then(() => router.replace(redirectTo ?? "/dashboard"))
      .catch((error: any) => handleError(GetRefinedFirebaseError(error)))
      .finally(() => setLoading(false));
  }
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }
  return (
    <>
      <h2>Create your account</h2>
      <div className={styles.auth_container}>
        <Button
          variant="outline"
          endDecoration={<Image src={googleIcon} alt="google logo" />}
          onClick={handleGoogleSignup}
          disabled={loading}
          aria-disabled={loading}
        >
          Signup using your Google account
        </Button>
        <Divider>or</Divider>
        <FormContainer
          onSubmit={handleEmailSubmit}
          className={styles.auth_form}
          aria-disabled={loading}
        >
          {INPUTS.signup.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChange}
              className={styles.auth_input}
              loading={loading}
              aria-disabled={loading}
              hideLabel
            />
          ))}
          <Button
            endDecoration={<FaRightToBracket />}
            disabled={loading}
            aria-disabled={loading}
          >
            Signup
          </Button>
          {errorAlert}
        </FormContainer>
        <p>
          Already have an account?{" "}
          <Link
            href={`/auth/login${redirectTo ? "?redirectTo=" + redirectTo : ""}`}
          >
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
