import { useState, useEffect } from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Box, Typography, List, ListItem, ListItemText, Button, Avatar, Card, CardContent, CardActions } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function FriendsList() {
    const [friends, setFriends] = useState([]);
    const loguser = sessionStorage.getItem('user');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const token = sessionStorage.getItem('token');

                if (!token) {
                    console.error('No token found');
                    return;
                }

                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const response = await axios.get(`http://localhost:5000/api/friend/allFriends/${loguser}`, config);
                setFriends(response.data.friends);
            } catch (error) {
                console.error('Error fetching friends', error);
            }
        };

        fetchFriends();
    }, [loguser]);

    const handleRemoveFriend = async (id) => {
        try {
            const token = sessionStorage.getItem('token');

            if (!token) {
                console.error('No token found');
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.delete(`http://localhost:5000/api/friend/removeFriend/${id}`, config);
            console.log(response.data);
            setFriends(friends.filter(friend => friend._id !== id));
        } catch (error) {
            console.error('Error removing friend', error);
        }
    };

    const handleMessage = async (id1, id2) => {
        if (id1 === loguser) {
            sessionStorage.setItem('receiver', id2);
        } else {
            sessionStorage.setItem('receiver', id1);
        }
        navigate('/chatBox');
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Navbar />
            <Container>
                <Box my={4} sx={{ paddingTop: '130px' }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Friends List
                    </Typography>
                    <List>
                        {friends.map((friend) => {
                            const fromUser = friend.from;
                            const toUser = friend.to;

                            if (!fromUser || !toUser) {
                                console.error('Friend data is missing', friend);
                                return null;
                            }

                            return (
                                <ListItem key={friend._id}>
                                    <Card sx={{ width: '100%' }}>
                                        <CardContent>
                                            {fromUser._id === loguser ? (
                                                <>
                                                    <Avatar alt={toUser.name} src={toUser.profile} />
                                                    <ListItemText primary={toUser.name} sx={{ ml: 2 }} />
                                                </>
                                            ) : toUser._id === loguser ? (
                                                <>
                                                    <Avatar alt={fromUser.name} src={fromUser.profile} />
                                                    <ListItemText primary={fromUser.name} sx={{ ml: 2 }} />
                                                </>
                                            ) : null}
                                        </CardContent>
                                        <CardActions>
                                            <Button variant="contained" color="warning" onClick={() => handleMessage(toUser._id, fromUser._id)}>
                                                Chat
                                            </Button>
                                            <Button variant="contained" color="secondary" onClick={() => handleRemoveFriend(friend._id)}>
                                                Remove Friend
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
