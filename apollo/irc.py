# Copyright 2014 John Reese
# Licensed under the MIT license

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

from irc.client import IRC
from PySide.QtCore import QThread, Signal

from .log import logger


class ServerConnection(QThread):
    event = Signal(str)

    def __init__(self):
        self.irc = IRC()
        self.conn = self.irc.server()
        self.log = logger('irc')
        self.running = True

        self.irc.add_global_handler('all_events', self._dispatch, 0)

        QThread.__init__(self)

    def _dispatch(self, connection, event):
        if event.type in ('disconnect', 'quit'):
            self.log.debug('irc quit event')
            self.running = False

        self.log.debug('irc event: %s, %s -> %s (%s)',
                       event.type, event.source, event.target, event.arguments)

    def connect_irc(self):
        self.conn.connect('irc.freenode.net', 6667, 'apollo')

    def quit(self):
        self.conn.disconnect('bai')

    def run(self):
        while self.running:
            self.irc.process_once(0.1)
