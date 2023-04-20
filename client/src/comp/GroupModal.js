import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AspectRatio from '@mui/joy/AspectRatio';
import LinearWithValueLabel from './LinearProgress';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'whitesmoke',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export default function GroupModal(props) {

    console.log(props.Group)
    const loggedInID = props.Group.loggedInID
    const price = props.Group.price
    const itemName = props.Group.item_name
    const image = props.Group.image
    const groupID = props.Group.groupID
    const isSeller = props.Group.isSeller


    return (
        <Grid container spacing={0.2}>
            <Grid item xs={4} md={6}>
                <AspectRatio minHeight="90%" maxHeight="50%" sx={{ my: 2 }}>
                    <img
                        src={image}
                        srcSet={image}
                        loading="lazy"
                        alt=""
                    />
                </AspectRatio>
            </Grid>
            <Grid item xs={1} md={6}>
                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <Box sx={{ my: 3, mx: 2 }}>
                        <Grid container alignItems="center">
                            <Grid item xs>
                                <Typography gutterBottom variant="h1" component="div">
                                    {itemName} 
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography gutterBottom variant="h6" component="div">
                                    ${price}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography color="text.secondary" variant="body2">
                            {props.Group.item_description}
                        </Typography>
                    </Box>
                    <Divider variant="middle" />
                    <Box sx={{ m: 2 }}>
                        <Typography gutterBottom variant="body1">
                            Group Progression:
                        </Typography>
                        <LinearWithValueLabel></LinearWithValueLabel>
                    </Box>
                    <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
                        <Button>Join Group</Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}