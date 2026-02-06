CREATE TABLE `messages_session_index` (
	`sessionId` varchar(128) NOT NULL,
	CONSTRAINT `messages_session_index_sessionId_unique` UNIQUE(`sessionId`)
);
--> statement-breakpoint
ALTER TABLE `messages` DROP FOREIGN KEY `messages_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `messages` ADD `sessionId` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `messages` DROP COLUMN `userId`;