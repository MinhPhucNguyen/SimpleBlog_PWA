/*
 * @author    Tigren Solutions <info@tigren.com>
 * @copyright Copyright (c) 2023 Tigren Solutions <https://www.tigren.com>. All rights reserved.
 * @license   Open Software License ("OSL") v. 3.0
 *
 */

import React from 'react';
import './BlogListing.css';
import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { BLOG_LISTING, DELETE_BLOG } from '../../../graphql/blogList.gql';
import { CATEGORY_LISTING } from '../../../graphql/categoryList.gql';
import { Link } from 'react-router-dom';

const BlogListing = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedBlogId, setSelectedBlogId] = useState(null);

    const { data: blogListing } = useQuery(BLOG_LISTING, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-and-network'
    });
    const { data: categoryListing } = useQuery(CATEGORY_LISTING, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-and-network'
    });

    const blogs = blogListing ? blogListing.getBlogs : [];
    const categories = categoryListing ? categoryListing.getCategories : [];

    const modal = document.getElementById('myModal');

    const clickToShowModal = (blogId) => {
        setSelectedBlogId(blogId);
        modal.style.display = 'block';
    };

    const closeModal = () => {
        setSelectedBlogId(null);
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    const [deleteBlogMutation] = useMutation(DELETE_BLOG);
    const deleteBlog = async (blogId) => {
        try {
            if (blogId) {
                const { data: response } = await deleteBlogMutation({
                    variables: {
                        id: blogId
                    },
                    refetchQueries: [{ query: BLOG_LISTING }]
                });
                closeModal();
                if (response.deleteBlog.message) {
                    setSuccessMessage(response.deleteBlog.message);
                }
                setTimeout(() => {
                    setSuccessMessage('');
                }, 2000);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div id="myModal" className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => closeModal()}>
                        &times;
                    </span>
                    <p>Are you sure, you want to delete this blog?</p>
                    <div className="button-modal">
                        <button
                            className="cancel-btn"
                            onClick={() => closeModal()}
                        >
                            No
                        </button>
                        <button
                            className="delete-btn"
                            onClick={(e) => deleteBlog(selectedBlogId)}
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </div>

            <div className="blog-listing">
                <h1>
                    <strong>Blog Listing</strong>
                </h1>

                {successMessage && (
                    <div className="alert">
                        <p className="success-message">{successMessage}</p>
                    </div>
                )}

                <div className="blog-listing-table">
                    <a href="/blog/post/create" className="add-new-btn">
                        Add New Blog
                    </a>
                    <table>
                        <thead>
                            <tr>
                                <th> ID</th>
                                <th> Title</th>
                                <th> Catetgory</th>
                                <th> Short Content</th>
                                <th> Full Content</th>
                                <th> Author</th>
                                <th> Status</th>
                                <th> Post Image</th>
                                <th> Published At</th>
                                <th> Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog) => {
                                return (
                                    <tr key={blog.blog_id}>
                                        <td>{blog.blog_id}</td>
                                        <td>{blog.title}</td>
                                        <td>
                                            {categories.map((category) =>
                                                category.category_id ===
                                                blog.category_id
                                                    ? category.name
                                                    : ''
                                            )}
                                        </td>
                                        <td>{blog.short_content}</td>
                                        <td>{blog.full_content}</td>
                                        <td>{blog.author}</td>
                                        <td>{blog.status}</td>
                                        <td>{blog.post_image}</td>
                                        <td>{blog.published_at}</td>
                                        <td className="action-column">
                                            <Link
                                                to={`/blog/edit/${blog.blog_id}`}
                                                className="edit-btn"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    clickToShowModal(
                                                        blog.blog_id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BlogListing;
