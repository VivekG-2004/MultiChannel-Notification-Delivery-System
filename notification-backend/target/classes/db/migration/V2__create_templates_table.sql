CREATE TABLE templates (
                           id         BIGINT AUTO_INCREMENT PRIMARY KEY,
                           client_id  BIGINT       NOT NULL,
                           name       VARCHAR(100) NOT NULL,
                           channel    ENUM('EMAIL', 'SMS', 'IN_APP', 'WEBHOOK'),
                           subject    VARCHAR(255),
                           body       TEXT         NOT NULL,
                           created_at DATETIME     NOT NULL,
                           FOREIGN KEY (client_id) REFERENCES clients(id)
);