CREATE TABLE clients (
                         id         BIGINT AUTO_INCREMENT PRIMARY KEY,
                         name       VARCHAR(100) NOT NULL,
                         email      VARCHAR(100) NOT NULL UNIQUE,
                         api_key    VARCHAR(64)  NOT NULL UNIQUE,
                         plan       ENUM('FREE', 'PAID') DEFAULT 'FREE',
                         is_active  TINYINT(1)   DEFAULT 1,
                         created_at DATETIME     NOT NULL,
                         INDEX idx_api_key (api_key)
);