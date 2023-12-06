/*
 * @author    Tigren Solutions <info@tigren.com>
 * @copyright Copyright (c) 2023 Tigren Solutions <https://www.tigren.com>. All rights reserved.
 * @license   Open Software License ("OSL") v. 3.0
 *
 */

import React from 'react';
import './CreateBlog.css';
import { useQuery, useMutation } from '@apollo/client';
import {
    BLOG_LISTING,
    CREATE_BLOG,
    UPDATE_BLOG,
    GET_BLOG_BY_ID
} from '../../../graphql/blogList.gql';
import { CATEGORY_LISTING } from '../../../graphql/categoryList.gql';
import { useParams } from 'react-router-dom';
import { log } from 'util';

const CreateBlog = () => {
    const params = useParams();
    const blogId = params.blog_id ? params.blog_id : '';
    const { data: categoryData } = useQuery(CATEGORY_LISTING, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-and-network'
    });
    const { data: blogData } = useQuery(GET_BLOG_BY_ID, {
        variables: {
            id: blogId
        }
    });
    const [createBlogMutation] = useMutation(CREATE_BLOG);
    const [updateBlogMutation] = useMutation(UPDATE_BLOG);

    const blog = blogData ? blogData.getBlogById : {};
    const categories = categoryData ? categoryData.getCategories : [];

    const createNewBlog = async (e) => {
        e.preventDefault();
        try {
            const { data: blogDataCreated } = await createBlogMutation({
                variables: {
                    input: {
                        title: e.target.title.value,
                        category_id: e.target.category.value,
                        short_content: e.target.short_content.value,
                        full_content: e.target.full_content.value,
                        author: e.target.author.value,
                        status: e.target.status.value
                    }
                },
                refetchQueries: [{ query: BLOG_LISTING }]
            });
            window.location.href = '/blog/list';
        } catch (error) {
            console.log(error);
        }
    };

    const updateBlog = async (e) => {
        e.preventDefault();
        try {
            const { data: blogUpdated } = await updateBlogMutation({
                variables: {
                    id: blogId,
                    input: {
                        title: e.target.title.value,
                        category_id: e.target.category.value,
                        short_content: e.target.short_content.value,
                        full_content: e.target.full_content.value,
                        author: e.target.author.value,
                        status: e.target.status.value
                    }
                },
                refetchQueries: [{ query: BLOG_LISTING }]
            });
            window.location.href = '/blog/list';
            console.log(blogUpdated);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="blog-create">
                <h1>
                    <strong>
                        {blogId ? `Update Blog ${blogId}` : 'Create New Blog'}
                    </strong>
                </h1>
                <a href="/blog/list" className="back-btn">
                    Back
                </a>
                <div className="blog-create-form">
                    <form
                        method="POST"
                        onSubmit={(e) => {
                            if (blogId) {
                                updateBlog(e);
                            } else {
                                createNewBlog(e);
                            }
                        }}
                    >
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Title"
                                defaultValue={blog ? blog.title : 'no content'}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select id="category" name="category">
                                {categories.map((category) => {
                                    return (
                                        <option
                                            key={category.category_id}
                                            value={category.category_id}
                                            selected={
                                                blog.category_id ===
                                                category.category_id
                                            }
                                        >
                                            {category.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="short_content">Short Content</label>
                            <textarea
                                id="short_content"
                                name="short_content"
                                placeholder="Short Content"
                                defaultValue={blog ? blog.short_content : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="full_content">Full Content</label>
                            <textarea
                                id="full_content"
                                name="full_content"
                                placeholder="Full Content"
                                defaultValue={blog ? blog.full_content : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="author">Author</label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                placeholder="Author"
                                defaultValue={blog ? blog.author : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select id="status" name="status">
                                <option value="1" selected={blog.status === 1}>
                                    Enabled
                                </option>
                                <option value="0" selected={blog.status === 0}>
                                    Disabled
                                </option>
                            </select>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="save-btn">
                                {blogId ? 'Save Changes' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateBlog;
