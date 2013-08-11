// Copyright (c) 2013 John Reese
// Licensed under the MIT license

#include <QtCore>
#include "config.h"

Config::Config(const QString filename, QObject* parent)
    : QObject(parent)
{
    QString filepath = Config::dotpath(filename);

    if (QFile::exists(filepath)) {
        QFile file(filepath);
        file.open(QIODevice::ReadOnly | QIODevice::Text);
        QByteArray contents = file.readAll();
        qDebug() << contents.length();
        file.close();

        this->document = QJsonDocument::fromJson(contents);
    } else {
        this->document = QJsonDocument();
    }
}

Config::~Config()
{
}

QString Config::dotpath(QString filename)
{
    QString homepath = QDir::homePath();
    return homepath +
        QDir::separator() +
        QString(".config/apollo/") +
        filename;
}
