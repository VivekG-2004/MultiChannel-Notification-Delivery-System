CREATE TABLE delivery_logs (
                               id           BIGINT AUTO_INCREMENT PRIMARY KEY,
                               job_id       BIGINT    NOT NULL,
                               attempt_no   INT       NOT NULL,
                               status       ENUM('SUCCESS', 'FAILURE'),
                               response     TEXT,
                               attempted_at DATETIME  NOT NULL,
                               FOREIGN KEY (job_id) REFERENCES notification_jobs(id),
                               INDEX idx_job_id (job_id)
);