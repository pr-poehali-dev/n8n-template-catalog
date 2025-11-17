CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS templates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    icon VARCHAR(50),
    complexity VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS template_tags (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES templates(id),
    tag VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS template_ratings (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES templates(id),
    user_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(template_id, user_id)
);

CREATE TABLE IF NOT EXISTS user_saved_templates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    template_id INTEGER REFERENCES templates(id),
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, template_id)
);

CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_template_ratings_template_id ON template_ratings(template_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_templates_user_id ON user_saved_templates(user_id);

INSERT INTO templates (title, description, category, icon, complexity) VALUES
('Автоматизация Email-маркетинга', 'Автоматическая отправка персонализированных email-кампаний с аналитикой', 'Маркетинг', 'Mail', 'easy'),
('Синхронизация данных CRM', 'Двусторонняя синхронизация контактов между CRM системами', 'CRM', 'Users', 'medium'),
('Обработка заказов в E-commerce', 'Автоматическая обработка заказов от получения до доставки', 'E-commerce', 'ShoppingCart', 'medium'),
('Мониторинг социальных сетей', 'Отслеживание упоминаний бренда и автоматические отчеты', 'Маркетинг', 'MessageCircle', 'easy'),
('Генерация отчетов с AI', 'Создание аналитических отчетов с помощью искусственного интеллекта', 'Аналитика', 'Brain', 'hard'),
('Управление задачами команды', 'Автоматическое распределение и отслеживание задач', 'Продуктивность', 'ListChecks', 'easy'),
('Обработка документов', 'Автоматическая обработка и классификация документов', 'Документы', 'FileText', 'hard'),
('Резервное копирование данных', 'Автоматическое создание бэкапов в облачные хранилища', 'Безопасность', 'Database', 'medium');

INSERT INTO template_tags (template_id, tag) VALUES
(1, 'Email'), (1, 'CRM'), (1, 'Analytics'),
(2, 'CRM'), (2, 'Sync'), (2, 'Contacts'),
(3, 'Orders'), (3, 'Shop'), (3, 'Automation'),
(4, 'Social'), (4, 'Monitoring'), (4, 'Reports'),
(5, 'AI'), (5, 'Reports'), (5, 'Analytics'),
(6, 'Tasks'), (6, 'Team'), (6, 'Productivity'),
(7, 'Documents'), (7, 'OCR'), (7, 'Classification'),
(8, 'Backup'), (8, 'Security'), (8, 'Cloud');

INSERT INTO users (email, password_hash, full_name) VALUES
('demo@example.com', '$2b$10$rKZrF3P7gVGQHLxKHXkNx.OQVxqvVz7FQyxC8hY5WZJ0LQ7xXjqZi', 'Demo User');
