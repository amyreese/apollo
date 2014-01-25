# Copyright 2014 John Reese
# Licensed under the MIT license

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

from argparse import ArgumentParser
from os import path

from PySide.QtCore import Slot, QUrl
from PySide.QtGui import QApplication
from PySide.QtWebKit import QWebView, QWebSettings

from spacedock import VERSION
from .log import logger, enable_debug

# global reference to
app = None


class SpacedockApp(QApplication):

    log = None

    def __init__(self, options, argv):
        QApplication.__init__(self, argv)

        self.log = logger('spacedock')
        self.options = options

    @Slot(str, result=str)
    def foo(self, word):
        self.log.debug(word)
        return 'foo'


class SpacedockWebView(QWebView):

    def __init__(self):
        QWebView.__init__(self)

        settings = {
            QWebSettings.WebAttribute.JavaEnabled: False,
            QWebSettings.WebAttribute.PluginsEnabled: False,
            QWebSettings.WebAttribute.DeveloperExtrasEnabled: True,
        }
        for key, value in settings.items():
            self.settings().setAttribute(key, value)

        frame = self.page().mainFrame()
        frame.javaScriptWindowObjectCleared.connect(self.setupDOM)

    def setupDOM(self):
        app.log.debug('setupDOM()')
        self.page().mainFrame().addToJavaScriptWindowObject("spacedock", app)


def main(argv):
    '''Main entry point for the Spacedock application.'''
    global app
    assert(app is None)

    log = logger()

    parser = ArgumentParser(prog='spacedock', description='KSP mod manager')
    parser.add_argument('-d', '--debug', action='store_true', default=False,
                        help='enable debug output')
    parser.add_argument('-V', '--version', action='version',
                        version='%(prog)s ' + VERSION)

    options = parser.parse_args()

    if options.debug:
        enable_debug()

    log.debug('starting application')
    app = SpacedockApp(options, argv)

    webview = SpacedockWebView()

    webview.load(QUrl.fromLocalFile(path.abspath('html/index.html')))
    webview.show()
    # setup gui here

    app.exec_()
