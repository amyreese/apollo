DEPENDPATH += $$PWD
INCLUDEPATH += $$PWD

HEADERS += $$PWD/config.h

SOURCES += $$PWD/config.cpp
SOURCES += $$PWD/apollo.cpp

exists(libcommuni/src/src.pri) {
	include(libcommuni/src/src.pri)
} else:load(communi-config, true) {
	CONFIG += communi
} else {
	error(libcommuni not found.  try "git submodule update --init --recursive".)
}
