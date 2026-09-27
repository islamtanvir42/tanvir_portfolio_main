@echo off
rem Node is not on PATH for processes spawned by the preview tool, so set it here.
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "E:\Tanvir Islam Website"
call npm run dev
