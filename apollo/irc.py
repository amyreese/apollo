# Copyright 2014 John Reese
# Licensed under the MIT license

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

import ssl

from irc.client import IRC, Event
from irc.connection import Factory
from PySide.QtCore import QObject, QThread, Signal, Slot

from .log import logger


class NetworkConnection(QObject):
    event = Signal(Event)

    def __init__(self, config, connection):
        self.log = logger('network')
        self.config = config
        self.connection = connection

    def connect(self):
        kwargs = {}
        if self.config.ssl:
            kwargs['connect_factory'] = Factory(wrapper=ssl.wrap_socket)

        self.connection.connect(self.config.url,
                                self.config.port,
                                self.config.nick,
                                self.config.password,
                                **kwargs)

    def disconnect(self, message=''):
        self.connection.disconnect(message)

    def _dispatch(self, event):
        method = getattr(self, 'on_' + event.type, None)
        snarf = False

        if method is not None:
            snarf = method(event)

        if not snarf:
            pass
            #self.event.emit(event)

    def on_nicknameinuse(self, event):
        conn = self.connection

        if conn.nickname == self.config.nick:
            conn.nick(self.config.nick1)
        elif conn.nickname == self.config.nick1:
            conn.nick(self.config.nick2)
        else:
            raise Exception('nickname %s in use', conn.nickname)

        return True


class NetworkManager(QThread):

    def __init__(self):
        self.running = True
        self.irc = IRC()
        self.log = logger('network')

        self.configs = {}
        self.networks = {}
        self.connections = {}

        self.irc.add_global_handler('all_events', self._dispatch, 0)

        QThread.__init__(self)

    def _dispatch(self, conn, event):
        network = self.connections[conn]
        network._dispatch(event)

    def add(self, config, connect=False):
        name = config.name
        if name in self.configs:
            raise Exception('network with name "%s" already exists' % name)

        conn = self.irc.server()
        network = NetworkConnection(config, conn)

        self.configs[name] = config
        self.networks[name] = network
        self.connections[conn] = network

        if connect:
            network.connect()

        return network

    def remove(self, config):
        name = config.name
        if name in self.networks:
            network = self.networks[name]
            network.disconnect()

            self.configs.pop(name, None)
            self.networks.pop(name, None)
            self.connections.pop(network.connection, None)

        else:
            raise Exception('network name %s not found' % name)

    def run(self):
        while self.running:
            try:
                self.irc.process_once(0.1)
            except:
                self.log.exception('exception occurred in network event loop')
                return
        try:
            self.irc.process_once(0.1)
        except:
            pass

    @Slot(str)
    def stop(self, message=''):
        self.running = False
        self.irc.disconnect_all(message)
