import React from "react";
import PostSkeleton from "../skeleton/PostSkeleton";
import { POSTS } from "../../uilits/db/dummy";
import Post from "./Post";

const Posts = () => {
  const isLoading = false;
  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && POSTS?.length === 0 && (
        <p className="text-center my-4">No posts in this tab .Switch 👻</p>
      )}
      {!isLoading && POSTS && (
        <div>
          {POSTS.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
