# -*- mode: python -*-
from __future__ import print_function

import os
import platform
import sys
from os import path

cwd = path.realpath(os.getcwd())
root = path.join(cwd, 'spacedock')

html_path = path.join(root, 'html')
html = Tree(html_path, prefix='html')

image_path = path.join(root, 'images')
images = Tree(image_path, prefix='images', excludes=['*.xcf'])

a = Analysis(['bin/spacedock'],
             pathex=[cwd],
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
