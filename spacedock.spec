# -*- mode: python -*-
from __future__ import print_function

import os
import platform
import sys
from os import path

root = path.join(path.realpath(os.getcwd()), 'spacedock')

html_path = path.join(root, 'html')
html = Tree(html_path, prefix='html')

image_path = path.join(root, 'images')
images = Tree(image_path, prefix='images', excludes=['*.xcf'])

a = Analysis(['bin/spacedock'],
             hiddenimports=[],
             hookspath=None,
             runtime_hooks=None)
pyz = PYZ(a.pure)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          html,
          images,
          icon=path.join(image_path, 'logomed.ico'),
          exclude_binaries=False,
          name='spacedock',
          debug=False,
          strip=None,
          upx=True,
          console=False )
