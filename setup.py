from setuptools import setup

from os import path
import shutil

import spacedock

if path.isfile('README.md'):
    shutil.copyfile('README.md', 'README')

setup(name='spacedock',
      description='Mod manager for Kerbal Space Program',
      version=spacedock.VERSION,
      author='John Reese',
      author_email='john@noswap.com',
      url='https://github.com/jreese/spacedock',
      classifiers=['License :: OSI Approved :: MIT License',
                   'Operating System :: OS Independent',
                   'Programming Language :: Python',
                   'Programming Language :: Python :: 2.7',
                   'Programming Language :: Python :: 3',
                   'Programming Language :: Python :: 3.3',
                   'Topic :: Utilities',
                   'Development Status :: 3 - Alpha',
                   ],
      license='MIT License',
      requires=['pyside (>=2.1)',
               ],
      packages=['spacedock'],
      package_data={'spacedock': ['html/*']},
      scripts=['bin/spacedock'],
      )
