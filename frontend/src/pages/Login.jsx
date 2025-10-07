import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import FormInput from "../components/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "../styles/auth.css";
import "../styles/button.css";

const Login = () => {
  const methods = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    axios
      .post(
        "https://chatgpt-clone-cpl7.onrender.com/api/auth/login",
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("Login successfully. = ", res);
        toast.success(res.data.message, { theme: "dark" });

        Cookies.set("user", JSON.stringify(res.data.user.fullName));

        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Invalid email or password!", { theme: "dark" });
      });
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
            <button type="submit" className="btn button">
              {/* Login */}
              <span className="text">Login</span>
            </button>
          </form>
        </FormProvider>
        <p>
          Don't have an account?&nbsp;&nbsp;
          <Link to="/register" className="auth-btn">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
