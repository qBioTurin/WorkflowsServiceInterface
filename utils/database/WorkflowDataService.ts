"use server"
import { QueryResult } from 'pg';
import pool from "./db";
import { Step, Workflow } from '@/utils/models/workflow';
import logger from "@/utils/logger/logger";

export async function _getWorkflowData(): Promise<Workflow[]> {
  try {
    const result = await pool.query(`
      SELECT w.workflow_id, w.nome AS workflow_nome, w.descrizione AS workflow_descrizione, w.url AS workflow_url,
             s.step_id, s.nome AS step_nome, s.descrizione AS step_descrizione, s.url AS step_url, s.image AS step_image
      FROM workflows AS w
      LEFT JOIN steps AS s ON w.workflow_id = s.workflow_id
      ORDER BY w.workflow_id, s.step_id;
    `);

    if (result.rowCount === 0) {
      throw new Error("No workflows found");
    }

    const workflows = new Map<number, Workflow>();

    for (const row of result.rows) {
      let workflow = workflows.get(row.workflow_id);
      if (!workflow) {
        workflow = {
          nome: row.workflow_nome,
          descrizione: row.workflow_descrizione,
          url: row.workflow_url,
          steps: []
        };
        workflows.set(row.workflow_id, workflow);
      }

      if (row.step_id) { // Se c'è uno step associato a questa riga
        workflow.steps.push({
          nome: row.step_nome,
          url: row.step_url,
          descrizione: row.step_descrizione,
          image: row.step_image
        });
      }
    }

    return Array.from(workflows.values());
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}
