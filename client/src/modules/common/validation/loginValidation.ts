import * as Yup from 'yup';

export const  LoginSchema = Yup.object().shape({
    password: Yup.string()
    .min(8)
    .required('Password is required')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d\W]).{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number or symbol'
    ),
    email: Yup.string().email().required()
});

  