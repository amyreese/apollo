# Copyright 2014 John Reese
# Licensed under the MIT license

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

from os import path
from platform import system

# Determine if we're running from local, site-packages, or bundle.
# If this file exists on the filesystem, then we're most likely running from
# site-packages or similar.  If this file does not exist on the filesystem,
# then we're most likely running from a pyinstaller bundle, so non-python
# files will be one directory higher in the hierarchy than otherwise.
if path.exists(__file__):
    ROOT = path.realpath(path.dirname(__file__))
else:
    ROOT = path.realpath(path.dirname(path.dirname(__file__)))


# Determine where the user's "home" directory is, so we can put their config
# files in the place that makes the most sense for the platform.
if system() == 'Windows':
    HOME = path.expanduser("~/apollo")
elif system() == 'Darwin':
    HOME = path.expanduser("~/.apollo")
else:
    HOME = path.expanduser("~/.apollo")
