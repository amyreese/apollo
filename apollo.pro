TEMPLATE = app
CONFIG += qt debug_and_release build_all
QT = core gui widgets webkitwidgets

DESTDIR = bin
CONFIG(debug, debug|release) {
    TARGET = apollo.debug
} else {
    TARGET = apollo
}

SOURCES += source/apollo.cpp
