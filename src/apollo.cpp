#include <QApplication>
#include <QMainWindow>

int main(int argc, char* argv[])
{
    QApplication apollo(argc, argv);
    QMainWindow window;
    window.show();

    return apollo.exec();
}
