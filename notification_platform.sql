CREATE DATABASE notification_platform;
USE notification_platform;

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

CREATE TABLE notification_jobs (
                                   id            BIGINT AUTO_INCREMENT PRIMARY KEY,
                                   client_id     BIGINT       NOT NULL,
                                   template_id   BIGINT,
                                   channel       ENUM('EMAIL', 'SMS', 'IN_APP', 'WEBHOOK'),
                                   recipient     VARCHAR(255) NOT NULL,
                                   subject       VARCHAR(255),
                                   body          TEXT         NOT NULL,
                                   status        ENUM('PENDING','RUNNING','COMPLETED','RETRYING','FAILED') DEFAULT 'PENDING',
                                   retry_count   INT          DEFAULT 0,
                                   max_retries   INT          DEFAULT 4,
                                   next_retry_at DATETIME,
                                   scheduled_at  DATETIME,
                                   error_message TEXT,
                                   created_at    DATETIME     NOT NULL,
                                   processed_at  DATETIME,
                                   version       INT          DEFAULT 0,
                                   FOREIGN KEY (client_id) REFERENCES clients(id),
                                   INDEX idx_status_retry (status, next_retry_at),
                                   INDEX idx_client_status (client_id, status)
);

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

CREATE TABLE client_usage (
                              id          BIGINT AUTO_INCREMENT PRIMARY KEY,
                              client_id   BIGINT NOT NULL,
                              usage_month DATE   NOT NULL,
                              total_sent  INT    DEFAULT 0,
                              UNIQUE KEY uq_client_month (client_id, usage_month)
);