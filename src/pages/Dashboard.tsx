import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

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
  saved: boolean;
}

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedTemplates, setSavedTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    fetchSavedTemplates();
  }, [isAuthenticated, navigate]);

  const fetchSavedTemplates = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/3c229f16-9ba3-4b37-9e96-de4aaddee3da', {
        headers: {
          'X-User-Id': user?.id.toString() || ''
        }
      });
      const data = await response.json();
      setSavedTemplates(data.templates.filter((t: Template) => t.saved));
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить шаблоны',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (templateId: number) => {
    try {
      await fetch('https://functions.poehali.dev/3c229f16-9ba3-4b37-9e96-de4aaddee3da', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user?.id.toString() || ''
        },
        body: JSON.stringify({
          action: 'unsave',
          template_id: templateId
        })
      });

      setSavedTemplates(prev => prev.filter(t => t.id !== templateId));
      toast({
        title: 'Удалено',
        description: 'Шаблон удален из избранного',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить шаблон',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
      <nav className="border-b border-border glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Workflow" size={24} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">n8n Каталог</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Icon name="Home" size={18} className="mr-2" />
              Каталог
            </Button>
            <div className="flex items-center gap-3 px-4 py-2 glass-effect rounded-lg">
              <Icon name="User" size={18} className="text-primary" />
              <span className="font-medium">{user?.full_name || user?.email}</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gradient">Личный кабинет</h2>
          <p className="text-muted-foreground text-lg">
            Управляйте избранными шаблонами автоматизаций
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <Icon name="Loader2" size={64} className="mx-auto mb-4 text-primary animate-spin" />
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        ) : savedTemplates.length === 0 ? (
          <div className="text-center py-16 glass-effect rounded-2xl">
            <Icon name="Bookmark" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-semibold mb-2">Нет сохраненных шаблонов</h3>
            <p className="text-muted-foreground mb-6">
              Добавьте шаблоны в избранное из каталога
            </p>
            <Button onClick={() => navigate('/')} size="lg">
              <Icon name="Search" className="mr-2" size={18} />
              Перейти в каталог
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedTemplates.map((template) => (
              <Card 
                key={template.id}
                className="group hover:scale-105 transition-all duration-300 glass-effect border-2 hover:border-primary"
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
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleUnsave(template.id)}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
