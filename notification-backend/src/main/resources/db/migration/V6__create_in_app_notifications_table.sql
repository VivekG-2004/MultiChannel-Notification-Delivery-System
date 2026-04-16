CREATE TABLE in_app_notifications (
                                      id         BIGINT AUTO_INCREMENT PRIMARY KEY,
                                      client_id  BIGINT       NOT NULL,
                                      user_ref   VARCHAR(100) NOT NULL,
                                      title      VARCHAR(255),
                                      body       TEXT,
                                      is_read    TINYINT(1)   DEFAULT 0,
                                      created_at DATETIME     NOT NULL,
                                      INDEX idx_user_read (client_id, user_ref, is_read)
);