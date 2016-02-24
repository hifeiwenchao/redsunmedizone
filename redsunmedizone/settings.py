# -*- coding: utf-8 -*-

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


SECRET_KEY = '8dcbti3-9q^&e-#vu0**#y0jtf5ne)tqf)9a7plm98917%(lm0'

DEBUG = True

ROOT_URLCONF = 'urls'

ALLOWED_HOSTS = '*'

# Session超时设置
SESSION_COOKIE_AGE = 604800
SESSION_ENGINE = 'redis_sessions.session'
SESSION_REDIS_HOST = 'localhost'
SESSION_REDIS_PORT = 6379
SESSION_REDIS_DB = 0
SESSION_REDIS_PASSWORD = ''
SESSION_REDIS_PREFIX = 'session'

#配置caches
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/5",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

#celery配置
from celery.schedules import crontab

CELERYBEAT_SCHEDULE = {
    'fetch_email': {
        'task':'mail.tasks.main_fetch_email',
        'schedule': crontab(minute='*/4'),
        'args': (),
    },
    'process_task': {
        'task':'mail.tasks.process_task',
        'schedule': crontab(minute='*/5'),
        'args': (),
    },
}


CELERY_ACCEPT_CONTENT=['pickle']

BROKER_URL = 'redis://127.0.0.1:6379/0'
CELERY_RESULT_BACKEND = "redis://127.0.0.1:6379/1"
CELERYD_CONCURRENCY = 4
CELERYD_MAX_TASKS_PER_CHILD = 5
CELERYD_POOL_RESTARTS = True
BROKER_CONNECTION_TIMEOUT = 10
CELERY_TASK_RESULT_EXPIRES = 3600


INSTALLED_APPS = (
    'django_jinja',
    'django.contrib.sessions',
    'django.contrib.staticfiles',
    'crm',
    'mail',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    #'django.middleware.cache.CacheMiddleware',
    #'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'middlewares.AppclicationMiddleware',
)


TEMPLATES = [
    {
        "BACKEND": "django_jinja.backend.Jinja2",
        'DIRS': [
            os.path.join(os.path.dirname(__file__), 'templates').replace('\\', '/'),
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            # Match the template names ending in .html but not the ones in the admin folder.
            "match_extension": ".html",
            "match_regex": r"^(?!admin/).*",
            "app_dirname": "templates",
            # Can be set to "jinja2.Undefined" or any other subclass.
            "undefined": None,
            "newstyle_gettext": True,
            "extensions": [
                "jinja2.ext.do",
                "jinja2.ext.loopcontrols",
                "jinja2.ext.with_",
                "jinja2.ext.i18n",
                "jinja2.ext.autoescape",
                "django_jinja.builtins.extensions.CsrfExtension",
                "django_jinja.builtins.extensions.CacheExtension",
                "django_jinja.builtins.extensions.TimezoneExtension",
                "django_jinja.builtins.extensions.UrlsExtension",
                "django_jinja.builtins.extensions.StaticFilesExtension",
                "django_jinja.builtins.extensions.DjangoFiltersExtension",
            ],
            "autoescape": True,
            "auto_reload":True,
            "translation_engine": "django.utils.translation",
        }
    },
]


if DEBUG:
    DB_HOST = '127.0.0.1'
    DB_PASS = 'a1s2d3f4'
else:
    DB_HOST = '10.66.123.236'
    DB_PASS = 'a1s2d3f4g5'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'crm', 
        'USER': 'root',
        'PASSWORD': DB_PASS,
        'HOST': DB_HOST, 
        'PORT': '3306', 
    },
     'website': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'rsmedizone', 
        'USER': 'root',
        'PASSWORD': DB_PASS,
        'HOST': DB_HOST, 
        'PORT': '3306', 
    },
}


#日志在中间件处理,收集到所有信息
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/soft/log/debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
        'django.db.backends': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'
'''
TIME_ZONE = 'Asia/Shanghai'#'UTC'
'''
USE_I18N = True

USE_L10N = True

USE_TZ = True


STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    #'django.contrib.staticfiles.finders.DefaultStorageFinder',
)


STATICFILES_DIRS = (
    os.path.join(os.path.dirname(__file__), 'static').replace('\\', '/'),
)


STATIC_URL = '/static/'
if DEBUG:
    STATIC_ROOT = os.getcwd()
else:
    STATIC_ROOT = '/soft/static_crm'



