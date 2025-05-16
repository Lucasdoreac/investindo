/**
 * Script Unificado de Conversão LaTeX -> JSON
 * 
 * Este script substitui todos os conversores anteriores com uma abordagem robusta
 * para criar arquivos JSON completos e consistentes a partir dos originais LaTeX.
 * 
 * Características:
 * - Processamento correto de tabelas, listas e formatação
 * - Preservação de todos os elementos do documento original
 * - Compatibilidade total com o visualizador Enhanced
 * - Validação de saída para garantir completude
 */

const fs = require('fs');
const path = require('path');

// Configuração de diretórios
const LATEX_DIR = path.join(__dirname, '..', 'assets', 'content', 'capitulos-latex');
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'content');
const VALIDATION_DIR = path.join(__dirname, '..', 'assets', 'content'); // Para comparar com Markdown

// Verifica e cria diretórios se necessário
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Diretório criado: ${dir}`);
  }
}

// ==========================
// FUNÇÕES DE PROCESSAMENTO
// ==========================

/**
 * Processa comandos de formatação LaTeX como negrito, itálico, etc.
 */
function processFormatting(text) {
  if (!text) return '';
  
  let processed = text;
  
  // Processar comandos de formatação
  processed = processed.replace(/\\textbf{([^}]+)}/g, '$1'); // Texto em negrito
  processed = processed.replace(/\\textit{([^}]+)}/g, '$1'); // Texto em itálico
  processed = processed.replace(/\\emph{([^}]+)}/g, '$1');   // Texto enfatizado
  
  // Processar caracteres especiais
  processed = processed.replace(/\\%/g, '%');    // Símbolo de porcentagem
  processed = processed.replace(/\\_/g, '_');    // Underscore
  processed = processed.replace(/\\&/g, '&');    // E comercial
  processed = processed.replace(/\\#/g, '#');    // Cerquilha
  processed = processed.replace(/\\\\([^\\]+)/g, '$1'); // Quebras de linha (\\)
  
  // Processar símbolos matemáticos
  processed = processed.replace(/\$([^$]+)\$/g, '$1'); // Fórmulas inline
  
  // Remover comandos de espaçamento
  processed = processed.replace(/\\vspace{[^}]+}/g, '');
  processed = processed.replace(/\\hspace{[^}]+}/g, '');
  processed = processed.replace(/\\noindent/g, '');
  
  // Limpar outros resíduos de comandos
  processed = processed.replace(/\\footnote{[^}]+}/g, '');
  processed = processed.replace(/\\label{[^}]+}/g, '');
  processed = processed.replace(/\\ref{[^}]+}/g, '');
  
  return processed.trim();
}

/**
 * Processa uma tabela LaTeX para formato JSON
 */
function parseTable(tableContent) {
  //