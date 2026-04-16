CREATE TABLE client_usage (
                              id          BIGINT AUTO_INCREMENT PRIMARY KEY,
                              client_id   BIGINT NOT NULL,
                              usage_month DATE   NOT NULL,
                              total_sent  INT    DEFAULT 0,
                              UNIQUE KEY uq_client_month (client_id, usage_month)
);