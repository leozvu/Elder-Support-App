import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Senior Assist
          </h1>
          <p className="text-xl text-gray-600">
            Create an account to get started.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
