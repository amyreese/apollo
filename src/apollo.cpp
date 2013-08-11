// Copyright (c) 2013 John Reese
// Licensed under the MIT license

#include <stdio.h>
#include <QtCore>
#include <QApplication>
#include <QMainWindow>
#include <QJsonDocument>
#include "config.h"

int main(int argc, char* argv[])
{
    try {
        Config config("prefs.json");

        QApplication apollo(argc, argv);
        QMainWindow window;
        window.show();

        return apollo.exec();

    } catch(int e) {
        return 1;
    }
}
