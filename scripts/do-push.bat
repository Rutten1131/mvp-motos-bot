@echo off
cd /d "d:\Abel paginas\mvp motos-motos bot\mvp motos-motos bot"
echo === Git status ===
git status --short
echo.
echo === Committing ===
git add app/crm/page.tsx
git commit -m "fix: encoding UTF-8 en page.tsx + grafico 7 dias + chart cambia al seleccionar intencion"
echo.
echo === Pushing to GitHub ===
git push origin main
echo.
echo === DONE ===
pause
