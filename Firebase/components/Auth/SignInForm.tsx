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
import { useState } from "react";
import { FaRightToBracket } from "react-icons/fa6";
import styles from "./Auth.module.scss";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { handleError, errorAlert } = useErrorHandler();
  const { login, googleAccess } = useAuth();
  const [values, setValues] = useState<CredentialsForm>({
    email: "",
    password: "",
  });
  const redirectTo = searchParams.get("redirectTo");
  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    login(values.email, values.password)
      .then(() => {
        router.replace(redirectTo ?? "/dashboard");
        setLoading(false);
      })
      .catch((error: any) => {
        handleError(GetRefinedFirebaseError(error));
        setLoading(false);
      });
  }
  function handleGoogleLogin(e: React.SyntheticEvent) {
    setLoading(true);
    googleAccess()
      .then(() => {
        router.replace(redirectTo ?? "/dashboard");
        setLoading(false);
      })
      .catch((error: any) => {
        handleError(GetRefinedFirebaseError(error));
        setLoading(false);
      });
  }
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }
  return (
    <>
      <h2>Login to your account</h2>
      <div className={styles.auth_container}>
        <Button
          variant="outline"
          endDecoration={<Image src={googleIcon} alt="google logo" />}
          onClick={handleGoogleLogin}
          disabled={loading}
          aria-disabled={loading}
        >
          Login using Google
        </Button>
        <Divider />
        <FormContainer
          onSubmit={handleEmailSubmit}
          className={styles.auth_form}
          aria-disabled={loading}
        >
          {INPUTS.login.map((input) => (
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
          <p>
            <Link
              href={`/auth/resetPassword${
                redirectTo ? "?redirectTo=" + redirectTo : ""
              }`}
            >
              Forgot Password?
            </Link>
          </p>
          <Button
            endDecoration={<FaRightToBracket />}
            disabled={loading}
            aria-disabled={loading}
          >
            Login
          </Button>
          {errorAlert}
        </FormContainer>
        <p>
          Dont have an account?{" "}
          <Link
            href={`/auth/register${
              redirectTo ? "?redirectTo=" + redirectTo : ""
            }`}
          >
            Register
          </Link>
        </p>
      </div>
    </>
  );
}
