const { execSync } = require('child_process');
const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

async function deploy() {
    console.log('Iniciando proceso de despliegue...');

    try {
        // Construir el proyecto
        console.log('Construyendo el proyecto...');
        execSync('npx react-scripts build', { stdio: 'inherit' });

        // Configuración FTP
        const client = new ftp.Client();
        client.ftp.verbose = true;

        console.log('Conectando al servidor FTP...');
        await client.access({
            host: 'ftp.aygloo.com',
            user: 'info@aygloo.com',
            password: 'Ayclick2021',
            port: 21
        });

        // Navegar al directorio correcto
        await client.cd('public_html');

        // Función para subir archivos recursivamente
        async function uploadDirectory(localPath, remotePath = '') {
            const items = fs.readdirSync(localPath);

            for (const item of items) {
                const localItemPath = path.join(localPath, item);
                const remoteItemPath = path.join(remotePath, item);

                if (fs.statSync(localItemPath).isDirectory()) {
                    try {
                        await client.ensureDir(remoteItemPath);
                        console.log(`Directorio creado: ${remoteItemPath}`);
                    } catch (err) {
                        console.log(`El directorio ya existe: ${remoteItemPath}`);
                    }
                    await uploadDirectory(localItemPath, remoteItemPath);
                } else {
                    console.log(`Subiendo: ${localItemPath} -> ${remoteItemPath}`);
                    await client.uploadFrom(localItemPath, remoteItemPath);
                }
            }
        }

        // Subir archivos
        console.log('Subiendo archivos...');
        await uploadDirectory('build');

        console.log('¡Despliegue completado con éxito!');
    } catch (err) {
        console.error('Error durante el despliegue:', err);
    } finally {
        client.close();
    }
}

deploy(); 
