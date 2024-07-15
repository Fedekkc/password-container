CREATE SCHEMA IF NOT EXISTS `GestaPass`;

USE `GestaPass`;

CREATE TABLE IF NOT EXISTS `users`(
`id_user` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
`name` TEXT NOT NULL,
`surname` TEXT NOT NULL,
`email` TEXT NOT NULL,
`password` TEXT NOT NULL,
`register_date` TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS `passwords`(
`id_password` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
`id_user` INT NOT NULL,
`iconURI` VARCHAR(128),
`service` TEXT NOT NULL,
`password` TEXT NOT NULL,
`register_date` TEXT NOT NULL,
FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`);
SELECT * FROM users;
select * from passwords;