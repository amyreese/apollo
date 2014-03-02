# Copyright 2014 John Reese
# Licensed under the MIT license

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

import json
import re
import six

from os import path

from apollo import ROOT, HOME
from .ent import Encoder, Singleton, Struct
from .log import logger


@six.add_metaclass(Singleton)
class Config(object):
    """A singleton instance holding the canonical configuration data for the
    application.  It loads data from JSON, merges user config overrides on top
    of default configuration values, and then can write updated configuration
    values back to disk as JSON."""

    def __init__(self):
        self.log = logger('config')
        self.log.debug('apollo root: %s', ROOT)
        self.log.debug('apollo home: %s', HOME)

        self.defaults_path = path.join(ROOT, 'dotfiles', 'prefs.json')
        self.user_prefs_path = path.join(HOME, 'prefs.json')
        self.user_networks_path = path.join(HOME, 'networks.json')

        self.defaults = self.load_defaults()
        self.prefs = self.load_prefs()
        self.networks = self.load_networks()
        self.network_defaults = self.prefs.networks._defaults

    def get(self, key):
        return self.prefs._get(key)

    def set(self, key, value):
        return self.prefs._set(key, value)

    def read_config(self, filepath):
        with open(filepath) as fh:
            data = json.load(fh)

        return ConfigStruct.load(data)

    def write_config(self, filepath, config):
        with open(filepath, 'w') as fh:
            json.dump(fh, config, cls=Encoder, indent=4)

        return True

    def load_defaults(self):
        return self.read_config(self.defaults_path)

    def load_prefs(self):
        if path.isfile(self.user_prefs_path):
            try:
                overrides = self.read_config(self.user_prefs_path)
                return ConfigStruct.merge(self.defaults, overrides,
                                          newkeys=False,
                                          ignore=['_defaults'])
            except:
                self.log.exception('failed to parse user prefs.json')

        return ConfigStruct.load(self.defaults)

    def load_networks(self):
        if path.isfile(self.user_networks_path):
            try:
                overrides = self.read_config(self.user_networks_path)
                return ConfigStruct.merge(self.defaults.networks, overrides,
                                          newkeys=True,
                                          ignore=['_defaults'])
            except:
                self.log.exception('failed to parse user networks.json')

        return ConfigStruct.load(self.defaults.networks)

    def save_prefs(self):
        delta = ConfigStruct.diff(self.defaults, self.prefs,
                                  newkeys=False,
                                  ignore=['networks'])
        self.write_config(self.user_prefs_path, delta)

    def save_networks(self):
        delta = ConfigStruct.diff(self.defaults.networks, self.networks,
                                  newkeys=True,
                                  ignore=['_defaults'])
        self.write_config(self.user_networks_path, delta)


class ConfigStruct(Struct):
    def __getattribute__(self, name):
        if name.startswith('_'):
            return Struct.__getattribute__(self, name)

        elif name in self.__dict__:
            value = self.__dict__[name]

            if type(value) == six.text_type:
                return self._substitution(value, set(name))

            else:
                return value

        else:
            raise AttributeError()

    def _get(self, key):
        parts = key.split('.')
        struct = self
        for part in parts:
            if part in struct.__dict__:
                obj = struct.__dict__[part]
                if isinstance(obj, Struct):
                    struct = obj
                else:
                    break
        return obj

    _sub_re = re.compile(r'(%(?P<name>[a-zA-Z0-9_]*)%)')

    def _substitution(self, value, names):
        def replace(match):
            name = match.group('name')
            if name == '':
                return '%'
            elif name in names:
                return match.group(0)
            else:
                names.add(name)
                svalue = Config().prefs._get(name)
                return self._substitution(svalue, names)

        return self._sub_re.sub(replace, value)
