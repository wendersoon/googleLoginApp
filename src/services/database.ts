import SQLite from 'react-native-sqlite-storage';
import { UserInfo, DatabaseUser } from '../types';

SQLite.DEBUG(true);
// Configurar o SQLite para usar o callback handler
SQLite.enablePromise(true);

export class DatabaseService {
  private database: SQLite.SQLiteDatabase | null = null;
  private static instance: DatabaseService;

  // Singleton para garantir uma única instância do serviço
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Inicializar o banco de dados
  public async initDatabase(): Promise<void> {
    try {
      this.database = await SQLite.openDatabase({
        name: 'GoogleLoginApp.db',
        location: 'default',
      });
      console.log('Database initialized successfully');
      await this.createTables();
    } catch (error) {
      console.error('Error initializing database: ', error);
    }
  }

  // Criar as tabelas necessárias
  private async createTables(): Promise<void> {
    if (!this.database) {
      console.error('Database not initialized');
      return;
    }

    try {
      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          photo TEXT,
          login_date TEXT NOT NULL
        );
      `);
      console.log('Tables created successfully');
    } catch (error) {
      console.error('Error creating tables: ', error);
    }
  }

  // Salvar dados do usuário
  public async saveUser(user: UserInfo): Promise<void> {
    if (!this.database) {
      console.error('Database not initialized');
      return;
    }

    try {
      const currentDate = new Date().toISOString();
      const photoUrl = user.photo || '';
      const name = user.name || `${user.givenName || ''} ${user.familyName || ''}`.trim();

      await this.database.executeSql(
        'INSERT OR REPLACE INTO users (id, name, email, photo, login_date) VALUES (?, ?, ?, ?, ?)',
        [user.id, name, user.email, photoUrl, currentDate]
      );
      console.log('User saved successfully');
    } catch (error) {
      console.error('Error saving user: ', error);
    }
  }

  // Obter usuário pelo ID
  public async getUserById(id: string): Promise<DatabaseUser | null> {
    if (!this.database) {
      console.error('Database not initialized');
      return null;
    }

    try {
      const [results] = await this.database.executeSql(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );

      if (results.rows.length > 0) {
        const item = results.rows.item(0);
        return {
          id: item.id,
          name: item.name,
          email: item.email,
          photo: item.photo,
          loginDate: item.login_date,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user: ', error);
      return null;
    }
  }

  // Obter todos os usuários
  public async getAllUsers(): Promise<DatabaseUser[]> {
    if (!this.database) {
      console.error('Database not initialized');
      return [];
    }

    try {
      const [results] = await this.database.executeSql('SELECT * FROM users');
      const users: DatabaseUser[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        const item = results.rows.item(i);
        users.push({
          id: item.id,
          name: item.name,
          email: item.email,
          photo: item.photo,
          loginDate: item.login_date,
        });
      }
      return users;
    } catch (error) {
      console.error('Error getting users: ', error);
      return [];
    }
  }

  // Fechar o banco de dados
  public async closeDatabase(): Promise<void> {
    if (this.database) {
      await this.database.close();
      this.database = null;
      console.log('Database closed');
    }
  }
}

export default DatabaseService.getInstance();