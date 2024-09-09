"use server";

import { QueryResult } from 'pg';
import pool from './db';
import logger from '@/utils/logger/logger';
import { Analysis, ReportFile } from '../models/models';

export async function insertAnalysis(analysis: Analysis): Promise<Analysis> {
  try {
    const { analysis_id, analysis_name, user_id, creation_timestamp, status } = analysis;
    const query = `
      INSERT INTO analyses (analysis_id, analysis_name, user_id, creation_timestamp, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [analysis_id, analysis_name, user_id, creation_timestamp, status];
    const result = await pool.query<Analysis>(query, values);

    if (result.rowCount === 0) {
      throw new Error("Insertion failed, no rows affected.");
    }

    return result.rows[0];
  } catch (error) {
    logger.error("Error executing query", error);
    throw error;
  }
}

export async function insertReportFile(reportFile: ReportFile): Promise<ReportFile> {
  try {
    const { analysis_id, report_path, expiration_date } = reportFile;
    const query = `
      INSERT INTO report_files (analysis_id, report_path, expiration_date)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [analysis_id, report_path, expiration_date];
    const result = await pool.query<ReportFile>(query, values);

    if (result.rowCount === 0) {
      throw new Error("Insertion failed, no rows affected.");
    }

    return result.rows[0];
  } catch (error) {
    logger.error("Error executing query", error);
    throw error;
  }
}

// Import the query function from db.ts
import { query as dbQuery } from './db';

export async function getAnalysesByUserId(
    userId: number,
    limit: number,
    offset: number,
    search: string
  ): Promise<{ analyses: (Analysis & { report_files: ReportFile[] })[], total: number }> {
    try {
      const queryText = `
        SELECT a.*, COALESCE(json_agg(r.*) FILTER (WHERE r.analysis_id IS NOT NULL), '[]') AS report_files
        FROM analyses a
        LEFT JOIN report_files r ON a.analysis_id = r.analysis_id
        WHERE a.user_id = $1 AND a.analysis_name ILIKE $2
        GROUP BY a.analysis_id
        LIMIT $3 OFFSET $4;
      `;
      const countQuery = `
        SELECT COUNT(*) as total
        FROM analyses
        WHERE user_id = $1 AND analysis_name ILIKE $2;
      `;
      const searchPattern = `%${search}%`;
      const values = [userId, searchPattern, limit, offset];
      const countValues = [userId, searchPattern];
  
      const result: QueryResult<(Analysis & { report_files: ReportFile[] })> = await dbQuery(queryText, values);
      const countResult: QueryResult<{ total: number }> = await dbQuery(countQuery, countValues);

      console.log("Risultati query:"+result);
  
      const total = parseInt(countResult.rows[0].total.toString(), 10);
  
      return { analyses: result.rows, total };
    } catch (error) {
      logger.error("Error executing query", error);
      throw error;
    }
  }