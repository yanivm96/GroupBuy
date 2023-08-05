import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AspectRatio from '@mui/joy/AspectRatio';
import LinearWithValueLabel from './LinearProgress';
import Typography from '@mui/joy/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import SmartContractABI from "../SmartContractABI.json"
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { getPaginationItemUtilityClass } from '@mui/material';
import { contractAddress } from "../contractAddress.js"
import CircularProgress from "./CircularProgress.js"



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'whitesmoke',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));



const Joined = styled('div')(({ theme }) => ({
    color: 'green',
    padding: theme.spacing(1),
}));



export default function GroupModal(props) {


    const [userInGroup, setUserInGroup] = useState(false)
    const [group, setGroup] = useState({});
    const [action, setAction] = useState(true)
    const [amountOfUsers, changeAmountOfUsers] = useState(0)
    const [circularProgShow, setCircularProgShow] = useState(false)

    useEffect(() => {
        setCircularProgShow(false)
        axios.get('http://localhost:5000/group/get', { params: { 'group_id': props.GroupId.$oid } })
            .then(response => {
                console.log('useeffect')
                console.log(JSON.parse(response.data))
                setGroup(JSON.parse(response.data));
            })
            .catch(error => {
                console.log(error);
            });
    }, [action]);

    const checkIfUserInGroup = () => {
        var found = false
        group.users.forEach(function (user) {
            if (user.$oid == props.loggedInID) { found = true }
        })
        return found
    };


    useEffect(() => {
        if (group.users) {
            changeAmountOfUsers(group.users.length)
            setUserInGroup(checkIfUserInGroup())
        }
    }, [group])


    const handleJoinOrLeaveButton = (event) => {
        const path = event.target.name === 'join' ? 'join' : 'leave'
        axios.put('http://localhost:5000/group/' + path, {
            user_id: props.loggedInID,
            group_id: props.GroupId.$oid,
        }).then((response) => {
            const toJoin = path === 'join'
            let trans = false
            setCircularProgShow(true)
            trans = joinHandler(props.GroupId.$oid, toJoin)
            trans.then(() => {
                if (response.data.result == true) {
                    console.log('true')
                    setAction(!action)
                }
                else {
                    console.log('false')
                }
            })
                .catch((error) => {
                    console.log(error);
                });
        })

    }

    const joinHandler = async (groupID, toJoin) => {
        console.log(groupID)
        console.log(toJoin)
        let signer = await props.provider.getSigner();
        let contract = new ethers.Contract(
            contractAddress,
            SmartContractABI,
            signer
        );
        if (toJoin) {
            const tx = await contract.buyItems(groupID, {value: props.group.price});
            await tx.wait();
            console.log(tx)

        }
        else {
            const tx = await contract.refund(groupID);
            await tx.wait();
            console.log(tx)
        }
        return true
    }


    return (
        <Grid container spacing={0.2}>
            <Grid item xs={4} md={6}>
                <AspectRatio minHeight="90%" maxHeight="50%" sx={{ my: 2 }}>
                    <img
                        src={group.image}
                        srcSet={group.image}
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
                                    {group.item_name}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography gutterBottom variant="h6" component="div">
                                    ₪{group.price}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography color="text.secondary" variant="body2">
                            {group.item_description}
                        </Typography>
                    </Box>
                    <Divider variant="middle" />
                    <Box sx={{ m: 2 }}>
                        <Typography gutterBottom variant="body1">
                            Group Progression: {amountOfUsers} / {group.amount_of_people}
                        </Typography>
                        <LinearWithValueLabel value={amountOfUsers / group.amount_of_people * 100}></LinearWithValueLabel>
                    </Box>
                    <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
                        {!userInGroup
                            ? <Button name="join" variant="contained" color="success" onClick={handleJoinOrLeaveButton}>Join Group</Button> //onClick={this.handleLogoutClick}
                            : <Button name="leave" variant="outlined" color="error" onClick={handleJoinOrLeaveButton}>Leave Group</Button>
                        }
                        <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
                            {circularProgShow && <CircularProgress />}
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}