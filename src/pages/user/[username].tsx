import styles from "./index.module.scss";
import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { PostList } from "../../components/PostList/PostList";

interface UserPagePropsType {
  username: string;
}

export default function UserPage({ username }: UserPagePropsType) {
  const { data: postsData, refetch } = api.user.getUserRecentPosts.useQuery(
    { page: 0, username },
    { refetchOnReconnect: false, refetchOnWindowFocus: false }
  );

  if (!postsData) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>Grumbler</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PostList
        posts={postsData.map(
          ({
            id,
            createdAt,
            userId,
            user: { avatar: userImage, displayName, name: username },
            content,
            _count,
            views,
            extendedContent,
            postLikes,
          }) => ({
            id,
            createdAt: createdAt.toDateString(),
            userId: userId,
            userImage: userImage,
            displayName: displayName ?? "",
            username: username ?? "",
            content: content,
            commentsCount: _count.comments,
            likesCount: _count.postLikes,
            forwardsCount: _count.forwards,
            viewsCount: views,
            liked: postLikes.length !== 0,
            hasExtendedContent: extendedContent !== null,
          })
        )}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {
    username: query.username,
  },
});