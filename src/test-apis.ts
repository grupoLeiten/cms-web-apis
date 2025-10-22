import dotenv from 'dotenv';
import { getVista } from './apiContentSettings.js';
import { editarAtributo } from './apiAtributos.js';

import { actualizarReglaValidacionAtributo } from './apiReglasValidacion.js';
import { actualizarTipoContenido } from './apiTipoContenido.js';
import { agregarImagenGrupoProducto } from './apiImagenGrupoProducto.js';
import { agregarImagenMarca } from './apiImagenMarca.js';
import { agregarImagenSegmento } from './apiImagenSegmento.js';

// Cargar variables de entorno
dotenv.config();

// Configuración de pruebas
const TEST_CONFIG = {
    // IDs de prueba - cámbialos por IDs reales de tu sistema
    VISTA_ID: process.env.TEST_VISTA_ID || '1', // Cambia por un ID real
    ATRIBUTO_ID: process.env.TEST_ATRIBUTO_ID || '1', // Cambia por un ID real
    TOKEN: process.env.TEST_TOKEN || 'test-token', // Cambia por un token real
};

// Función para probar getVista (GET con ID)
async function testGetVista() {
    console.log('🧪 Probando getVista (GET)...');
    console.log(`   📋 ID de vista: ${TEST_CONFIG.VISTA_ID}`);
    console.log(`   🔗 URL: ${process.env.API_BASE_URL}/ContentSettings/ContentSettings/GetVista/IdVista/${TEST_CONFIG.VISTA_ID}`);
    
    try {
        const resultado = await getVista({
            params: { idView: TEST_CONFIG.VISTA_ID },
            token: TEST_CONFIG.TOKEN
        });
        
        console.log('✅ getVista funcionó correctamente:');
        console.log(JSON.stringify(resultado, null, 2));
        return true;
    } catch (error) {
        console.log('❌ Error en getVista:');
        if (error instanceof Error) {
            console.log(`   Mensaje: ${error.message}`);
            if (error.message.includes('404')) {
                console.log('   💡 Sugerencia: Verifica que el ID de vista existe en tu sistema');
            } else if (error.message.includes('401') || error.message.includes('403')) {
                console.log('   💡 Sugerencia: Verifica tu token de autenticación');
            } else if (error.message.includes('fetch')) {
                console.log('   💡 Sugerencia: Verifica que la URL base sea correcta y el servidor esté funcionando');
            }
        }
        return false;
    }
}

// Función para probar editarAtributo (POST con datos)
async function testEditarAtributo() {
    console.log('🧪 Probando editarAtributo (POST)...');
    
    const testData = {
        id: parseInt(TEST_CONFIG.ATRIBUTO_ID),
        nombre: `Atributo de Prueba - ${new Date().toISOString()}`,
        descripcion: 'Este es un atributo de prueba creado automáticamente',
        activo: true
    };
    
    console.log(`   📋 Datos a enviar:`);
    console.log(JSON.stringify(testData, null, 2));
    console.log(`   🔗 URL: ${process.env.API_BASE_URL}/Atributos/ActualizarAtributo`);
    
    try {
        const resultado = await editarAtributo(testData);
        
        console.log('✅ editarAtributo funcionó correctamente:');
        console.log(JSON.stringify(resultado, null, 2));
        return true;
    } catch (error) {
        console.log('❌ Error en editarAtributo:');
        if (error instanceof Error) {
            console.log(`   Mensaje: ${error.message}`);
            if (error.message.includes('404')) {
                console.log('   💡 Sugerencia: Verifica que el ID del atributo existe en tu sistema');
            } else if (error.message.includes('400')) {
                console.log('   💡 Sugerencia: Verifica que los datos enviados sean válidos');
            } else if (error.message.includes('401') || error.message.includes('403')) {
                console.log('   💡 Sugerencia: Verifica tu token de autenticación');
            } else if (error.message.includes('fetch')) {
                console.log('   💡 Sugerencia: Verifica que la URL base sea correcta y el servidor esté funcionando');
            }
        }
        return false;
    }
}

// Función para probar actualizarReglaValidacionAtributo (POST con datos de validación)
async function testActualizarReglaValidacionAtributo() {
    console.log('🧪 Probando actualizarReglaValidacionAtributo (POST)...');
    
    const testData = {
        idAtributo: TEST_CONFIG.ATRIBUTO_ID,
        reglaValidacion: {
            tipo: 'requerido' as const,
            valor: 'Campo obligatorio',
            mensaje: 'Este campo es requerido',
            activa: true
        }
    };
    
    console.log(`   📋 Datos a enviar:`);
    console.log(JSON.stringify(testData, null, 2));
    console.log(`   🔗 URL: ${process.env.API_BASE_URL}/Atributos/ActualizarReglaValidacionAtributo`);
    
    try {
        const resultado = await actualizarReglaValidacionAtributo(testData);
        
        console.log('✅ actualizarReglaValidacionAtributo funcionó correctamente:');
        console.log(JSON.stringify(resultado, null, 2));
        return true;
    } catch (error) {
        console.log('❌ Error en actualizarReglaValidacionAtributo:');
        if (error instanceof Error) {
            console.log(`   Mensaje: ${error.message}`);
            if (error.message.includes('404')) {
                console.log('   💡 Sugerencia: Verifica que el ID del atributo existe en tu sistema');
            } else if (error.message.includes('400')) {
                console.log('   💡 Sugerencia: Verifica que los datos de la regla de validación sean válidos');
            } else if (error.message.includes('401') || error.message.includes('403')) {
                console.log('   💡 Sugerencia: Verifica tu token de autenticación');
            } else if (error.message.includes('fetch')) {
                console.log('   💡 Sugerencia: Verifica que la URL base sea correcta y el servidor esté funcionando');
            }
        }
        return false;
    }
}

// Función para probar actualizarTipoContenido (POST con datos de tipo de contenido)
async function testActualizarTipoContenido() {
    console.log('🧪 Probando actualizarTipoContenido (POST)...');
    
    const testData = {
        id: TEST_CONFIG.ATRIBUTO_ID, // Reutilizamos el ID de prueba
        nombre: `Tipo de Contenido - ${new Date().toISOString()}`,
        descripcion: 'Este es un tipo de contenido de prueba',
        activo: true,
        configuracion: {
            campos: ['titulo', 'descripcion', 'contenido'],
            validaciones: {
                titulo: { requerido: true, longitud: { min: 5, max: 100 } }
            }
        }
    };
    
    console.log(`   📋 Datos a enviar:`);
    console.log(JSON.stringify(testData, null, 2));
    console.log(`   🔗 URL: ${process.env.API_BASE_URL}/ContentSettings/SetTipoContenido`);
    
    try {
        const resultado = await actualizarTipoContenido(testData);
        
        console.log('✅ actualizarTipoContenido funcionó correctamente:');
        console.log(JSON.stringify(resultado, null, 2));
        return true;
    } catch (error) {
        console.log('❌ Error en actualizarTipoContenido:');
        if (error instanceof Error) {
            console.log(`   Mensaje: ${error.message}`);
            if (error.message.includes('404')) {
                console.log('   💡 Sugerencia: Verifica que el ID del tipo de contenido existe en tu sistema');
            } else if (error.message.includes('400')) {
                console.log('   💡 Sugerencia: Verifica que los datos del tipo de contenido sean válidos');
            } else if (error.message.includes('401') || error.message.includes('403')) {
                console.log('   💡 Sugerencia: Verifica tu token de autenticación');
            } else if (error.message.includes('fetch')) {
                console.log('   💡 Sugerencia: Verifica que la URL base sea correcta y el servidor esté funcionando');
            }
        }
        return false;
    }
}

// Función para probar agregarImagenGrupoProducto (POST con datos de imagen)
async function testAgregarImagenGrupoProducto() {
    console.log('🧪 Probando agregarImagenGrupoProducto (POST)...');
    
    const testData = {
        nombre: `Imagen de Prueba - ${new Date().toISOString()}`,
        tipoContenido: 'image/jpeg',
        mimeType: 'image/jpeg',
        rawMedia: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=', // Imagen base64 de prueba
        idEntidad: TEST_CONFIG.ATRIBUTO_ID // Reutilizamos el ID de prueba
    };
    
    console.log(`   📋 Datos a enviar:`);
    console.log(JSON.stringify({
        ...testData,
        rawMedia: testData.rawMedia.substring(0, 50) + '... (truncado)'
    }, null, 2));
    console.log(`   🔗 URL: ${process.env.API_BASE_URL}/ContentSettings/SetImagen?TipoEntidad=GRUPRO&IdEntitidad=${testData.idEntidad}`);
    
    try {
        const resultado = await agregarImagenGrupoProducto(testData);
        
        console.log('✅ agregarImagenGrupoProducto funcionó correctamente:');
        console.log(JSON.stringify(resultado, null, 2));
        return true;
    } catch (error) {
        console.log('❌ Error en agregarImagenGrupoProducto:');
        if (error instanceof Error) {
            console.log(`   Mensaje: ${error.message}`);
            if (error.message.includes('404')) {
                console.log('   💡 Sugerencia: Verifica que el ID de la entidad existe en tu sistema');
            } else if (error.message.includes('400')) {
                console.log('   💡 Sugerencia: Verifica que los datos de la imagen sean válidos (base64, mimeType, etc.)');
            } else if (error.message.includes('401') || error.message.includes('403')) {
                console.log('   💡 Sugerencia: Verifica tu token de autenticación');
            } else if (error.message.includes('fetch')) {
                console.log('   💡 Sugerencia: Verifica que la URL base sea correcta y el servidor esté funcionando');
            }
        }
        return false;
    }
}

// Función para probar agregarImagenMarca (POST con datos de imagen de marca)
async function testAgregarImagenMarca() {
    console.log('🧪 Probando agregarImagenMarca (POST)...');
    
    const testData = {
        nombre: `Imagen de Marca - ${new Date().toISOString()}`,
        tipoContenido: 'image/jpeg',
        mimeType: 'image/jpeg',
        rawMedia: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=', // Imagen base64 de prueba
        idEntidad: TEST_CONFIG.ATRIBUTO_ID // Reutilizamos el ID de prueba
    };
    
    console.log(`   📋 Datos a enviar:`);
    console.log(JSON.stringify({
        ...testData,
        rawMedia: testData.rawMedia.substring(0, 50) + '... (truncado)'
    }, null, 2));
    console.log(`   🔗 URL: ${process.env.API_BASE_URL}/ContentSettings/SetImagen?TipoEntidad=MARPRO&IdEntitidad=${testData.idEntidad}`);
    
    try {
        const resultado = await agregarImagenMarca(testData);
        
        console.log('✅ agregarImagenMarca funcionó correctamente:');
        console.log(JSON.stringify(resultado, null, 2));
        return true;
    } catch (error) {
        console.log('❌ Error en agregarImagenMarca:');
        if (error instanceof Error) {
            console.log(`   Mensaje: ${error.message}`);
            if (error.message.includes('404')) {
                console.log('   💡 Sugerencia: Verifica que el ID de la entidad existe en tu sistema');
            } else if (error.message.includes('400')) {
                console.log('   💡 Sugerencia: Verifica que los datos de la imagen sean válidos (base64, mimeType, etc.)');
            } else if (error.message.includes('401') || error.message.includes('403')) {
                console.log('   💡 Sugerencia: Verifica tu token de autenticación');
            } else if (error.message.includes('fetch')) {
                console.log('   💡 Sugerencia: Verifica que la URL base sea correcta y el servidor esté funcionando');
            }
        }
        return false;
    }
}

// Función para probar agregarImagenSegmento (POST con datos de imagen de segmento)
async function testAgregarImagenSegmento() {
    console.log('🧪 Probando agregarImagenSegmento (POST)...');
    
    const testData = {
        nombre: `Imagen de Segmento - ${new Date().toISOString()}`,
        tipoContenido: 'image/jpeg',
        mimeType: 'image/jpeg',
        rawMedia: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=', // Imagen base64 de prueba
        idEntidad: TEST_CONFIG.ATRIBUTO_ID // Reutilizamos el ID de prueba
    };
    
    console.log(`   📋 Datos a enviar:`);
    console.log(JSON.stringify({
        ...testData,
        rawMedia: testData.rawMedia.substring(0, 50) + '... (truncado)'
    }, null, 2));
    console.log(`   🔗 URL: ${process.env.API_BASE_URL}/ContentSettings/SetImagen?TipoEntidad=SEG&IdEntitidad=${testData.idEntidad}`);
    
    try {
        const resultado = await agregarImagenSegmento(testData);
        
        console.log('✅ agregarImagenSegmento funcionó correctamente:');
        console.log(JSON.stringify(resultado, null, 2));
        return true;
    } catch (error) {
        console.log('❌ Error en agregarImagenSegmento:');
        if (error instanceof Error) {
            console.log(`   Mensaje: ${error.message}`);
            if (error.message.includes('404')) {
                console.log('   💡 Sugerencia: Verifica que el ID de la entidad existe en tu sistema');
            } else if (error.message.includes('400')) {
                console.log('   💡 Sugerencia: Verifica que los datos de la imagen sean válidos (base64, mimeType, etc.)');
            } else if (error.message.includes('401') || error.message.includes('403')) {
                console.log('   💡 Sugerencia: Verifica tu token de autenticación');
            } else if (error.message.includes('fetch')) {
                console.log('   💡 Sugerencia: Verifica que la URL base sea correcta y el servidor esté funcionando');
            }
        }
        return false;
    }
}

// Función principal para ejecutar todas las pruebas
async function runTests() {
    console.log('🚀 Iniciando pruebas de APIs...\n');
    
    // Verificar configuración
    if (!process.env.API_BASE_URL) {
        console.log('⚠️  ADVERTENCIA: API_BASE_URL no está configurada en las variables de entorno');
        console.log('   Crea un archivo .env con: API_BASE_URL=tu_url_aqui\n');
        return;
    }
    
    console.log(`🔧 Configuración actual:`);
    console.log(`   API Base URL: ${process.env.API_BASE_URL}`);
    console.log(`   Vista ID: ${TEST_CONFIG.VISTA_ID}`);
    console.log(`   Atributo ID: ${TEST_CONFIG.ATRIBUTO_ID}`);
    console.log(`   Token: ${TEST_CONFIG.TOKEN.substring(0, 10)}...`);
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Ejecutar pruebas
    const results = {
        getVista: false,
        editarAtributo: false,
        actualizarReglaValidacionAtributo: false,
        actualizarTipoContenido: false,
        agregarImagenGrupoProducto: false,
        agregarImagenMarca: false,
        agregarImagenSegmento: false
    };
    
    results.getVista = await testGetVista();
    console.log('\n' + '='.repeat(60) + '\n');
    results.editarAtributo = await testEditarAtributo();
    console.log('\n' + '='.repeat(60) + '\n');
    results.actualizarReglaValidacionAtributo = await testActualizarReglaValidacionAtributo();
    console.log('\n' + '='.repeat(60) + '\n');
    results.actualizarTipoContenido = await testActualizarTipoContenido();
    console.log('\n' + '='.repeat(60) + '\n');
    results.agregarImagenGrupoProducto = await testAgregarImagenGrupoProducto();
    console.log('\n' + '='.repeat(60) + '\n');
    results.agregarImagenMarca = await testAgregarImagenMarca();
    console.log('\n' + '='.repeat(60) + '\n');
    results.agregarImagenSegmento = await testAgregarImagenSegmento();
    
    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE PRUEBAS:');
    console.log(`   getVista (GET): ${results.getVista ? '✅ PASÓ' : '❌ FALLÓ'}`);
    console.log(`   editarAtributo (POST): ${results.editarAtributo ? '✅ PASÓ' : '❌ FALLÓ'}`);
    console.log(`   actualizarReglaValidacionAtributo (POST): ${results.actualizarReglaValidacionAtributo ? '✅ PASÓ' : '❌ FALLÓ'}`);
    console.log(`   actualizarTipoContenido (POST): ${results.actualizarTipoContenido ? '✅ PASÓ' : '❌ FALLÓ'}`);
    console.log(`   agregarImagenGrupoProducto (POST): ${results.agregarImagenGrupoProducto ? '✅ PASÓ' : '❌ FALLÓ'}`);
    console.log(`   agregarImagenMarca (POST): ${results.agregarImagenMarca ? '✅ PASÓ' : '❌ FALLÓ'}`);
    console.log(`   agregarImagenSegmento (POST): ${results.agregarImagenSegmento ? '✅ PASÓ' : '❌ FALLÓ'}`);
    
    const totalPassed = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n🎯 Resultado: ${totalPassed}/${totalTests} pruebas pasaron`);
    
    if (totalPassed === totalTests) {
        console.log('🎉 ¡Todas las APIs están funcionando correctamente!');
    } else {
        console.log('⚠️  Algunas APIs necesitan atención. Revisa los errores arriba.');
        console.log('\n💡 Consejos para solucionar problemas:');
        console.log('   1. Verifica que tu servidor API esté funcionando');
        console.log('   2. Confirma que los IDs de prueba existan en tu sistema');
        console.log('   3. Revisa que tu token de autenticación sea válido');
        console.log('   4. Asegúrate de que la URL base sea correcta');
    }
}

// Ejecutar las pruebas
runTests().catch(console.error);
