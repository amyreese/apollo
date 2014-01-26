# -*- mode: python -*-
from __future__ import print_function

import os
import platform
import sys
from os import path

pwd = path.realpath(os.getcwd())

html_path = path.join(pwd, 'spacedock/html')
html = Tree(html_path, prefix='html')

a = Analysis(['bin/spacedock'],
             hiddenimports=[],
             hookspath=None,
             runtime_hooks=None)
pyz = PYZ(a.pure)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          html,
          exclude_binaries=False,
          name='spacedock',
          debug=False,
          strip=None,
          upx=True,
          console=False )
