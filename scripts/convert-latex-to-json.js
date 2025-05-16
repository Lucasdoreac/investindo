/**
 * Script para converter capítulos em LaTeX para JSON estruturado
 * Este script auxilia na conversão dos arquivos .tex para o formato JSON
 * utilizado pelo aplicativo para renderizar o conteúdo formatado.
 */

const fs = require('fs');
const path = require('path');

// Diretório contendo os arquivos LaTeX dos capítulos
const LATEX_DIR = path.join(__dirname, '..', 'assets', 'content', 'capitulos-latex');
// Diretório para salvar os arquivos JSON convertidos
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'content');

// Verifica se os diretórios existem
try {
  if (!fs.existsSync(LATEX_DIR)) {
    console.error(`Diretório não encontrado: ${LATEX_DIR}`);
    process.exit(1);
  }
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.error(`Diretório não encontrado: ${OUTPUT_DIR}`);
    process.exit(1);
  }
} catch (err) {
  console.error('Erro ao verificar diretórios:', err);
  process.exit(1);
}

/**
 * Converte um título LaTeX (capítulo, seção, etc.) para um elemento JSON estruturado
 * @param {string} title - Título extraído do LaTeX
 * @param {number} level - Nível do título (1=capítulo, 2=seção, etc.)
 * @returns {Object} - Elemento JSON representando o título
 */
function createSectionElement(title, level) {
  return {
    type: 'section',
    title: title.trim(),
    level,
    content: []
  };
}

/**
 * Converte texto LaTeX em um elemento de texto JSON
 * @param {string} text - Texto extraído do LaTeX
 * @param {Object} style - Estilos opcionais (negrito, itálico, etc.)
 * @returns {Object} - Elemento JSON representando o texto
 */
function createTextElement(text, style = {}) {
  return {
    type: 'text',
    content: text.trim(),
    style
  };
}

/**
 * Converte uma lista LaTeX em um elemento de lista JSON
 * @param {string[]} items - Itens da lista
 * @param {boolean} ordered - Se a lista é ordenada ou não
 * @returns {Object} - Elemento JSON representando a lista
 */
function createListElement(items, ordered = false) {
  return {
    type: 'list',
    items,
    ordered
  };
}

/**
 * Converte uma tabela LaTeX em um elemento de tabela JSON
 * @param {string[]} headers - Cabeçalhos da tabela
 * @param {string[][]} rows - Linhas da tabela
 * @param {string} caption - Legenda da tabela
 * @returns {Object} - Elemento JSON representando a tabela
 */
function createTableElement(headers, rows, caption) {
  return {
    type: 'table',
    headers,
    rows,
    caption
  };
}

/**
 * Converte um destaque/caixa LaTeX em um elemento de destaque JSON
 * @param {string} content - Conteúdo do destaque
 * @param {string} style - Estilo do destaque (info, warning, important)
 * @returns {Object} - Elemento JSON representando o destaque
 */
function createHighlightElement(content, style = 'info') {
  return {
    type: 'highlight',
    content,
    style
  };
}

/**
 * Função principal para converter um arquivo LaTeX em JSON estruturado
 * @param {string} filename - Nome do arquivo LaTeX a ser convertido
 */
function convertLatexToJson(filename) {
  const filePath = path.join(LATEX_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`Lendo arquivo: ${filePath}`);
  
  // Resultado JSON a ser construído
  const result = [];
  
  // Exemplo simples de conversão para demonstrar a estrutura
  // Capítulo principal
  const chapterMatch = content.match(/\\chapter\{([^}]+)\}/);
  if (chapterMatch) {
    const chapterTitle = chapterMatch[1];
    console.log(`Processando capítulo: ${chapterTitle}`);
    
    const chapterElement = createSectionElement(chapterTitle, 1);
    
    // Processar seções
    const sectionRegex = /\\section\{([^}]+)\}/g;
    let sectionMatch;
    const sections = [];
    
    while ((sectionMatch = sectionRegex.exec(content)) !== null) {
      sections.push({
        title: sectionMatch[1],
        index: sectionMatch.index
      });
    }
    
    // Adicionar conteúdo para cada seção
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const nextSectionIndex = i < sections.length - 1 ? sections[i + 1].index : content.length;
      
      // Extrair o conteúdo entre esta seção e a próxima
      const sectionContent = content.substring(
        content.indexOf('}', section.index) + 1,
        nextSectionIndex
      ).trim();
      
      console.log(`  Processando seção: ${section.title}`);
      
      const sectionElement = createSectionElement(section.title, 2);
      
      // Adicionar texto básico como exemplo
      sectionElement.content.push(
        createTextElement(`Conteúdo da seção "${section.title}" (${sectionContent.length} caracteres)`)
      );
      
      // Exemplo: adicionar lista de itens se encontrada
      const listMatch = sectionContent.match(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/);
      if (listMatch) {
        // Extrair itens da lista
        const itemRegex = /\\item\s+([^\n]+)/g;
        const items = [];
        let itemMatch;
        
        while ((itemMatch = itemRegex.exec(listMatch[1])) !== null) {
          items.push(itemMatch[1].trim());
        }
        
        if (items.length > 0) {
          sectionElement.content.push(createListElement(items, false));
        }
      }
      
      chapterElement.content.push(sectionElement);
    }
    
    result.push(chapterElement);
  } else {
    console.warn(`Nenhum capítulo encontrado em ${filename}`);
  }
  
  // Salvar o JSON resultante
  const outputFileName = filename.replace('.tex', '.json');
  const outputPath = path.join(OUTPUT_DIR, outputFileName);
  
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`Convertido: ${filename} -> ${outputPath}`);
}

/**
 * Processa todos os arquivos LaTeX no diretório
 */
function processAllFiles() {
  try {
    const files = fs.readdirSync(LATEX_DIR);
    console.log(`Encontrados ${files.length} arquivos em ${LATEX_DIR}`);
    
    let processedCount = 0;
    
    for (const file of files) {
      if (file.endsWith('.tex')) {
        console.log(`\nProcessando: ${file}`);
        try {
          convertLatexToJson(file);
          processedCount++;
        } catch (err) {
          console.error(`Erro ao processar ${file}:`, err);
        }
      }
    }
    
    console.log(`\nConversão concluída! ${processedCount} arquivos processados.`);
  } catch (err) {
    console.error('Erro ao ler diretório:', err);
  }
}

// Executar a conversão
console.log('Iniciando conversão de LaTeX para JSON...');
processAllFiles();
