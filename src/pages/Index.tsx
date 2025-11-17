import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Template {
  id: number;
  title: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  icon: string;
  tags: string[];
  complexity: 'easy' | 'medium' | 'hard';
}

const templates: Template[] = [
  {
    id: 1,
    title: 'Автоматизация Email-маркетинга',
    description: 'Автоматическая отправка персонализированных email-кампаний с аналитикой',
    category: 'Маркетинг',
    rating: 4.8,
    reviews: 234,
    icon: 'Mail',
    tags: ['Email', 'CRM', 'Analytics'],
    complexity: 'easy'
  },
  {
    id: 2,
    title: 'Синхронизация данных CRM',
    description: 'Двусторонняя синхронизация контактов между CRM системами',
    category: 'CRM',
    rating: 4.9,
    reviews: 189,
    icon: 'Users',
    tags: ['CRM', 'Sync', 'Contacts'],
    complexity: 'medium'
  },
  {
    id: 3,
    title: 'Обработка заказов в E-commerce',
    description: 'Автоматическая обработка заказов от получения до доставки',
    category: 'E-commerce',
    rating: 4.7,
    reviews: 312,
    icon: 'ShoppingCart',
    tags: ['Orders', 'Shop', 'Automation'],
    complexity: 'medium'
  },
  {
    id: 4,
    title: 'Мониторинг социальных сетей',
    description: 'Отслеживание упоминаний бренда и автоматические отчеты',
    category: 'Маркетинг',
    rating: 4.6,
    reviews: 156,
    icon: 'MessageCircle',
    tags: ['Social', 'Monitoring', 'Reports'],
    complexity: 'easy'
  },
  {
    id: 5,
    title: 'Генерация отчетов с AI',
    description: 'Создание аналитических отчетов с помощью искусственного интеллекта',
    category: 'Аналитика',
    rating: 5.0,
    reviews: 421,
    icon: 'Brain',
    tags: ['AI', 'Reports', 'Analytics'],
    complexity: 'hard'
  },
  {
    id: 6,
    title: 'Управление задачами команды',
    description: 'Автоматическое распределение и отслеживание задач',
    category: 'Продуктивность',
    rating: 4.8,
    reviews: 267,
    icon: 'ListChecks',
    tags: ['Tasks', 'Team', 'Productivity'],
    complexity: 'easy'
  },
  {
    id: 7,
    title: 'Обработка документов',
    description: 'Автоматическая обработка и классификация документов',
    category: 'Документы',
    rating: 4.5,
    reviews: 198,
    icon: 'FileText',
    tags: ['Documents', 'OCR', 'Classification'],
    complexity: 'hard'
  },
  {
    id: 8,
    title: 'Резервное копирование данных',
    description: 'Автоматическое создание бэкапов в облачные хранилища',
    category: 'Безопасность',
    rating: 4.9,
    reviews: 345,
    icon: 'Database',
    tags: ['Backup', 'Security', 'Cloud'],
    complexity: 'medium'
  }
];

const categories = ['Все', 'Маркетинг', 'CRM', 'E-commerce', 'Аналитика', 'Продуктивность', 'Документы', 'Безопасность'];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews'>('rating');

  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'Все' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : b.reviews - a.reviews);

  const complexityColors = {
    easy: 'bg-green-500/10 text-green-400 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    hard: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  const complexityLabels = {
    easy: 'Легко',
    medium: 'Средне',
    hard: 'Сложно'
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-purple-blue opacity-20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="container relative mx-auto px-4 py-20">
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 glass-effect rounded-2xl">
                <Icon name="Workflow" size={48} className="text-primary" />
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-6 text-gradient">
              Каталог n8n шаблонов
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Готовые решения для автоматизации бизнес-процессов. Экономьте время и масштабируйте свой бизнес.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-12 space-y-6 animate-scale-in">
            <div className="relative">
              <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Поиск по названию, описанию или тегам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg glass-effect border-2"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all duration-300 hover:scale-105"
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-between glass-effect rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Filter" size={20} />
                <span>Найдено: {filteredTemplates.length} шаблонов</span>
              </div>
              <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as 'rating' | 'reviews')} className="w-auto">
                <TabsList>
                  <TabsTrigger value="rating" className="gap-2">
                    <Icon name="Star" size={16} />
                    По рейтингу
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="gap-2">
                    <Icon name="MessageSquare" size={16} />
                    По отзывам
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {filteredTemplates.map((template, index) => (
              <Card 
                key={template.id} 
                className="group hover:scale-105 transition-all duration-300 glass-effect border-2 hover:border-primary cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <Icon name={template.icon} size={32} className="text-primary" />
                    </div>
                    <Badge className={complexityColors[template.complexity]}>
                      {complexityLabels[template.complexity]}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {template.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{template.rating}</span>
                      <span className="text-muted-foreground text-sm">({template.reviews})</span>
                    </div>
                    <Button size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon name="Download" size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <Icon name="SearchX" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 border-t border-border">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 glass-effect rounded-2xl hover:scale-105 transition-transform">
            <Icon name="Zap" size={48} className="mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">Быстрая интеграция</h3>
            <p className="text-muted-foreground">
              Готовые решения запускаются за минуты
            </p>
          </div>
          <div className="text-center p-8 glass-effect rounded-2xl hover:scale-105 transition-transform">
            <Icon name="Shield" size={48} className="mx-auto mb-4 text-secondary" />
            <h3 className="text-2xl font-bold mb-2">Проверено сообществом</h3>
            <p className="text-muted-foreground">
              Все шаблоны протестированы пользователями
            </p>
          </div>
          <div className="text-center p-8 glass-effect rounded-2xl hover:scale-105 transition-transform">
            <Icon name="Rocket" size={48} className="mx-auto mb-4 text-accent" />
            <h3 className="text-2xl font-bold mb-2">Масштабируемость</h3>
            <p className="text-muted-foreground">
              Легко адаптируются под любые объемы
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
