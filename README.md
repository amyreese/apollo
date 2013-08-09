apollo
======

Elegant IRC client

apollo (lowercase) is an IRC client focused on simplicity and elegance, while
retaining modern features habits.  The interface should be clean and clear of
distracting bells and whistles, and conversations should be at the fore-front;
show inline image previews and URL summaries rather than forcing the user to
click them, and group contiguous messages from a single user into a tidy block.
UI affordances should be subtle, but useful; stop bombarding the user's eyes
brain with repetitive or redundant information.  Hotkeys and human-readable
configuration files should trump buttons and dialogs.

Inspiration is being taken from Irssi, HipChat, Limechat, and Textual.

apollo will be considered a success when the user can hide everything but the
conversations themselves without losing any information.


details
-------

apollo is built on Qt 5.1 and [libcommuni][].

To build apollo:

    $ qmake && make

[![Build Status](https://travis-ci.org/jreese/apollo.png)](https://travis-ci.org/jreese/apollo)


legal
-----

apollo is copyright (c) 2013 John Reese
apollo is licensed under the MIT license.  See LICENSE for details.

[libcommuni]: http://communi.github.io/
