#!/bin/bash
set -e

PROJECT_DIR="/home/admin/automatizacion-boyeros-frontend"

echo "Iniciando despliegue el $(date)..."
cd "$PROJECT_DIR"

echo "Obteniendo últimos cambios..."
git pull origin main

echo "Instalando dependencias..."
export PATH=$PATH:/home/admin/.local/bin
npm install

echo "Construyendo aplicación..."
npm run build

echo "Reiniciando servicio..."
# Nota: Esto requiere configuración de sudoers o ejecución manual si pide password
sudo systemctl restart boyeros-frontend.service

echo "¡Despliegue finalizado con éxito!"
