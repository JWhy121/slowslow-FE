// <<<<<<< HEAD
// =======
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { List, ListItem, ListItemText, TextField } from '@mui/material';

// const CategorySidebar = () => {
//     const [categories, setCategories] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');

//     useEffect(() => {
//         fetch('http://localhost:8080/category/all')
//             .then((response) => response.json())
//             .then((data) => setCategories(data))
//             .catch((error) => console.error('Error fetching data:', error));
//     }, []);

//     const filteredCategories = categories.filter((category) => category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()));

//     return (
//         <div>
//             <TextField
//                 label="카테고리 검색"
//                 variant="outlined"
//                 fullWidth
//                 margin="normal"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <List>
//                 <ListItem button component={Link} to={`/category`}>
//                     <ListItemText primary="전체 보기" />
//                 </ListItem>
//                 {filteredCategories.map((category) => (
//                     <ListItem button key={category.id} component={Link} to={`/category/${category.id}`}>
//                         <ListItemText primary={category.categoryName} />
//                     </ListItem>
//                 ))}
//             </List>
//         </div>
//     );
// };

// export default CategorySidebar;

// >>>>>>> feature/ko
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { List, ListItem, ListItemText, TextField } from '@mui/material';

const CategorySidebar = () => {
    const { id } = useParams(); // 현재 URL의 id를 가져옴
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/category/all')
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const filteredCategories = categories.filter((category) =>
        category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <TextField
                label="카테고리 검색"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <List>
                <ListItem
                    button
                    component={Link}
                    to={`/category`}
                    selected={!id}
                    sx={{
                        backgroundColor: !id ? '#586555 !important' : 'transparent',
                        color: !id ? '#fff' : 'inherit',
                        '&:hover': {
                            backgroundColor: !id ? '#6d7b77' : '#f0f0f0',
                        },
                    }}
                >
                    <ListItemText primary="전체 보기" />
                </ListItem>
                {filteredCategories.map((category) => (
                    <ListItem
                        key={category.id}
                        button
                        component={Link}
                        to={`/category/${category.id}`}
                        selected={category.id === parseInt(id)}
                        sx={{
                            backgroundColor: category.id === parseInt(id) ? '#586555 !important' : 'transparent',
                            color: category.id === parseInt(id) ? '#fff' : 'inherit',
                            '&:hover': {
                                backgroundColor: category.id === parseInt(id) ? '#6d7b77' : '#f0f0f0',
                            },
                        }}
                    >
                        <ListItemText primary={category.categoryName} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default CategorySidebar;
