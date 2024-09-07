# DESARROLLO EN LA NUBE - PRACTICA 2

# Descripcion
Este repositorio aparte de un respaldo del proyecto, el objetivo es conectar una instancia de EC2 de AWS a S3 bucket
# Instalación y configuración
1. Entrar a SSH desde la terminal para poder clonar el repositorio.
2. Copiar las credenciales de AWS y añadirlas en `.env`
Una vez accedido a SSH en la terminal de la instancia escribir lo siguiente
3. Actualizar
    ```bash
    sudo yum update -y
    ```
4. Instalar git
    ```bash
    sudo yum install git -y
    ```
5. Clonar el repositorio que se encuentra el proyecto en la rama Practica2_Actv2
    ```bash
    git clone -b Practica2_Actv2 https://github.com/victortelles/DESARROLLO_NUBE.git
    ```
6. Dirigete a la carpeta del repositorio
    ```bash
    cd DESARROLLO_NUBE
    ```
7. Instala dependencias
    ```bash
    npm install
    ```
8. Pega las credenciales de AWS que pide en el archivo *.env*
9. Ejecuta el programa
    ```bash
    npm run dev
    ```
