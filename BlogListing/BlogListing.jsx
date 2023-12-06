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

const BlogListing = () => {
    const [successMessage, setSuccessMessage] = useState('');

    const { loading, data } = useQuery(BLOG_LISTING, {
        fetchPolicy: 'cache-only',
        nextFetchPolicy: 'cache-and-network'
    });

    const blogs = data.getBlogs;

    const [deleteBlogMutation] = useMutation(DELETE_BLOG);
    const deleteBlog = async (id) => {
        console.log(id);
        try {
            const { data } = await deleteBlogMutation({
                variables: {
                    id: id
                },
                refetchQueries: [{ query: BLOG_LISTING }]
            });
            if (data.deleteBlog.message) {
                setSuccessMessage(data.deleteBlog.message);
            }
            setTimeout(() => {
                setSuccessMessage('');
            }, 2000);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="blog-listing">
                <h1>
                    <strong>Blog Listing</strong>
                </h1>
                {successMessage && (
                    <div className="success-message">{successMessage}</div>
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
                            {/*{console.log(blogs)}*/}
                            {blogs.map((blog, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{blog.blog_id}</td>
                                        <td>{blog.title}</td>
                                        <td>{blog.short_content}</td>
                                        <td>{blog.full_content}</td>
                                        <td>{blog.author}</td>
                                        <td>{blog.status}</td>
                                        <td>{blog.post_image}</td>
                                        <td>{blog.published_at}</td>
                                        <td className="action-column">
                                            <a href="#" className="edit-btn">
                                                Edit
                                            </a>
                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteBlog(blog.blog_id)
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
