"use client";

import { useAuth } from "@/contexts/AuthContext";
import INPUTS from "@/shared/constants/inputs";
import { GetRefinedFirebaseError } from "@/shared/functions/errorHandler";
import useErrorHandler from "@/shared/hooks/useErrorHandler";
import Link from "next/link";
import React, { useState } from "react";
import Button from "../Library/Button/Button";
import FormContainer from "../Library/Form/FormContainer";
import FormInput, { CredentialsForm } from "../Library/Form/FormInput";
import styles from "./Auth.module.scss";

export default function ResetPasswordForm() {
  const { handleError, errorAlert } = useErrorHandler();
  const { resetPass } = useAuth();
  const [values, setValues] = useState<CredentialsForm>({
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  function handleResetPass(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    resetPass(values.email)
      .then(() => setEmailSent(true))
      .catch((error: any) => {
        handleError(GetRefinedFirebaseError(error));
      })
      .finally(() => setLoading(false));
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }
  return (
    <>
      <h2>Reset Password</h2>
      <div className={styles.auth_container}>
        <FormContainer onSubmit={handleResetPass} className={styles.auth_form}>
          {INPUTS.resetPass.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChange}
              loading={loading || emailSent}
              hideLabel
            />
          ))}

          <Button type="submit" disabled={loading || emailSent}>
            Send reset email
          </Button>
        </FormContainer>
        <div className={styles.auth_form}>
          {emailSent && (
            <p>Please check your email for the password reset link!</p>
          )}
          {errorAlert}
          <p>
            <Link href={"/auth/login"}>Go back to Login!</Link>
          </p>
        </div>
      </div>
    </>
  );
}
