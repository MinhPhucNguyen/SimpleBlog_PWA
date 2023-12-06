/*
 * @author    Tigren Solutions <info@tigren.com>
 * @copyright Copyright (c) 2023 Tigren Solutions <https://www.tigren.com>. All rights reserved.
 * @license   Open Software License ("OSL") v. 3.0
 *
 */

import React from 'react';
import './CreateBlog.css';

const CreateBlog = () => {
    return (
        <div>
            <div className="blog-create">
                <h1>
                    <strong>Create New Blog</strong>
                </h1>
                <a href="/blog/list" className="back-btn">
                    Back
                </a>
                <div className="blog-create-form">
                    <form>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Title"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="short_content">Short Content</label>
                            <textarea
                                id="short_content"
                                name="short_content"
                                placeholder="Short Content"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="full_content">Full Content</label>
                            <textarea
                                id="full_content"
                                name="full_content"
                                placeholder="Full Content"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="author">Author</label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                placeholder="Author"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select id="status" name="status">
                                <option value="1">Enabled</option>
                                <option value="0">Disabled</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="save-btn">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateBlog;
