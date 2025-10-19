import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RoleService } from '../role/role.service';

async function initializeRoles() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const roleService = app.get(RoleService);

  try {
    console.log('Initializing default roles and permissions...');
    await roleService.initializeDefaultData();
    console.log('✅ Default roles and permissions initialized successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize roles and permissions:', error);
  } finally {
    await app.close();
  }
}

initializeRoles();
