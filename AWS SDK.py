import boto3
from botocore.exceptions import NoCredentialsError, ClientError

# Configuración de credenciales para conectarse a S3
aws_access_key_id = "key_id"
aws_secret_access_key = "access_key"
aws_session_token = "session_token"
region_name = "us-east-1"   #Region (Defaul = us-east-1)
bucket_name = "name"   #Nombre de tu bucket S3

# Inicializa el cliente de S3
s3_client = boto3.client(
    's3',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    aws_session_token=aws_session_token,
    region_name=region_name
)

def subir_archivo_s3(nombre_archivo_local, nombre_objeto):
    try:
        s3_client.upload_file(nombre_archivo_local, bucket_name, nombre_objeto)
        print(f"Archivo '{nombre_archivo_local}' subido como '{nombre_objeto}'.")
    except NoCredentialsError:
        print("Credenciales no disponibles.")
    except ClientError as e:
        print(f"Error al subir el archivo: {e}")

def descargar_archivo_s3(nombre_objeto, nombre_archivo_local):
    try:
        s3_client.download_file(bucket_name, nombre_objeto, nombre_archivo_local)
        print(f"Archivo '{nombre_objeto}' descargado como '{nombre_archivo_local}'.")
    except NoCredentialsError:
        print("Credenciales no disponibles.")
    except ClientError as e:
        print(f"Error al descargar el archivo: {e}")

def eliminar_archivo_s3(nombre_objeto):
    try:
        s3_client.delete_object(Bucket=bucket_name, Key=nombre_objeto)
        print(f"Archivo '{nombre_objeto}' eliminado del bucket '{bucket_name}'.")
    except NoCredentialsError:
        print("Credenciales no disponibles.")
    except ClientError as e:
        print(f"Error al eliminar el archivo: {e}")

def agregar_metadato_s3(nombre_objeto, numero_expediente):
    try:
        copy_source = {'Bucket': bucket_name, 'Key': nombre_objeto}
        s3_client.copy_object(
            CopySource=copy_source,
            Bucket=bucket_name,
            Key=nombre_objeto,
            Metadata={"x-amz-meta-expediente": numero_expediente},
            MetadataDirective='REPLACE'
        )
        print(f"Metadato 'x-amz-meta-expediente: {numero_expediente}' agregado a '{nombre_objeto}'.")
    except NoCredentialsError:
        print("Credenciales no disponibles.")
    except ClientError as e:
        print(f"Error al agregar el metadato: {e}")

def leer_metadatos_s3(nombre_objeto):
    try:
        response = s3_client.head_object(Bucket=bucket_name, Key=nombre_objeto)
        metadata = response.get("Metadata", {})
        print(f"Metadatos del objeto '{nombre_objeto}': {metadata}")
    except NoCredentialsError:
        print("Credenciales no disponibles.")
    except ClientError as e:
        print(f"Error al leer los metadatos: {e}")

def menu():
    while True:
        print("\n--- Menú de S3 ---")
        print("1. Subir archivo")
        print("2. Descargar archivo")
        print("3. Eliminar archivo")
        print("4. Agregar metadato")
        print("5. Leer metadato")
        print("6. Salir")
        opcion = input("Seleccione una opción: ")

        if opcion == '1':
            print("!!! Recuerda poner todo junto con su extension (.txt .jpg) !!!")
            nombre_archivo_local = input("Ingrese la ruta del archivo local: ")
            nombre_objeto = input("Ingrese el nombre del objeto en S3: ")
            subir_archivo_s3(nombre_archivo_local, nombre_objeto)
        elif opcion == '2':
            print("!!! Recuerda poner todo junto con su extension (.txt .jpg) !!!")
            nombre_objeto = input("Ingrese el nombre del objeto en S3: ")
            nombre_archivo_local = input("Ingrese el nombre del archivo para guardar localmente: ")
            descargar_archivo_s3(nombre_objeto, nombre_archivo_local)
        elif opcion == '3':
            print("!!! Recuerda poner todo junto con su extension (.txt .jpg) !!!")
            nombre_objeto = input("Ingrese el nombre del objeto en S3 a eliminar: ")
            eliminar_archivo_s3(nombre_objeto)
        elif opcion == '4':
            print("!!! Recuerda poner todo junto con su extension (.txt .jpg) !!!")
            nombre_objeto = input("Ingrese el nombre del objeto en S3: ")
            numero_expediente = input("Ingrese el número de expediente: ")
            agregar_metadato_s3(nombre_objeto, numero_expediente)
        elif opcion == '5':
            print("!!! Recuerda poner todo junto con su extension (.txt .jpg) !!!")
            nombre_objeto = input("Ingrese el nombre del objeto en S3: ")
            leer_metadatos_s3(nombre_objeto)
        elif opcion == '6':
            print("Saliendo del programa.")
            break
        else:
            print("Opción no válida. Intente de nuevo.")

# inicio
menu()


# Pruebas
## 1. Subir archivo ("nombre-archivo-en-maquina local", "nombre-asignado-nube") //con extension .jpg
#subir_archivo_s3("prueba.jpg", "prueba.jpg")
## 2. descargar archivo ("nombre-archivo-en-S3", "nombre-para-descargar") //Con extension (en este caso.jpg)
# descargar_archivo_s3("prueba.jpg", "prueba_descargada.jpg")
## 3. Eliminar archivo ("nombre-archivo-en-nube(S3)"
# eliminar_archivo_s3("prueba.jpg")
## 4. Agregar Metadato en archivo ("nombre-archivo-en-nube(S3)"
# agregar_metadato_s3("prueba.jpg", "737066")
## 5. Leer Metadato en S3 ("nombre-archivo-en-nube(S3)"
# leer_metadatos_s3("prueba.jpg")