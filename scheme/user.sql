use girl;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id VARCHAR(128),
    celab_id INT,
    num_push INT,
    PRIMARY KEY (id)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;