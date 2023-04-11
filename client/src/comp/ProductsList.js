import { formatDistanceToNow } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardHeader,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    SvgIcon
} from '@mui/material';

export default function ProductsList(props) {
    const { products = [], sx } = props;

    const handleClick = (id) => {
        props.handleDelete(id)
    };

    return (
        <Card sx={sx}>
            <CardHeader title="Your groups" />
            <List>
                {products.map((product, index) => {
                    const hasDivider = index < products.length - 1;
                    return (
                        <ListItem
                            divider={hasDivider}
                            key={product.id}
                        >
                            <ListItemAvatar>
                                {
                                    product.image
                                        ? (
                                            <Box
                                                component="img"
                                                src={product.image}
                                                sx={{
                                                    borderRadius: 1,
                                                    height: 48,
                                                    width: 48
                                                }}
                                            />
                                        )
                                        : (
                                            <Box
                                                sx={{
                                                    borderRadius: 1,
                                                    backgroundColor: 'neutral.200',
                                                    height: 48,
                                                    width: 48
                                                }}
                                            />
                                        )
                                }
                            </ListItemAvatar>
                            <ListItemText
                                primary={product.item_name}
                                primaryTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                                secondary={product.amount_of_people + " people left"}
                                secondaryTypographyProps={{ variant: 'h9' }}
                            />
                            <Button onClick={() => handleClick(product._id)}>
                                <DeleteIcon></DeleteIcon> </Button>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                    color="inherit"
                    endIcon={(
                        <SvgIcon fontSize="small">
                        </SvgIcon>
                    )}
                    size="small"
                    variant="text"
                >
                    View all
                </Button>
            </CardActions>
        </Card>
    );
};

ProductsList.propTypes = {
    products: PropTypes.array,
    sx: PropTypes.object
};