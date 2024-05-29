"use server"
import { QueryResult } from 'pg';
import pool from "./db";
import { User } from '@/utils/models/user';
import logger from "@/utils/logger/logger";

export async function _getAllUsers(): Promise<User[]> {
    try {
      console.log("aia")
      const result: QueryResult<User> = await pool.query(
        "SELECT * FROM users"
      );
      if (result.rowCount !== null && result.rowCount === 0) {
        throw new Error("Error in _getUseRestrictions(). Result database error");
      }
      console.log("aia"+result)
      return result.rows;
    } catch (error) {
      //TODO qui genera l'errore quando faccio il prerendering perchè non trova il db
      logger.error("Error executing query");
      logger.error(error);
      console.error("Error executing query", error);
      throw error;
    }
}

export async function _getUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
    try {
      const result: QueryResult<User> = await pool.query(
        'SELECT * FROM users WHERE email = $1 AND password_hash = $2',
        [email, password]
      );
      if (result.rowCount === 0) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      logger.error('Error executing query', error);
      console.error('Error executing query', error);
      throw error;
    }
}

export async function _addUser(user: User): Promise<User> {
  try {
      const { email, password_hash, first_name, last_name, phone, country } = user;
      const result = await pool.query(
          `INSERT INTO users (email, password_hash, first_name, last_name, phone, country)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *;`,  // La clausola RETURNING * restituirà il nuovo utente inserito, inclusi i campi generati automaticamente come l'id
          [email, password_hash, first_name, last_name, phone, country]
      );
      
      if (result.rowCount === 0) {
          throw new Error("Insertion failed, no rows affected.");
      }

      return result.rows[0];  // Restituisce il primo utente inserito
  } catch (error) {
      logger.error('Error executing query', error);
      console.error('Error executing query', error);
      throw error;
  }
}