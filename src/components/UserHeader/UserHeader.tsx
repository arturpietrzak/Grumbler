import Image from "next/image";
import styles from "./UserHeader.module.scss";

interface UserHeaderProps {
  username: string;
  imageUrl: string;
  displayName: string;
  bio?: string;
  joinedAt: string;
  followers: number;
  following: number;
  isUserFollowing: boolean;
  onFollowClick: () => void;
  posts: number;
}

export function UserHeader({
  username,
  imageUrl,
  displayName,
  bio,
  joinedAt,
  followers,
  following,
  posts,
  onFollowClick,
  isUserFollowing,
}: UserHeaderProps) {
  return (
    <div className={styles.userHeader}>
      <div className={styles.infoImageContainer}>
        <div className={styles.userInfo}>
          <span className={styles.displayName}>{displayName}</span>
          <span className={styles.username}>{username}</span>
          <span className={styles.joinedAt}>Since {joinedAt}</span>
          <button className={styles.followButton} onClick={onFollowClick}>
            {isUserFollowing ? "Following" : "Follow"}
          </button>
        </div>
        <Image
          width={96}
          height={96}
          src={imageUrl}
          alt="User image"
          className={styles.image}
        />
      </div>
      {bio && <div className={styles.bio}>{bio}</div>}
      <div className={styles.followerInfo}>
        <span className={styles.followers}>{followers} followers</span>
        <span className={styles.following}>{following} following</span>
        <span className={styles.posts}>{posts} posts</span>
      </div>
    </div>
  );
}