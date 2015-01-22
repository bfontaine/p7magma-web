# -*- coding: UTF-8 -*-
# Most of this code is copied from a closed-source personal project. This file
# is part of p7magma-web and is thus under the MIT licence.

from flask import g, redirect, url_for, session
from magma.base import Student

def student():
    """
    Return the currently connected student
    """
    return getattr(g, 'student', None)


###############################################################################
# Redirections
###############################################################################

def _redirect_cond(cond, url_str, name):
    def _deco(fun):
        def _fun(*args, **kwargs):
            if cond():
                return redirect(url_for(url_str))
            return fun(*args, **kwargs)
        _fun.__name__ = fun.__name__
        return _fun
    _deco.__name__ = name
    return _deco

# decorator: redirect to /login if student is not logged in
logged_only = _redirect_cond(lambda: student() is None, 'login', 'logged_only')

# decorator: redirect to / if student is logged in
unlogged_only = _redirect_cond(lambda: student(), 'index', 'unlogged_only')


def redirect_for(s, code=302):
    """
    Shortcut for ``redirect(url_for(s), code)``.
    """
    return redirect(url_for(s), code)


###############################################################################
# Session management
###############################################################################

def form2session(form):
    fields = {}
    for field in ('firstname', 'lastname', 'year', 'password'):
        name = 'passwd' if field == 'password' else field
        fields[name] = form[field]
    session['student'] = fields

def session2student():
    if 'student' not in session:
        return None

    # the DNS resolution takes a lot of time. Don't know if it's my machine or
    # something else
    base_url = '194.254.199.51:2201'
    return Student(base_url=base_url, **session['student'])


###############################################################################
# Templates
###############################################################################

def setvar(name, value):
    """
    decorator to set a variable on 'g'
    """
    def _deco(fun):
        def _fun(*args, **kwargs):
            setattr(g, name, value)
            return fun(*args, **kwargs)

        _fun.__name__ = fun.__name__
        return _fun

    return _deco


# shortcut
title = lambda v: setvar('title', v)
