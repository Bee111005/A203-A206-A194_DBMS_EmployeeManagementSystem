import "./AddCategory.css";
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
    const [category, setCategory] = useState("");  // ✅ Initialize state properly
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!category.trim()) {
            alert("Category cannot be empty!");
            return;
        }

        axios.post('http://localhost:3000/auth/add_category', { category })
            .then(result => {
                if (result.data.Status) {
                    navigate('/dashboard/category');
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className='add-category-container'>  {/* ✅ Updated class name */}
            <div className='add-category-form'>  {/* ✅ Updated class name */}
                <h3>Add Category</h3>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="category"><strong>Category:</strong></label>
                        <input
                            type="text"
                            name='category'
                            placeholder='Enter Category'
                            value={category}  // ✅ Ensure controlled input
                            onChange={(e) => setCategory(e.target.value)}
                            className='form-control'
                        />
                    </div>
                    <button type="submit" className='add-category-btn'>Add Category</button>  {/* ✅ Updated button class */}
                </form>
            </div>
        </div>
    );
}

export default AddCategory;
