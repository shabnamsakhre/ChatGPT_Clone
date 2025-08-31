import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import FormInput from "../components/FormInput";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Register = () => {
  const methods = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    axios
      .post(
        "http://localhost:3000/api/auth/register",
        {
          fullName: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        navigate("/");
        console.log("User created successfully.");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create an Account</h2>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormInput
              name="firstName"
              label="First Name"
              placeholder="Enter your first name"
            />
            <FormInput
              name="lastName"
              label="Last Name"
              placeholder="Enter your last name"
            />
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
            />
            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="Create a password"
            />
            <button type="submit" className="btn">
              Register
            </button>
          </form>
        </FormProvider>

        <p>
          Already have an account?
          <Link to="/login" className="auth-btn">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
