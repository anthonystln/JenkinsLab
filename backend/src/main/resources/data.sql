INSERT INTO users (name, email, password, role, status)
VALUES ('Anthony', 'anthony@example.com', '$2a$12$y74rZ5ag.BPesLY8hHI0uuSj9HrYpaE5xFbS8atzmr4c8Rgl0E8t.', 'ADMIN', 'ACTIVE');

-- Quelques utilisateurs fictifs
INSERT INTO users (name, email, password, role, status)
VALUES ('Alice', 'alice@example.com', '$2a$12$y74rZ5ag.BPesLY8hHI0uuSj9HrYpaE5xFbS8atzmr4c8Rgl0E8t.', 'USER', 'ACTIVE');

INSERT INTO users (name, email, password, role, status)
VALUES ('Bob', 'bob@example.com', '$2a$12$7E7xPfw2z6Yg3MvzqSVZeeruGK2Q6JLEtiJWJlWcHDlhsdYFyUC0K', 'USER', 'BANNED');

INSERT INTO users (name, email, password, role, status)
VALUES ('Charlie', 'charlie@example.com', '$2a$12$y74rZ5ag.BPesLY8hHI0uuSj9HrYpaE5xFbS8atzmr4c8Rgl0E8t.', 'MANAGER', 'ACTIVE');

INSERT INTO users (name, email, password, role, status)
VALUES ('Diana', 'diana@example.com', '$2a$12$7E7xPfw2z6Yg3MvzqSVZeeruGK2Q6JLEtiJWJlWcHDlhsdYFyUC0K', 'USER', 'PENDING');

INSERT INTO users (name, email, password, role, status)
VALUES ('Eve', 'eve@example.com', '$2a$12$7E7xPfw2z6Yg3MvzqSVZeeruGK2Q6JLEtiJWJlWcHDlhsdYFyUC0K', 'USER', 'ACTIVE');