import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import FormInput from "../components/FormInput";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const methods = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    axios
      .post(
        "http://localhost:3000/api/auth/login",
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("Login successfully. = ", res);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} method="POST">
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
              placeholder="Enter your password"
            />
            <button type="submit" className="btn">
              Login
            </button>
          </form>
        </FormProvider>
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="auth-btn">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
