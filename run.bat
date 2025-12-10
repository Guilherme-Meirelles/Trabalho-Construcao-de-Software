@echo off

echo Inicializando o Sistema ToDaily
echo.

goto :springBoot

:: Definindo o servico do banco de dados
set "SERVICO=todailyBD"

echo Verificando o servico %SERVICO%...

:: Verifica se o serviço está rodando

:iniciaServico
sc query "%SERVICO%" | find "RUNNING" >nul
if %errorlevel%==0 (
    echo Servico %SERVICO% em execucao...
    goto :springBoot
) else (
    echo Iniciando o servico %SERVICO%...
    net start %SERVICO%
    timeout /t 5 >nul
    goto :iniciaServico
)

:springBoot
::Chamando o Spring-Boot
echo.
echo Executando o Spring-Boot...
mvn spring-boot:run > log.txt
if %errorlevel%==0 (
    echo.
    del log.txt
    echo Inicializacao completa, abrindo a pagina de login...
    start http://localhost:8080/login
    goto :EOF
) else if %errorlevel%==1 (
    echo.
    echo Erro ao inicializar o sistema, confira o arquivo log.txt
    goto :EOF
)