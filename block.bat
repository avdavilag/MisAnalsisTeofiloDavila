@echo off


REM Verifica el primer argumento (nombre del comando)
IF "%1"=="build" (
    echo La ejecución de 'ionic build' está prohibida.
    REM Puedes mostrar un mensaje personalizado o realizar otras acciones.
) ELSE (
    REM Para cualquier otro comando, ejecuta el comando sin restricciones
    	ionic %*
)