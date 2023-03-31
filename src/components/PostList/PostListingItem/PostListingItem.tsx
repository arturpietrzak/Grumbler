import Link from "next/link";
import { PostInfoHeader } from "../../Post/PostFragments/PostInfoHeader/PostInfoHeader";
import { PostReactionsFooter } from "../../Post/PostFragments/PostReactionsFooter/PostReactionsFooter";
import { api } from "../../../utils/api";
import { useState } from "react";
import { Container, Stack, Text } from "@mantine/core";
import { Content } from "../../Post/Content/Content";

export interface PostListingItemProps {
  id: string;
  createdAt: string;
  userId: string;
  userImage: string;
  displayName: string;
  username: string;
  content: string;
  commentsCount: number;
  likesCount: number;
  liked: boolean;
  hasExtendedContent: boolean;
  likeButtonActive: boolean;
  onReportClick: () => void;
  onEditClick?: () => void;
  onRemoveClick?: () => void;
}

export function PostListingItem({
  id,
  createdAt,
  userImage,
  displayName,
  username,
  content,
  commentsCount,
  likesCount,
  hasExtendedContent,
  liked,
  likeButtonActive,
  onReportClick,
  onEditClick,
  onRemoveClick,
}: PostListingItemProps) {
  const likePostMutation = api.post.like.useMutation();
  const unlikePostMutation = api.post.unlike.useMutation();
  const [isLiked, setIsLiked] = useState<boolean>(liked);

  return (
    <Stack
      sx={(t) => ({
        backgroundColor: t.colorScheme === "dark" ? t.colors.dark[6] : t.white,
        borderRadius: t.radius.sm,
        border: `0.0625rem solid ${
          t.colorScheme === "dark" ? t.colors.dark[4] : t.colors.gray[4]
        }`,
        position: "relative",
        overflow: "hidden",
      })}
      spacing="sm"
    >
      <Stack p={16}>
        <PostInfoHeader
          imageUrl={userImage}
          displayName={displayName}
          username={username}
          createdAt={createdAt}
        />
        <Container w="100%" p={0}>
          <Content content={content} />
          {hasExtendedContent && <Text size="xs">Click to read more...</Text>}
        </Container>
        <PostReactionsFooter
          likesCount={likesCount - Number(liked) + Number(isLiked)}
          commentsCount={commentsCount}
          liked={isLiked}
          onLikeClick={() => {
            if (!likeButtonActive) {
              return;
            }

            if (isLiked) {
              unlikePostMutation.mutate({ postId: id });
            } else {
              likePostMutation.mutate({ postId: id });
            }

            setIsLiked((prev) => !prev);
          }}
          onReportClick={onReportClick}
          onEditClick={onEditClick}
          onRemoveClick={onRemoveClick}
        />
      </Stack>
      <Link
        href={`/post/${id}`}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />
    </Stack>
  );
}
