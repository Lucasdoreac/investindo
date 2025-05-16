/**
 * Script para converter conteúdo Markdown em JSON estruturado
 * Este script gera arquivos JSON a partir dos conteúdos em Markdown
 * para uso com os componentes EnhancedEbookContent e FixedContentView
 */

const fs = require('fs');
const path = require('path');

// Caminho dos conteúdos Markdown (embutidos no arquivo biblioteca.tsx)
const BIBLIOTECA_PATH = path.join(__dirname, '..', 'app', '(tabs)', 'biblioteca.tsx');
// Diretório de saída para os arquivos JSON gerados
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'content');

// Verifica e cria diretórios se necessário
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Diretório criado: ${OUTPUT_DIR}`);
}

/**
 * Converte texto Markdown para JSON estruturado
 * @param {string} markdown - Conteúdo em Markdown
 * @returns {Array} - Array de elementos estruturados em formato JSON
 */
function convertMarkdownToJson(markdown) {
  const lines = markdown.split('\n');
  const elements = [];
  
  let currentSection = null;
  let inTable = false;
  let tableHeaders = null;
  let tableRows = [];
  let inList = false;
  let listItems = [];
  let isOrderedList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Ignorar linhas vazias
    if (!line) {
      // Se estiver em uma lista e encontrar linha vazia, finaliza a lista
      if (inList) {
        if (currentSection) {
          currentSection.content.push({
            type: 'list',
            items: listItems,
            ordered: isOrderedList
          });
        } else {
          elements.push({
            type: 'list',
            items: listItems,
            ordered: isOrderedList
          });
        }
        inList = false;
        listItems = [];
      }
      continue;
    }
    
    // Detectar cabeçalhos
    if (line.startsWith('# ')) {
      // Finaliza seção atual se existir
      if (currentSection) {
        elements.push(currentSection);
      }
      
      // Inicia uma nova seção (capítulo)
      currentSection = {
        type: 'section',
        title: line.substring(2),
        level: 1,
        content: []
      };
      continue;
    }
    
    if (line.startsWith('## ')) {
      // Finaliza seção atual se existir em nível 2+
      if (currentSection && currentSection.level > 1) {
        // Se já estiver dentro de uma seção de nível 1, adiciona ali
        if (elements.length > 0 && elements[elements.length - 1].type === 'section' && 
            elements[elements.length - 1].level === 1) {
          elements[elements.length - 1].content.push(currentSection);
        } else {
          elements.push(currentSection);
        }
      }
      
      // Inicia uma nova seção (seção)
      currentSection = {
        type: 'section',
        title: line.substring(3),
        level: 2,
        content: []
      };
      continue;
    }
    
    if (line.startsWith('### ')) {
      // Finaliza seção atual se existir em nível 3+
      if (currentSection && currentSection.level > 2) {
        // Se já estiver dentro de uma seção de nível 2, adiciona ali
        if (elements.length > 0 && elements[elements.length - 1].type === 'section' && 
            elements[elements.length - 1].content && elements[elements.length - 1].content.length > 0) {
          const lastSection = elements[elements.length - 1];
          const lastSubsection = lastSection.content[lastSection.content.length - 1];
          if (lastSubsection.type === 'section' && lastSubsection.level === 2) {
            lastSubsection.content.push(currentSection);
          } else {
            if (currentSection) {
              lastSection.content.push(currentSection);
            }
          }
        } else if (currentSection) {
          elements.push(currentSection);
        }
      }
      
      // Inicia uma nova seção (subseção)
      currentSection = {
        type: 'section',
        title: line.substring(4),
        level: 3,
        content: []
      };
      continue;
    }
    
    // Detectar início de tabela
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHeaders = line
          .split('|')
          .slice(1, -1) // Remove as barras inicial e final
          .map(header => header.trim());
        
        // Se próxima linha for separador de tabela, pula
        if (i + 1 < lines.length && lines[i + 1].trim().startsWith('|--')) {
          i++;
        }
      } else {
        // Adicionar linha à tabela
        const row = line
          .split('|')
          .slice(1, -1) // Remove as barras inicial e final
          .map(cell => cell.trim());
        
        tableRows.push(row);
        
        // Se próxima linha não for tabela, finaliza tabela
        if (i + 1 >= lines.length || !lines[i + 1].trim().startsWith('|')) {
          const tableElement = {
            type: 'table',
            headers: tableHeaders,
            rows: tableRows,
            caption: null
          };
          
          if (currentSection) {
            currentSection.content.push(tableElement);
          } else {
            elements.push(tableElement);
          }
          
          inTable = false;
          tableHeaders = null;
          tableRows = [];
        }
      }
      continue;
    }
    
    // Detectar listas
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        inList = true;
        isOrderedList = false;
        listItems = [];
      }
      
      listItems.push(line.substring(2));
      
      // Se próxima linha não for lista, finaliza lista
      if (i + 1 >= lines.length || 
          (!lines[i + 1].trim().startsWith('- ') && 
           !lines[i + 1].trim().startsWith('* ') && 
           !lines[i + 1].trim().startsWith('1. '))) {
        if (currentSection) {
          currentSection.content.push({
            type: 'list',
            items: listItems,
            ordered: isOrderedList
          });
        } else {
          elements.push({
            type: 'list',
            items: listItems,
            ordered: isOrderedList
          });
        }
        inList = false;
        listItems = [];
      }
      continue;
    }
    
    // Detectar listas numeradas
    if (/^\d+\.\s/.test(line)) {
      if (!inList) {
        inList = true;
        isOrderedList = true;
        listItems = [];
      }
      
      // Extrair o texto após o número e o ponto
      const itemText = line.replace(/^\d+\.\s/, '');
      listItems.push(itemText);
      
      // Se próxima linha não for lista, finaliza lista
      if (i + 1 >= lines.length || 
          (!lines[i + 1].trim().startsWith('- ') && 
           !lines[i + 1].trim().startsWith('* ') && 
           !/^\d+\.\s/.test(lines[i + 1].trim()))) {
        if (currentSection) {
          currentSection.content.push({
            type: 'list',
            items: listItems,
            ordered: isOrderedList
          });
        } else {
          elements.push({
            type: 'list',
            items: listItems,
            ordered: isOrderedList
          });
        }
        inList = false;
        listItems = [];
      }
      continue;
    }
    
    // Texto normal (parágrafo)
    if (currentSection) {
      currentSection.content.push({
        type: 'text',
        content: line,
        style: detectTextStyle(line)
      });
    } else {
      elements.push({
        type: 'text',
        content: line,
        style: detectTextStyle(line)
      });
    }
  }
  
  // Adicionar última seção se existir
  if (currentSection) {
    // Verificar se há seções abertas onde adicionar
    if (elements.length > 0 && elements[elements.length - 1].type === 'section') {
      const lastSection = elements[elements.length - 1];
      
      // Se a última seção for de nível 1 e a atual for de nível 2 ou 3
      if (lastSection.level === 1 && currentSection.level > 1) {
        // Se for nível 2, adiciona diretamente ao conteúdo
        if (currentSection.level === 2) {
          lastSection.content.push(currentSection);
        } 
        // Se for nível 3, procura uma seção de nível 2 onde adicionar
        else if (currentSection.level === 3) {
          let added = false;
          
          // Percorre conteúdo da última seção procurando uma subseção
          for (let i = lastSection.content.length - 1; i >= 0; i--) {
            if (lastSection.content[i].type === 'section' && lastSection.content[i].level === 2) {
              lastSection.content[i].content.push(currentSection);
              added = true;
              break;
            }
          }
          
          // Se não encontrou seção de nível 2, adiciona diretamente
          if (!added) {
            lastSection.content.push(currentSection);
          }
        }
      } 
      // Caso contrário, adiciona normalmente
      else {
        elements.push(currentSection);
      }
    } else {
      elements.push(currentSection);
    }
  }
  
  return elements;
}

/**
 * Detecta estilo de formatação no texto (negrito, itálico)
 * @param {string} text - Texto a ser analisado
 * @returns {Object} - Objeto com propriedades de estilo
 */
function detectTextStyle(text) {
  const style = {};
  
  // Detectar negrito (** ou __)
  if (text.includes('**') || text.includes('__')) {
    style.bold = true;
  }
  
  // Detectar itálico (* ou _)
  if (text.includes('*') || text.includes('_')) {
    style.italic = true;
  }
  
  return style;
}

/**
 * Extrai conteúdo Markdown do arquivo biblioteca.tsx
 * @returns {Object} - Objeto com os conteúdos Markdown de cada capítulo
 */
function extractMarkdownContent() {
  const fileContent = fs.readFileSync(BIBLIOTECA_PATH, 'utf8');
  const chapters = {};
  
  // Regex atualizada para encontrar conteúdo de capítulos
  const chapterPattern = /id:\s*['"](\d+)['"][\s\S]*?conteudo:\s*`([\s\S]*?)`/g;
  let match;
  
  while ((match = chapterPattern.exec(fileContent)) !== null) {
    const chapterId = match[1];
    const chapterContent = match[2];
    chapters[chapterId] = chapterContent;
    console.log(`Encontrado capítulo ${chapterId} com ${chapterContent.length} caracteres`);
  }
  
  if (Object.keys(chapters).length === 0) {
    console.error('Nenhum capítulo encontrado no arquivo. Verificando conteúdo completo...');
    
    // Vamos tentar um padrão mais simples
    console.log('Tentando padrão alternativo...');
    const simplePattern = /conteudo:\s*`([\s\S]*?)`/g;
    let simpleMatch;
    let count = 0;
    
    while ((simpleMatch = simplePattern.exec(fileContent)) !== null) {
      count++;
      console.log(`Encontrado bloco de conteúdo #${count} com ${simpleMatch[1].length} caracteres`);
    }
  }
  
  return chapters;
}['"](\d+)['"].*?conteudo:\s*`([\s\S]*?)`/g;
  let match;
  
  while ((match = chapterPattern.exec(fileContent)) !== null) {
    const chapterId = match[1];
    const chapterContent = match[2];
    chapters[chapterId] = chapterContent;
    console.log(`Encontrado capítulo ${chapterId} com ${chapterContent.length} caracteres`);
  }
  
  if (Object.keys(chapters).length === 0) {
    console.error('Nenhum capítulo encontrado no arquivo. Verifique o padrão regex.');
    console.log('Primeiros 500 caracteres do arquivo:');
    console.log(fileContent.substring(0, 500));
  }
  
  return chapters;
}

/**
 * Função principal
 */
function main() {
  console.log('Iniciando conversão de Markdown para JSON estruturado...');
  
  try {
    // Extrair conteúdos Markdown
    const chaptersMarkdown = extractMarkdownContent();
    
    // Converter cada capítulo para JSON
    for (const [id, content] of Object.entries(chaptersMarkdown)) {
      console.log(`Processando capítulo ${id}...`);
      
      // Converter markdown para JSON
      const jsonContent = convertMarkdownToJson(content);
      
      // Salvar arquivo JSON
      const outputPath = path.join(OUTPUT_DIR, `capitulo${id}-converted.json`);
      fs.writeFileSync(outputPath, JSON.stringify(jsonContent, null, 2), 'utf8');
      
      console.log(`Capítulo ${id} salvo em: ${outputPath}`);
    }
    
    console.log('Conversão concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a conversão:', error);
  }
}

main();
