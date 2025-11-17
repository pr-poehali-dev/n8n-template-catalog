'''
Business: Template catalog operations (list, save/unsave, ratings)
Args: event with httpMethod, queryStringParameters, body, headers (X-User-Id for auth)
Returns: Templates list, saved status, or rating confirmation
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            headers = event.get('headers', {})
            user_id = headers.get('X-User-Id') or headers.get('x-user-id')
            
            cursor.execute("""
                SELECT 
                    t.id, t.title, t.description, t.category, t.icon, t.complexity,
                    COALESCE(AVG(tr.rating), 0) as avg_rating,
                    COUNT(DISTINCT tr.id) as review_count,
                    ARRAY_AGG(DISTINCT tt.tag) FILTER (WHERE tt.tag IS NOT NULL) as tags
                FROM templates t
                LEFT JOIN template_ratings tr ON t.id = tr.template_id
                LEFT JOIN template_tags tt ON t.id = tt.template_id
                GROUP BY t.id, t.title, t.description, t.category, t.icon, t.complexity
                ORDER BY avg_rating DESC
            """)
            
            templates = cursor.fetchall()
            
            saved_template_ids = []
            if user_id:
                cursor.execute("SELECT template_id FROM user_saved_templates WHERE user_id = %s", (user_id,))
                saved_template_ids = [row['template_id'] for row in cursor.fetchall()]
            
            result = []
            for template in templates:
                result.append({
                    'id': template['id'],
                    'title': template['title'],
                    'description': template['description'],
                    'category': template['category'],
                    'icon': template['icon'],
                    'complexity': template['complexity'],
                    'rating': round(float(template['avg_rating']), 1),
                    'reviews': template['review_count'],
                    'tags': template['tags'] if template['tags'] else [],
                    'saved': template['id'] in saved_template_ids
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'templates': result})
            }
        
        elif method == 'POST':
            headers = event.get('headers', {})
            user_id = headers.get('X-User-Id') or headers.get('x-user-id')
            
            if not user_id:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Authentication required'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            template_id = body_data.get('template_id')
            
            if action == 'save':
                cursor.execute(
                    "INSERT INTO user_saved_templates (user_id, template_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                    (user_id, template_id)
                )
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'saved': True})
                }
            
            elif action == 'unsave':
                cursor.execute(
                    "UPDATE user_saved_templates SET saved_at = NULL WHERE user_id = %s AND template_id = %s",
                    (user_id, template_id)
                )
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'saved': False})
                }
            
            elif action == 'rate':
                rating = body_data.get('rating')
                review = body_data.get('review', '')
                
                if not rating or rating < 1 or rating > 5:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Rating must be between 1 and 5'})
                    }
                
                cursor.execute(
                    """INSERT INTO template_ratings (template_id, user_id, rating, review) 
                       VALUES (%s, %s, %s, %s) 
                       ON CONFLICT (template_id, user_id) 
                       DO UPDATE SET rating = EXCLUDED.rating, review = EXCLUDED.review""",
                    (template_id, user_id, rating, review)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True})
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid action'})
                }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    finally:
        cursor.close()
        conn.close()
