import { useState, InputHTMLAttributes, ReactNode } from "react";
import { Control } from "react-hook-form";

interface PasswordInputProps {
  name: string;
  placeholder?: string;
  refCallback?: any;
  errors: any;
  control?: Control<any>;
  register?: any;
  className?: string;
}

const PasswordInput = ({ name, placeholder, refCallback, errors, register, className }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="flex items-center">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          name={name}
          id={name}
          ref={(r: HTMLInputElement) => { if (refCallback) refCallback(r); }}
          className={`rounded-e-none ${className} ${(errors && errors[name]) ? 'border-red-500 text-red-700 -me-px' : ''}`}
          {...(register ? register(name) : {})}
          autoComplete={name}
        />
        <span className="flex items-center bg-slate-500/5 px-3 h-[38px] py-1 border rounded-e -ms-px dark:border-white/10 dark:bg-white/5 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
          <i className={`mgc_${showPassword ? 'eye_close_line' : 'eye_line'} text-xl`}></i>
        </span>
      </div>
      {errors?.[name] && <p className="text-xs text-red-600 mt-2">{errors[name]['message']}</p>}
    </>
  );
};

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  name: string;
  placeholder?: string;
  register?: any;
  errors?: any;
  control?: Control<any>;
  className?: string;
  labelClassName?: string;
  containerClass?: string;
  refCallback?: any;
  children?: any;
  rows?: number;
  otherComp?: ReactNode;
}

const FormInput = ({ label, type, name, placeholder, register, errors, control, className, labelClassName, containerClass, refCallback, children, rows, otherComp, ...otherProps }: FormInputProps) => {
  if (type === "hidden") {
    return <input type={type} name={name} {...(register ? register(name) : {})} {...otherProps} />;
  }

  if (type === "password") {
    return (
      <div className={`${containerClass ?? ''} relative`}>
        {label && <label className={labelClassName ?? ''} htmlFor={name}>Password</label>}
        <PasswordInput name={name} placeholder={placeholder} refCallback={refCallback} errors={errors} register={register} className={className} />
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={`${containerClass ?? ''} relative`}>
        {label && <label className={labelClassName ?? ''} htmlFor={name}>{label}</label>}
        <textarea placeholder={placeholder} name={name} id={name} rows={rows ?? 4}
          className={`${className} ${errors?.[name] ? 'border-red-500 focus:border-red-500 text-red-700 pe-10' : ''}`}
          {...(register ? register(name) : {})} autoComplete={name} />
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className={`${containerClass ?? ''} relative`}>
        {label && <label className={labelClassName ?? ''} htmlFor={name}>{label}</label>}
        <select name={name} id={name}
          className={`${className} ${errors?.[name] ? 'border-red-500 text-red-700' : ''}`}
          {...(register ? register(name) : {})} autoComplete={name}>
          {children}
        </select>
        {errors?.[name] && <p className="text-xs text-red-600 mt-2">{errors[name]['message']}</p>}
      </div>
    );
  }

  if (type === "checkbox" || type === "radio") {
    return (
      <div className={containerClass ?? ''}>
        <input type={type} name={name} id={name}
          className={`${className} ${errors?.[name] ? 'border-red-500 focus:border-red-500 text-red-700 pe-10' : ''}`}
          {...(register ? register(name) : {})} />
        <label className={labelClassName ?? ''} htmlFor={name}>{label} {otherComp}</label>
      </div>
    );
  }

  return (
    <div className={`${containerClass ?? ''} relative`}>
      {label && <label className={labelClassName ?? ''} htmlFor={name}>{label}</label>}
      <input type={type} placeholder={placeholder} name={name} id={name}
        ref={(r: HTMLInputElement) => { if (refCallback) refCallback(r); }}
        className={`${className} ${errors?.[name] ? 'border-red-500 focus:border-red-500 text-red-700 pe-10' : ''}`}
        {...(register ? register(name) : {})} {...otherProps} autoComplete={name} />
      {errors?.[name] && (
        <>
          <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
            <i className="mgc_warning_fill text-xl text-red-500" />
          </div>
          <p className="text-xs text-red-600 mt-2">{errors[name]['message']}</p>
        </>
      )}
      {children}
    </div>
  );
};

export default FormInput;
