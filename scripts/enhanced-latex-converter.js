/**
 * Script aprimorado para converter arquivos LaTeX em JSON estruturado
 * Este script lida corretamente com tabelas, listas e estruturas complexas
 */

const fs = require('fs');
const path = require('path');

// Configuração de diretórios
const LATEX_DIR = path.join(__dirname, '..', 'assets', 'content', 'capitulos-latex');
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'content');

// Verifica e cria diretórios se necessário
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Remove comandos LaTeX específicos do texto
 * @param {string} text - Texto com comandos LaTeX
 * @returns {string} - Texto limpo
 */
function cleanLatexCommands(text) {
  if (!text) return '';
  
  let cleaned = text;
  
  // Remover comandos de espaçamento
  cleaned = cleaned.replace(/\\vspace\{[^}]+\}/g, '');
  cleaned = cleaned.replace(/\\hspace\{[^}]+\}/g, '');
  cleaned = cleaned.replace(/\\noindent/g, '');
  
  // Remover comandos de negrito/itálico mantendo o conteúdo
  cleaned = cleaned.replace(/\\textbf\{([^}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\textit\{([^}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\emph\{([^}]+)\}/g, '$1');
  
  // Remover comandos de formatação de ambiente
  cleaned = cleaned.replace(/\\begin\{center\}|\\end\{center\}/g, '');
  
  // Remover caracteres especiais de escape
  cleaned = cleaned.replace(/\\\\/g, ''); // Quebras de linha
  cleaned = cleaned.replace(/\\%/g, '%');
  cleaned = cleaned.replace(/\\_/g, '_');
  cleaned = cleaned.replace(/\\&/g, '&');
  cleaned = cleaned.replace(/\\#/g, '#');
  cleaned = cleaned.replace(/\\$/g, '$');
  
  // Outras limpezas
  cleaned = cleaned.replace(/\\label\{[^}]+\}/g, '');
  cleaned = cleaned.replace(/\\hypertarget\{[^}]+\}\{[^}]*\}/g, '');
  
  return cleaned.trim();
}

/**
 * Processa tabela LaTeX para formato JSON
 * @param {string} tableContent - Conteúdo da tabela em LaTeX
 * @returns {Object} - Objeto representando a tabela
 */
function parseTable(tableContent) {
  // Extrair a definição do ambiente tabular
  const tabularMatch = tableContent.match(/\\begin\{tabular\}\{([^}]+)\}/);
  if (!tabularMatch) return null;
  
  const format = tabularMatch[1];
  const columnCount = format.split('').filter(c => c === 'c' || c === 'l' || c === 'r' || c === 'p').length;
  
  // Dividir em linhas
  const rows = [];
  let headers = null;
  let caption = null;
  
  // Extrair caption se existir
  const captionMatch = tableContent.match(/\\caption\{([^}]+)\}/);
  if (captionMatch) {
    caption = cleanLatexCommands(captionMatch[1]);
  }
  
  // Extrair linhas da tabela
  const lines = tableContent
    .replace(/\\begin\{tabular\}\{[^}]+\}/, '')
    .replace(/\\end\{tabular\}[\s\S]*$/, '')
    .split('\\\\')
    .map(line => line.trim())
    .filter(line => line && !line.includes('\\hline'));
  
  // Primeira linha é o cabeçalho
  if (lines.length > 0) {
    headers = lines[0]
      .split('&')
      .map(header => cleanLatexCommands(header.trim()));
    
    // Restante são as linhas de dados
    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i]
        .split('&')
        .map(cell => cleanLatexCommands(cell.trim()));
      
      // Preencher células faltantes se necessário
      while (cells.length < columnCount) {
        cells.push('');
      }
      
      // Truncar células excedentes se necessário
      const rowData = cells.slice(0, columnCount);
      
      if (rowData.length > 0 && !rowData.every(cell => cell === '')) {
        rows.push(rowData);
      }
    }
  }
  
  return {
    type: 'table',
    headers,
    rows,
    caption
  };
}

/**
 * Processa uma lista LaTeX (itemize ou enumerate)
 * @param {string} listContent - Conteúdo da lista em LaTeX
 * @param {boolean} ordered - Se é uma lista ordenada
 * @returns {Object} - Objeto representando a lista
 */
function parseList(listContent, ordered = false) {
  // Extrair itens da lista
  const itemRegex = /\\item\s+([\s\S]*?)(?=\\item|$)/g;
  const items = [];
  let match;
  
  while ((match = itemRegex.exec(listContent)) !== null) {
    const itemContent = cleanLatexCommands(match[1].trim());
    if (itemContent) {
      items.push(itemContent);
    }
  }
  
  return {
    type: 'list',
    items,
    ordered
  };
}

/**
 * Processa uma seção LaTeX (capítulo, seção, subseção)
 * @param {string} title - Título da seção
 * @param {number} level - Nível da seção (1=capítulo, 2=seção, 3=subseção)
 * @param {string} content - Conteúdo da seção
 * @returns {Object} - Objeto representando a seção
 */
function parseSection(title, level, content) {
  const sectionContent = [];
  
  // Identificar tabelas, listas e texto normal
  const blocks = [];
  let currentBlock = { type: 'text', content: '' };
  
  // Dividir o conteúdo em blocos
  let inTable = false;
  let tableContent = '';
  let inList = false;
  let listContent = '';
  let isOrderedList = false;
  
  // Dividir o conteúdo por linhas
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Ignorar linhas vazias
    if (!line) continue;
    
    // Verificar se é início de tabela
    if (line.includes('\\begin{tabular}') || line.includes('\\begin{table}')) {
      if (currentBlock.content.trim()) {
        blocks.push(currentBlock);
        currentBlock = { type: 'text', content: '' };
      }
      
      inTable = true;
      tableContent = line;
      continue;
    }
    
    // Continuar ou finalizar tabela
    if (inTable) {
      tableContent += '\n' + line;
      
      if (line.includes('\\end{tabular}') || line.includes('\\end{table}')) {
        inTable = false;
        
        if (tableContent.includes('\\begin{tabular}')) {
          const table = parseTable(tableContent);
          if (table) {
            blocks.push(table);
          }
        }
        
        tableContent = '';
      }
      
      continue;
    }
    
    // Verificar se é início de lista
    if (line.includes('\\begin{itemize}')) {
      if (currentBlock.content.trim()) {
        blocks.push(currentBlock);
        currentBlock = { type: 'text', content: '' };
      }
      
      inList = true;
      isOrderedList = false;
      listContent = '';
      continue;
    }
    
    if (line.includes('\\begin{enumerate}')) {
      if (currentBlock.content.trim()) {
        blocks.push(currentBlock);
        currentBlock = { type: 'text', content: '' };
      }
      
      inList = true;
      isOrderedList = true;
      listContent = '';
      continue;
    }
    
    // Continuar ou finalizar lista
    if (inList) {
      listContent += '\n' + line;
      
      if (line.includes('\\end{itemize}') || line.includes('\\end{enumerate}')) {
        inList = false;
        
        const list = parseList(listContent, isOrderedList);
        if (list.items.length > 0) {
          blocks.push(list);
        }
        
        listContent = '';
      }
      
      continue;
    }
    
    // Se não for nenhum dos casos especiais, adicionar como texto
    currentBlock.content += (currentBlock.content ? '\n' : '') + line;
  }
  
  // Adicionar o último bloco se tiver conteúdo
  if (currentBlock.content.trim()) {
    blocks.push(currentBlock);
  }
  
  // Processar blocos para gerar elementos de seção
  for (const block of blocks) {
    if (block.type === 'text') {
      // Limpar comandos LaTeX
      const cleanedContent = cleanLatexCommands(block.content);
      
      // Dividir por parágrafos
      const paragraphs = cleanedContent.split('\n\n');
      
      for (const paragraph of paragraphs) {
        if (paragraph.trim()) {
          sectionContent.push({
            type: 'text',
            content: paragraph.trim(),
            style: {}
          });
        }
      }
    } else {
      sectionContent.push(block);
    }
  }
  
  return {
    type: 'section',
    title: cleanLatexCommands(title),
    level,
    content: sectionContent
  };
}

/**
 * Processa um arquivo LaTeX completo
 * @param {string} filePath - Caminho do arquivo LaTeX
 * @returns {Array} - Árvore de elementos JSON
 */
function processLatexFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const result = [];
  
  // Extrair seções
  let chapterMatch = null;
  const chapterRegex = /\\chapter\{([^}]+)\}/g;
  const sectionRegex = /\\section\{([^}]+)\}/g;
  const subsectionRegex = /\\subsection\{([^}]+)\}/g;
  
  // Identificar capítulos
  const chapters = [];
  while ((chapterMatch = chapterRegex.exec(content)) !== null) {
    chapters.push({
      title: chapterMatch[1],
      index: chapterMatch.index,
      level: 1
    });
  }
  
  // Identificar seções
  const sections = [];
  while ((sectionMatch = sectionRegex.exec(content)) !== null) {
    sections.push({
      title: sectionMatch[1],
      index: sectionMatch.index,
      level: 2
    });
  }
  
  // Identificar subseções
  const subsections = [];
  while ((subsectionMatch = subsectionRegex.exec(content)) !== null) {
    subsections.push({
      title: subsectionMatch[1],
      index: subsectionMatch.index,
      level: 3
    });
  }
  
  // Combinar todas as seções e ordená-las por índice
  const allSections = [...chapters, ...sections, ...subsections].sort((a, b) => a.index - b.index);
  
  // Processar cada seção e seu conteúdo
  for (let i = 0; i < allSections.length; i++) {
    const section = allSections[i];
    const nextSectionIndex = i < allSections.length - 1 ? allSections[i + 1].index : content.length;
    
    // Extrair conteúdo entre esta seção e a próxima
    const sectionContent = content.substring(
      content.indexOf('}', section.index) + 1,
      nextSectionIndex
    ).trim();
    
    // Processar a seção
    const sectionElement = parseSection(section.title, section.level, sectionContent);
    
    // Organizar a hierarquia das seções
    if (section.level === 1) {
      // Capítulo de nível 1
      result.push(sectionElement);
    } else if (section.level === 2) {
      // Seção de nível 2
      if (result.length > 0 && result[result.length - 1].level === 1) {
        // Adicionar à última seção de nível 1
        result[result.length - 1].content.push(sectionElement);
      } else {
        // Adicionar como seção independente
        result.push(sectionElement);
      }
    } else if (section.level === 3) {
      // Subseção de nível 3
      if (result.length > 0) {
        const lastSection = result[result.length - 1];
        
        if (lastSection.level === 1 && lastSection.content.length > 0) {
          // Último item no conteúdo da seção de nível 1
          const lastSubsection = lastSection.content[lastSection.content.length - 1];
          
          if (lastSubsection.type === 'section' && lastSubsection.level === 2) {
            // Adicionar à última subseção
            lastSubsection.content.push(sectionElement);
          } else {
            // Adicionar à seção principal
            lastSection.content.push(sectionElement);
          }
        } else if (lastSection.level === 2) {
          // Adicionar à última seção de nível 2
          lastSection.content.push(sectionElement);
        } else {
          // Adicionar como seção independente
          result.push(sectionElement);
        }
      } else {
        // Adicionar como seção independente
        result.push(sectionElement);
      }
    }
  }
  
  // Passar pelos elementos e verificar tabelas que possam estar como texto
  processTablesInElements(result);
  
  return result;
}

/**
 * Processa qualquer tabela que possa estar como texto
 * @param {Array} elements - Árvore de elementos JSON
 */
function processTablesInElements(elements) {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    
    if (element.type === 'section' && element.content) {
      processTablesInElements(element.content);
    } else if (element.type === 'text' && element.content.includes('\\begin{tabular}')) {
      // Tentar extrair tabela do texto
      const table = parseTable(element.content);
      if (table) {
        elements[i] = table;
      }
    }
  }
}

/**
 * Função principal para processar todos os arquivos LaTeX
 */
function main() {
  try {
    // Listar arquivos no diretório LaTeX
    const files = fs.readdirSync(LATEX_DIR);
    
    for (const file of files) {
      if (file.endsWith('.tex')) {
        console.log(`Processando arquivo: ${file}`);
        
        const filePath = path.join(LATEX_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, file.replace('.tex', '.json'));
        
        // Processar o arquivo
        const result = processLatexFile(filePath);
        
        // Salvar o resultado
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
        
        console.log(`Arquivo processado com sucesso: ${outputPath}`);
      }
    }
    
    console.log('Processamento concluído!');
  } catch (error) {
    console.error('Erro durante o processamento:', error);
  }
}

// Executar o script
main();
