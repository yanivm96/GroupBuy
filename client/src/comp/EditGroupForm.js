import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormik, Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import {apiUrl} from '../url'

axios.defaults.withCredentials = true;
let axiosConfig = {
  headers: {
    credentials: "include",
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
};

const validationSchema = Yup.object({
  item_name: Yup.string()
  .trim()
  .required('Item name is required'),
  price: Yup.string()
    .required('Required')
    .matches(/^\d+(\.\d+)?$/, 'Should be a valid number'),
  amount_of_people: Yup.string()
    .required('Required')
    .matches(/^\d+$/, 'Should only contain digits'),
  });

export default function AddressForm(props) {
  const navigate = useNavigate();
  const loggedInID = props.loggedInID
  const formik = useFormik({
    initialValues: {
      _id: props.group._id.$oid,
      item_name: props.group.item_name,
      price: props.group.price,
      amount_of_people: props.group.amount_of_people,
      item_description: props.group.item_description,
      image: props.group.image,
      seller_id: props.group.seller_id.$oid,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      let url = apiUrl + "group/update_all_attributes";
      console.log(values)
      axios.put(url, JSON.stringify(values), axiosConfig)
        .then((res) => {
          if (res.data["itemUpdated"] === true) {
            //const id = res.data['id']
            window.location.reload(true);
          }
          else {
            console.log("creation faild");
          }
        });
    }
  });

  return (
<React.Fragment>
  <Typography variant="h6" gutterBottom>
    Edit group
  </Typography>
  <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id="item_name"
          label="Item name"
          name="item_name"
          autoComplete="item_name"
          onChange={formik.handleChange}
          value={formik.values.item_name}
          error={formik.touched.item_name  && Boolean(formik.errors.item_name)}
          helperText={formik.touched.item_name}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id="price"
          label="Price"
          name="price"
          autoComplete="price"
          onChange={formik.handleChange}
          value={formik.values.price}
          error={formik.touched.price && Boolean(formik.errors.price)}
          helperText={formik.touched.price}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id="amount_of_people"
          label="Amount of people"
          name="amount_of_people"
          autoComplete="amount_of_people"
          onChange={formik.handleChange}
          value={formik.values.amount_of_people}
          error={formik.touched.amount_of_people && Boolean(formik.errors.amount_of_people)}
          helperText={formik.touched.amount_of_people}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id="item_description"
          label="Item description"
          name="item_description"
          autoComplete="item_description"
          onChange={formik.handleChange}
          value={formik.values.item_description}
          error={formik.touched.item_description && Boolean(formik.errors.item_description)}
          helperText={formik.touched.item_description}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id="image"
          label="Image"
          name="image"
          autoComplete="image"
          onChange={formik.handleChange}
          value={formik.values.image}
          error={formik.touched.image && Boolean(formik.errors.image)}
          helperText={formik.touched.image}
        />
      </Grid>
      <Grid container justifyContent="center" sx={{ mt: 3 }}>
        <Grid item xs={12} sm={6} md={6}>
          <Button type="submit" variant="contained" disableElevation fullWidth>Edit</Button>
        </Grid>
      </Grid>
    </Grid>
  </Box>
</React.Fragment>
  );
}
