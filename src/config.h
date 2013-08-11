// Copyright (c) 2013 John Reese
// Licensed under the MIT license

#ifndef CONFIG_H
#define CONFIG_H

#include <QtCore>

class Config : public QObject
{
    Q_OBJECT

public:
    explicit Config(const QString filename, QObject* parent = 0);
    virtual ~Config();

    static QString dotpath(QString filename);

private:
    QJsonDocument document;

};

#endif // CONFIG_H
