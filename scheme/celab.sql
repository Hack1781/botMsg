use girl;

DROP TABLE IF EXISTS celab;
CREATE TABLE celab (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(32),
    channel_key VARCHAR(32),
    PRIMARY KEY (id)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO celab (name, channel_key) values ('AOA', 'adfdfdf');
INSERT INTO celab (name, channel_key) values ('GD', 'adfdfdfdf');