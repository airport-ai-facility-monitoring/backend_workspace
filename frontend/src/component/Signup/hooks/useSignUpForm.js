import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

const useSignUpForm = () => {
  const [form, setForm] = useState({
    employeeId: "",
    password: "",
    confirmPassword: "",
    name: "",
    department: "",
    position: "",
    hireDate: "",
    phoneNumber: "",
    email: "",
  });

  const [useCustomDomain, setUseCustomDomain] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    alphanumeric: false,
    number: false,
    special: false,
    match: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const consent = localStorage.getItem("privacyConsent");
    if (!consent) {
      alert("개인정보 수집·이용 동의가 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  const validatePassword = (password, confirmPassword) => ({
    length: password.length >= 10 && password.length <= 16,
    alphanumeric: /[a-zA-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    match: password === confirmPassword && password.length > 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => {
      const newForm = { ...prevForm, [name]: value };
      if (name === "password" || name === "confirmPassword") {
        const validation = validatePassword(
          name === "password" ? value : newForm.password,
          name === "confirmPassword" ? value : newForm.confirmPassword
        );
        setPasswordValidation(validation);
      }
      return newForm;
    });
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const isFormValid = () => {
    const { length, alphanumeric, number, special, match } = passwordValidation;
    const passwordValid = length && alphanumeric && number && special && match;

    const requiredFields = [
      "employeeId",
      "password",
      "confirmPassword",
      "name",
      "department",
      "position",
      "hireDate",
    ];
    const fieldsValid = requiredFields.every(
      (field) => form[field] && form[field].trim() !== ""
    );

    const phoneValid = form.phoneNumber.trim().length === 11;

    const emailValid = form.email.trim().length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    return passwordValid && fieldsValid && phoneValid && emailValid;
  };

  const handleSignUp = async () => {
    if (!isFormValid()) {
      alert("모든 필수 항목을 올바르게 입력해주세요.");
      return;
    }

    try {
      const { confirmPassword, ...rest } = form;

      const submitData = { ...rest };
      if (submitData.email === '') {
        submitData.email = null;
      }

      const response = await api.post("/users/signup", submitData);

      localStorage.removeItem("privacyConsent");

      alert("회원가입 성공!");
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(
          `회원가입 실패: ${
            error.response.data.message || error.response.statusText
          }`
        );
      } else {
        alert("서버 통신 중 오류가 발생했습니다.");
      }
    }
  };

  return {
    form,
    setForm,
    showPassword,
    passwordValidation,
    handleChange,
    handleTogglePasswordVisibility,
    isFormValid,
    handleSignUp,
    navigate,
  };
};

export default useSignUpForm;
