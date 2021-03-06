import React, { useState } from 'react';
import { Link, useLocation, Redirect } from 'react-router-dom';
import { FormGroup, TextField } from '@material-ui/core';
import {
  useDeletePostMutation,
  useEditPostMutation,
  useMeQuery,
  GetPostsByUserDocument,
} from '../../generated/graphql';

interface Props {
  post: any;
}

const Post: React.FC<Props> = ({ post }) => {
  const { data } = useMeQuery();
  const [deletePost, error] = useDeletePostMutation();
  const [editPost] = useEditPostMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  let location = useLocation();
  let user = data?.me;
  const author = post.user.username;
  let body = null;

  if (error && error.data?.deletePost === false) {
    return <Redirect to="/404" />;
  }

  const editCurrentPost = (post: any) => {
    setTitle(post.title);
    setDescription(post.description);
    setIsEditing(!isEditing);
  };

  const shortenPostDescription = (post: any) =>
    post.length > 55 ? `${post.substring(0, 55)}...` : post;

  if (data) {
    const path =
      location.pathname === '/'
        ? `/user/${author}/${post.user.id}/posts/${post.id}`
        : `${location.pathname}/${post.id}`;

    const authorValidation = author === data.me?.username;

    body = (
      <li key={post.id}>
        <div>
          {isEditing ? (
            <form
              className=""
              onSubmit={async (e) => {
                e.preventDefault();
                const response = await editPost({
                  variables: {
                    id: post.id,
                    title: title,
                    description: description,
                  },
                  refetchQueries: [
                    {
                      query: GetPostsByUserDocument,
                      variables: { userId: user?.id },
                    },
                  ],
                });

                if (response.data?.editPost === false) {
                  return <Redirect to="/404" />;
                } else {
                  console.log(`Edited Post ${post.id}`);
                }
                editCurrentPost(post);
              }}
            >
              <FormGroup>
                <TextField
                  label="Post Title"
                  variant="filled"
                  value={title}
                  color="primary"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <TextField
                  label="Post Description"
                  variant="filled"
                  value={description}
                  color="primary"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </FormGroup>
              <button className="commonBtn" type="submit">
                Edit Post
              </button>
            </form>
          ) : (
            <>
              <Link to={{ pathname: path }} className="link">
                <div className="post-link">
                  <h4>{post.title}</h4>
                  <h6>{shortenPostDescription(post.description)}</h6>
                </div>
              </Link>
              {location.pathname === '/' && (
                <Link to={{ pathname: `/user/${author}` }} className="link">
                  <h5>
                    <span className="post-title">Author:</span>
                    <span className="post-author">
                      {authorValidation ? <>Me</> : author}
                    </span>
                  </h5>
                </Link>
              )}
              {authorValidation && location.pathname !== '/' && (
                <button
                  className="commonBtn editBtn"
                  onClick={() => editCurrentPost(post)}
                >
                  Edit Post
                </button>
              )}
            </>
          )}

          {authorValidation && location.pathname !== '/' && (
            <button
              className="secondaryBtn delBtn"
              onClick={async (e) => {
                e.preventDefault();
                const response = await deletePost({
                  variables: {
                    id: post.id,
                  },
                  refetchQueries: [
                    {
                      query: GetPostsByUserDocument,
                      variables: { userId: user?.id },
                    },
                  ],
                });

                if (response.data?.deletePost === false) {
                  return <Redirect to="/404" />;
                }
              }}
            >
              Delete Post
            </button>
          )}
        </div>
      </li>
    );
  }

  return <>{body}</>;
};

export default Post;
