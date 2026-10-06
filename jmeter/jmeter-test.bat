@echo off
chcp 65001 > nul

echo ================================
echo 啟動 Docker 測試環境
echo ================================

echo 清除舊測試環境...
docker compose down

echo 啟動新的測試環境...
docker compose up -d

if errorlevel 1 (
    echo.
    echo Docker Compose 啟動失敗
    pause
    exit /b 1
)

echo.
echo Docker Compose 啟動完成
echo.

docker compose ps

echo.
echo ================================
echo 等待 Spring Boot 啟動
echo ================================

set COUNT=0

:WAIT_SPRING

curl -s -o nul http://localhost:8080/api/user

if %errorlevel%==0 (
    echo.
    echo Spring Boot 已啟動完成
    goto SPRING_READY
)

set /a COUNT+=1

echo Spring Boot 尚未啟動，等待中... %COUNT%/30

if %COUNT% GEQ 30 (
    echo.
    echo Spring Boot 啟動逾時
    echo.
    echo ===== Docker Logs =====
    docker compose logs userweb
    pause
    exit /b 1
)

timeout /t 2 /nobreak > nul

goto WAIT_SPRING


:SPRING_READY

echo.
echo 可以開始執行 JMeter 測試
echo.

REM ============================================
REM 建立本次測試的時間戳
REM ============================================

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss"') do set TIMESTAMP=%%i

set "RESULT_DIR=jmeter\results\%TIMESTAMP%"
set "JTL_FILE=%RESULT_DIR%\result.jtl"
set "REPORT_DIR=%RESULT_DIR%\report"
set "DOCKER_LOG=%RESULT_DIR%\docker-userweb.log"

echo ================================
echo 建立本次測試結果資料夾
echo ================================

echo %RESULT_DIR%

mkdir "%RESULT_DIR%"

echo.

echo ================================
echo 開始執行 JMeter 測試
echo ================================

call "C:\Users\******\Documents\apache-jmeter-5.6.3\bin\jmeter.bat" ^
-n ^
-t "jmeter\UserWeb20260907.jmx" ^
-l "%JTL_FILE%" ^
-e ^
-o "%REPORT_DIR%"

REM 先記住 JMeter 的結束狀態
set JMETER_RESULT=%errorlevel%

echo.
echo ================================
echo 儲存 Spring Boot Docker Log
echo ================================

docker compose logs --no-color userweb > "%DOCKER_LOG%" 2>&1

echo Docker Log：%DOCKER_LOG%

REM 再判斷 JMeter 是否執行失敗
if not "%JMETER_RESULT%"=="0" (
    echo.
    echo JMeter 測試執行失敗
    echo.
    echo 本次測試資料仍保留於：
    echo %RESULT_DIR%
    pause
    exit /b 1
)

echo.
echo ================================
echo JMeter 測試執行完成
echo ================================

echo 測試時間：%TIMESTAMP%
echo JTL：%JTL_FILE%
echo HTML Report：%REPORT_DIR%\index.html
echo Docker Log：%DOCKER_LOG%

echo.
echo ================================
echo 歷史測試結果不會被刪除
echo ================================

pause