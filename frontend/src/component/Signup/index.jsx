import React from 'react';
import SignUpLayout from './layout/SignUpLayout';
import SignUpForm from './components/SignUpForm';
import useSignUpForm from './hooks/useSignUpForm';

const SignUp = () => {
  const formProps = useSignUpForm();

  return (
    <SignUpLayout>
      <SignUpForm {...formProps} />
    </SignUpLayout>
  );
};

export default SignUp;
