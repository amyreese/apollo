# Copyright 2014 John Reese
# Licensed under the MIT license

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

import json

from apollo.log import logger, enable_debug
from apollo.ent import Encoder
from apollo.config import Config, ConfigStruct

def dump(config):
    return json.dumps(config, cls=Encoder, indent=4)

log = logger('test')
enable_debug()

config = Config()
config2 = Config()

assert id(config) == id(config2)

log.info('prefs.nick:      %s', config.prefs.nick)
log.info('prefs.nick1:     %s', config.prefs.nick1)
log.info('prefs.nick2:     %s', config.prefs.nick2)

log.debug('defaults: %s', dump(config.defaults))
log.debug('prefs: %s', dump(config.prefs))
log.debug('networks: %s', dump(config.networks))
