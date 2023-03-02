-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT,
    "name" TEXT,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "avatar" TEXT NOT NULL DEFAULT '/defaultUserImage.webp',
    "emailVerified" DATETIME,
    "image" TEXT
);
INSERT INTO "new_User" ("avatar", "displayName", "email", "emailVerified", "id", "image", "name", "role") SELECT coalesce("avatar", '/defaultUserImage.webp') AS "avatar", "displayName", "email", "emailVerified", "id", "image", "name", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;