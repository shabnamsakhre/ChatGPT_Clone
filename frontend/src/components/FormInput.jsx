import { useFormContext } from "react-hook-form";

const FormInput = ({ name, label, type = "text", placeholder }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, { required: `${label} is required` })}
      />
      {errors[name] && <p className="error">{errors[name].message}</p>}
    </div>
  );
};

export default FormInput;
