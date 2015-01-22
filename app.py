# -*- coding: UTF-8 -*-

from flask import Flask, render_template, g, request, session
from flask.ext.assets import Environment, Bundle
from webassets_iife import IIFE

from mgweb.flaskutils import logged_only, unlogged_only, redirect_for, title, \
    form2session, session2student

app = Flask(__name__)
app.config.from_pyfile('mgweb.cfg', silent=True)

# assets
assets = Environment(app)

js_filters = []
css_filters = []

if not app.config['DEBUG']:
    js_filters.concat([IIFE, 'closure_js'])
    css_filters.concat(['cssmin'])

# - JS
js = Bundle(
    # Bootstrap/Bootflat
    'js/vendor/jquery.js',
    'js/vendor/html5shiv.js',
    #'js/vendor/icheck.min.js',
    'js/vendor/bootstrap.min.js',
    'js/vendor/angular.js',
    # Our JS
    'js/app.js',
    filters=js_filters,
    output='js/m2.js')
assets.register('js_all', js)

# - CSS
css = Bundle(
    # Bootstrap/Bootflat
    'css/bootstrap.min.css',
    'css/bootflat.min.css',
    # Our JS
    'css/app.css',
    filters=css_filters,
    output='css/m2.css')
assets.register('css_all', css)


@app.before_request
def set_g_locale():
    # this is the only one which makes sense here since the content is in
    # French
    setattr(g, 'locale', 'fr')

@app.before_request
def set_g_student():
    if '/static/' not in request.path:
        setattr(g, 'student', session2student())

@app.route('/')
@unlogged_only
def index():
    # no homepage for now
    return redirect_for('login')


@app.route('/courses', methods=['GET', 'POST'])
@logged_only
def courses():
    return render_template('courses.html')


@app.route('/login', methods=['GET', 'POST'])
@title('Login')
@unlogged_only
def login():
    if request.method == 'POST':
        form2session(request.form)
        return redirect_for('courses')
    return render_template('login.html')


@app.route('/logout', methods=['POST'])
@logged_only
def logout():
    session.clear()
    return redirect_for('index')
