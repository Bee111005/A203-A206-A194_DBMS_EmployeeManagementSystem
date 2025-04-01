import "./Category.css";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Category = () => {
    const [category, setCategory] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch categories from API
    const fetchCategories = () => {
        axios.get('http://localhost:3000/auth/category')
            .then(result => {
                if (result.data.Status) {
                    setCategory(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => console.log(err));
    };

    // Delete category function
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            axios.delete(`http://localhost:3000/auth/category/${id}`)
                .then(result => {
                    if (result.data.Status) {
                        alert("Category deleted successfully!");
                        fetchCategories(); // Refresh categories
                    } else {
                        alert(result.data.Error);
                    }
                }).catch(err => console.log(err));
        }
    };

    return (
        <div className='category-container'>
            <div className='category-header'>
                <h3>Category List</h3>
            </div>
            <Link to="/dashboard/add_category" className='add-category-btn'>Add Category</Link>
            <div className='mt-3'>
                <table className='category-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {category.map((c, index) => (
                            <tr key={index}>
                                <td>{c.name}</td>
                                <td>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(c.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Category;
