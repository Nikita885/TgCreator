import os
import sys

sys.path.append('/path/to/your/project')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Bd_Creator.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
