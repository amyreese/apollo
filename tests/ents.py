# Copyright 2014 John Reese
# Licensed under the MIT license

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

from apollo.log import logger, enable_debug
from apollo.ent import Struct

log = logger('test')
enable_debug()

test_cases = [
    None,
    True,
    False,
    1,
    1.0,
    'foo',
    u'bar',
    [{'foo': 'bar'}, {'foo': 'bar'}],
    (1, 2.0, 'fuzz', u'fizz', {'foo': 'bar'}),
    set(['foo', 'bar']),
    {'foo': 'bar'},
    {'foo': {'bar': 'baz'}},
    {'foo': [{'bar': 'baz'}]},
    {'foo': set(['bar', 'baz'])},
]

for test_case in test_cases:
    result = Struct.load(test_case)
    log.info('Test case: %s', test_case)
    log.info('Result   : %s', result)

merge_structs = [Struct(d) for d in [
    {'foo': 1, 'bar': 1, 'bang': 1},
    {'foo': 2, 'baz': 2},
    {'bar': 3, 'baz': 3},
]]

log.info('Struct.merge(newkeys=False): %s',
         Struct.merge(*merge_structs, newkeys=False))
log.info('Struct.merge(newkeys=True): %s',
         Struct.merge(*merge_structs, newkeys=True))

log.info('Struct(foo="foo", bar="bar").copy()')
s1 = Struct(foo="foo", bar="bar")
s2 = s1.copy()
log.info('s1: %s', s1)
log.info('s2: %s', s2)

assert id(s1) != id(s2)
