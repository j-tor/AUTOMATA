@echo off
echo Compilando backend DFA...
g++ -std=c++17 -O2 -Iinclude -DCPPHTTPLIB_NO_EXCEPTIONS -D_WIN32_WINNT=0x0A00 main.cpp src/*.cpp src/coneccion/*.cpp -o dfa_backend.exe -lws2_32
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo la compilacion.
    pause
    exit /b 1
)
echo Compilacion exitosa.
echo.
echo Iniciando servidor en http://localhost:8000 ...
echo Presiona Ctrl+C para detener.
echo.
dfa_backend.exe
pause
