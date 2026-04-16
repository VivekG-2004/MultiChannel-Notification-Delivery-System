CREATE TABLE dead_letter_jobs (
                                  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
                                  original_job_id BIGINT    NOT NULL,
                                  client_id       BIGINT    NOT NULL,
                                  channel         ENUM('EMAIL', 'SMS', 'IN_APP', 'WEBHOOK'),
                                  recipient       VARCHAR(255),
                                  body            TEXT,
                                  failure_reason  TEXT,
                                  retry_count     INT,
                                  failed_at       DATETIME  NOT NULL,
                                  is_replayed     TINYINT(1) DEFAULT 0,
                                  replayed_at     DATETIME,
                                  is_discarded    TINYINT(1) DEFAULT 0
);