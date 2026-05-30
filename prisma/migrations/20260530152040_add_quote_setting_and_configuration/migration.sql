INSERT INTO Setting
    (name, enabled, createdAt, updatedAt)
    VALUES ('Send Quotes', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO Configuration
    (name, value, createdAt, updatedAt) 
    VALUES ('Quote CRON', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
