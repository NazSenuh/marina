import * as Yup from 'yup';

export const  ReservationSchema = Yup.object().shape({
    fullName:  Yup.string().required().min(2).max(50),
    phoneNumber: Yup.string()
    .max(18)
    .required('Uncorrect Phone number'),
    startDate: Yup.date().required(),
    endDate: Yup.string().required(),
    price: Yup.string().max(6).required(),
});

  