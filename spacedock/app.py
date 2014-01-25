# Copyright 2014 John Reese
# Licensed under the MIT license

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

from PySide.QtGui import QApplication
from PySide.QtWebKit import QWebView

# global reference to
app = None

class SpacedockApp(QApplication):

    def __init__(self, argv):
        QApplication.__init__(self, argv)


def main(argv):
    '''Main entry point for the Spacedock application.'''
    global app

    if app is not None:
        raise Exception('spacedock.app is already set')

    app = SpacedockApp(argv)

    webview = QWebView()
    webview.load("http://noswap.com")
    webview.show()
    # setup gui here

    app.exec_()
