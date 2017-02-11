use girl;

DROP TABLE IF EXISTS contents;
CREATE TABLE contents (
    id INT NOT NULL AUTO_INCREMENT,
    celab_id INT,
    media_type CHAR(16),
    url VARCHAR(64),
    title  VARCHAR(64),
    image  VARCHAR(64),
    text  VARCHAR(256),
    content_date DATE,
    view_count INT,
    PRIMARY KEY (id),
    FOREIGN KEY (`celab_id`) REFERENCES `celab`(`id`)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE TRIGGER contents_on_insert BEFORE INSERT ON contents FOR EACH ROW SET NEW.content_date=NOW();

INSERT INTO contents (celab_id, media_type, view_count) values ('1', 'Twitter', 234);
INSERT INTO contents (celab_id, media_type, view_count) values ('1', 'instagram', 324);
INSERT INTO contents (celab_id, media_type, view_count) values ('2', 'Youtube', 654);