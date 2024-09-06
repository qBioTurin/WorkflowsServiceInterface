"use server"
import pool from "./db";
import {Workflow}  from '@/utils/models/workflow';
import logger from "@/utils/logger/logger";

export async function _getWorkflowData(): Promise<Workflow[]> {
  try {
    const result = await pool.query(`
      SELECT w.workflow_id as workflow_id, w.nome AS workflow_nome, w.descrizione AS workflow_descrizione, w.url AS workflow_url,
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
      // Trova o crea il workflow
      let workflow = workflows.get(row.workflow_id);
      if (!workflow) {
        workflow = {
          workflow_id: row.workflow_id,
          nome: row.workflow_nome,
          descrizione: row.workflow_descrizione,
          url: row.workflow_url,
          steps: [] // Inizializza l'array dei passi
        };
        workflows.set(row.workflow_id, workflow);
      }

      // Aggiungi il passo se esiste
      if (row.step_id) {
        workflow.steps.push({
          step_id: row.step_id,
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

export async function _getWorkflowByName(nome: string): Promise<Workflow | null> {
  try {
    // Usiamo TRIM per eliminare gli spazi non voluti nel confronto SQL
    const result = await pool.query(`
      SELECT w.workflow_id, w.nome AS workflow_nome, w.descrizione AS workflow_descrizione, w.url AS workflow_url,
             s.step_id, s.nome AS step_nome, s.descrizione AS step_descrizione, s.url AS step_url, s.image AS step_image
      FROM workflows AS w
      LEFT JOIN steps AS s ON w.workflow_id = s.workflow_id
      WHERE TRIM(w.nome) = TRIM($1)  -- Assicurati che il confronto del nome sia indipendente dagli spazi
      ORDER BY s.step_id;
    `, [nome]);

    // Se nessun workflow viene trovato, ritorna null
    if (result.rowCount === 0) {
      return null; // Workflow non trovato
    }

    // Crea il workflow
    const workflow: Workflow = {
      workflow_id: result.rows[0].workflow_id,
      nome: result.rows[0].workflow_nome,
      descrizione: result.rows[0].workflow_descrizione,
      url: result.rows[0].workflow_url,
      steps: []
    };

    // Aggiungi tutti gli step associati a questo workflow
    for (const row of result.rows) {
      if (row.step_id) {
        workflow.steps.push({
          step_id: row.step_id,
          nome: row.step_nome,
          url: row.step_url,
          descrizione: row.step_descrizione,
          image: row.step_image
        });
      }
    }

    return workflow; // Ritorna il workflow completo
  } catch (error) {
    logger.error("Error fetching workflow by name:", error);
    throw new Error(`Errore durante il recupero del workflow: ${nome}`);
  }
}
