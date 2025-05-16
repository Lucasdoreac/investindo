/**
 * Utilitário para processar e converter comandos LaTeX em dados formatados
 * para exibição no componente EnhancedEbookContent
 */

// Tipo de elemento processado
import { LatexElement } from '../types/LatexTypes';

/**
 * Processa um objeto de conteúdo LaTeX e converte comandos para formato estruturado
 * @param content Objeto de conteúdo com possíveis comandos LaTeX
 * @returns Objeto processado com comandos convertidos para formato adequado
 */
export function processLatexCommands(content: any): any {
  // Se o conteúdo for um array
  if (Array.isArray(content)) {
    return content.map(item => processLatexCommands(item));
  }

  // Se o conteúdo for um objeto (verificar se tem tipo 'text')
  if (content && typeof content === 'object' && content.type === 'text') {
    // Processar o texto para remover/substituir comandos LaTeX comuns
    const processedContent = {
      ...content,
      content: processLatexText(content.content),
    };
    
    // Atualizar estilo com base em comandos
    if (content.content.includes('\\textbf{')) {
      processedContent.style = {
        ...processedContent.style,
        bold: true,
      };
    }
    
    if (content.content.includes('\\textit{')) {
      processedContent.style = {
        ...processedContent.style,
        italic: true,
      };
    }
    
    return processedContent;
  }
  
  // Para outros tipos de elementos, retornar como está
  return content;
}

/**
 * Processa texto contendo comandos LaTeX e substitui por equivalentes simples
 * @param text Texto com possíveis comandos LaTeX
 * @returns Texto processado sem comandos LaTeX
 */
export function processLatexText(text: string): string {
  if (!text) return '';
  
  // Substituir comandos LaTeX comuns
  let processed = text;
  
  // Ignorar comandos de hipertarget
  processed = processed.replace(/\\hypertarget{.*?}{}/g, '');
  
  // Remover comandos de espaçamento vertical
  processed = processed.replace(/\\vspace{.*?}/g, '');
  
  // Remover comandos de indentação
  processed = processed.replace(/\\noindent/g, '');
  
  // Processar negrito
  processed = processed.replace(/\\textbf{(.*?)}/g, '$1');
  
  // Processar itálico
  processed = processed.replace(/\\textit{(.*?)}/g, '$1');
  
  // Remover comandos de centro
  processed = processed.replace(/\\begin{center}|\\end{center}/g, '');
  
  // Remover comandos de ambiente picture
  processed = processed.replace(/\\begin{picture}.*?\\end{picture}/gs, '[FIGURA]');
  
  // Remover comandos de ambiente minipage e chaves extras
  processed = processed.replace(/\\begin{minipage}.*?\\end{minipage}/gs, '');
  processed = processed.replace(/\\end{minipage}/g, '');
  processed = processed.replace(/\\end{minipage}}/g, '');
  processed = processed.replace(/\\begin{minipage}.*?}/gs, '');
  
  // Remover comandos de ambiente itemize/enumerate
  processed = processed.replace(/\\end{itemize}|\\end{enumerate}/g, '');
  processed = processed.replace(/\\begin{itemize}|\\begin{enumerate}/g, '');
  
  // Limpar marcadores de final de lista em itens
  processed = processed.replace(/\\end{itemize}$/g, '');
  processed = processed.replace(/\\end{enumerate}$/g, '');
  
  // Remover comandos de fim de tabela
  processed = processed.replace(/\\end{table}/g, '');
  processed = processed.replace(/\\begin{table}/g, '');
  
  // Remover comandos de caption
  processed = processed.replace(/\\caption{(.*?)}/g, '$1');
  
  // Remover comandos de label
  processed = processed.replace(/\\label{.*?}/g, '');
  
  // Processar símbolos de porcentagem e outros caracteres especiais
  processed = processed.replace(/(\d+)\\%/g, '$1%');  // Converte números seguidos de \% para %
  processed = processed.replace(/\\%/g, '%');          // Converte \% para %
  processed = processed.replace(/R\\\\\\$/g, 'R$');    // Converte R\$ para R$
  processed = processed.replace(/R\\\$/g, 'R$');      // Converte R\$ para R$
  
  // Remover outros caracteres de escape
  processed = processed.replace(/\\_/g, '_');
  processed = processed.replace(/\\&/g, '&');
  processed = processed.replace(/\\#/g, '#');
  
  // Processar listas e marcadores
  processed = processed.replace(/\\item\s*/g, '');  // Remove marcadores de item
  processed = processed.replace(/\\begin{itemize}\s*/g, '');  // Remove início de lista não ordenada
  processed = processed.replace(/\\end{itemize}\s*/g, '');   // Remove fim de lista não ordenada
  processed = processed.replace(/\\begin{enumerate}\s*/g, ''); // Remove início de lista ordenada
  processed = processed.replace(/\\end{enumerate}\s*/g, '');  // Remove fim de lista ordenada
  
  // Remover comandos de subsection/subsubsection
  processed = processed.replace(/\\subsubsection{(.*?)}/g, '$1');
  processed = processed.replace(/\\subsection{(.*?)}/g, '$1');
  
  // Remover traços duplos ou triplos LaTeX para traço simples
  processed = processed.replace(/---/g, '—');
  processed = processed.replace(/--/g, '–');
  
  // Substituir comandos makeboxes por seu conteúdo
  processed = processed.replace(/\\makebox\(.*?\){(.*?)}/g, '$1');
  
  // Remover comandos put (usados para desenhar)
  processed = processed.replace(/\\put\(.*?\){.*?}/g, '');
  
  // Remover comandos line (usados para desenhar)
  processed = processed.replace(/\\line\(.*?\){.*?}/g, '');
  
  // Corrigir chaves residuais de comandos LaTeX
  processed = processed.replace(/\${(.*?)}/g, '$1'); // Remover $ e manter conteúdo
  processed = processed.replace(/\$1/g, ''); // Remover $1
  
  // Limpar símbolos de porcentagem em comandos LaTeX
  processed = processed.replace(/% .*/g, '');
  
  // Remover tags fbox e parbox
  processed = processed.replace(/\\fbox{\\parbox{.*?}(.*?)}/gs, '$1');
  
  // Remover comandos específicos para ambiente LaTeX
  processed = processed.replace(/\\centering/g, '');
  
  // Remover símbolos de chaves que sobram
  processed = processed.replace(/^}+|^{+|}}+$|{{+$/g, '');
  processed = processed.replace(/}$/g, '');
  processed = processed.replace(/\\end{[^}]*}$/, '');
  
  return processed;
}

/**
 * Corrige os nós de lista no objeto JSON para garantir que estejam conectados 
 * às seções corretas e formatados adequadamente
 * @param content Objeto JSON de conteúdo do capítulo
 * @returns Objeto JSON corrigido com listas adequadamente estruturadas
 */
export function fixListStructure(content: any[]): any[] {
  const result: any[] = [];
  let currentSection: any = null;
  
  // Primeiro passo: coletar todas as seções
  for (let i = 0; i < content.length; i++) {
    const item = content[i];
    
    if (item.type === 'section') {
      currentSection = { ...item, content: [...item.content] };
      result.push(currentSection);
    } else if (item.type === 'list') {
      // Se encontrarmos uma lista fora de uma seção, conectá-la à seção anterior
      if (currentSection) {
        // Processar itens de lista para remover comandos LaTeX
        const processedItems = item.items.map((listItem: any) => {
          if (typeof listItem === 'string') {
            return processLatexText(listItem);
          }
          return listItem;
        });
        
        // Adicionar a lista processada à seção atual
        currentSection.content.push({
          type: 'list',
          items: processedItems,
          ordered: item.ordered || false
        });
      } else {
        // Se não houver seção anterior, criar uma seção genérica
        currentSection = {
          type: 'section',
          title: 'Lista',
          level: 3,
          content: [{
            type: 'list',
            items: item.items.map((listItem: any) => {
              if (typeof listItem === 'string') {
                return processLatexText(listItem);
              }
              return listItem;
            }),
            ordered: item.ordered || false
          }]
        };
        result.push(currentSection);
      }
    } else {
      // Outros tipos de elementos são adicionados à seção atual ou ignorados
      if (currentSection) {
        currentSection.content.push(item);
      } else {
        result.push(item);
      }
    }
  }
  
  // Processar cada seção para remover comandos LaTeX
  for (let i = 0; i < result.length; i++) {
    if (result[i].type === 'section') {
      result[i].title = processLatexText(result[i].title);
    }
  }
  
  return result;
}

/**
 * Processa completamente o conteúdo LaTeX para ser exibido corretamente
 * @param content Conteúdo original do capítulo
 * @returns Conteúdo processado pronto para exibição
 */
export function processLatexContent(content: any[]): LatexElement[] {
  // Primeiro fixar a estrutura de listas
  const structureFixed = fixListStructure(content);
  
  // Depois processar comandos LaTeX em todos os textos
  return processLatexCommands(structureFixed) as LatexElement[];
}

/**
 * Processa um arquivo JSON de capítulo para criar um formato alternativo mais compatível
 * com o sistema de renderização
 * @param capituloId ID do capítulo para processamento
 * @param conteudoBruto Conteúdo bruto do arquivo JSON
 * @returns Conteúdo formatado e processado para exibição adequada
 */
export function processarCapituloJson(capituloId: string, conteudoBruto: any[]): LatexElement[] {
  // Processar comandos LaTeX e estrutura
  const conteudoProcessado = processLatexContent(conteudoBruto);
  
  // Todos os capítulos possuem problemas de formatação com comandos LaTeX
  // Garantir que todos os títulos e conteúdos de seções estejam corretamente processados
  conteudoProcessado.forEach((secao: any) => {
    if (secao.type === 'section') {
      secao.title = processLatexText(secao.title);
      
      // Processar conteúdo das seções
      if (secao.content && Array.isArray(secao.content)) {
        secao.content.forEach((item: any) => {
          if (item.type === 'text' && item.content) {
            item.content = processLatexText(item.content);
          } else if (item.type === 'list' && item.items && Array.isArray(item.items)) {
            item.items = item.items.map((listItem: any) => {
              if (typeof listItem === 'string') {
                return processLatexText(listItem);
              }
              return listItem;
            });
          } else if (item.type === 'highlight' && typeof item.content === 'string') {
            item.content = processLatexText(item.content);
          } else if (item.type === 'table' && item.headers) {
            // Processar cabeçalhos de tabelas
            item.headers = item.headers.map((header: string) => processLatexText(header));
            // Processar células da tabela
            if (item.rows && Array.isArray(item.rows)) {
              item.rows = item.rows.map((row: string[]) => 
                row.map((cell: string) => {
                  // Processamento especial para células de tabela
                  let processedCell = processLatexText(cell);
                  
                  // Processamento de porcentagens e valores
                  processedCell = processedCell.replace(/(\d+)[,\.]?(\d*)\\%/g, '$1$2%');
                  processedCell = processedCell.replace(/R\\\$\s*(\d+)[,\.]?(\d*)/g, 'R$ $1$2');
                  
                  return processedCell;
                })
              );
            }
          }
        });
      }
    } else if (secao.type === 'list' && secao.items && Array.isArray(secao.items)) {
      // Processar listas que não estão dentro de seções
      secao.items = secao.items.map((listItem: any) => {
        if (typeof listItem === 'string') {
          return processLatexText(listItem);
        }
        return listItem;
      });
    } else if (secao.type === 'table' && secao.headers) {
      // Processar tabelas que não estão dentro de seções
      secao.headers = secao.headers.map((header: string) => processLatexText(header));
      if (secao.rows && Array.isArray(secao.rows)) {
        secao.rows = secao.rows.map((row: string[]) => 
          row.map((cell: string) => {
            // Processamento especial para células de tabela
            let processedCell = processLatexText(cell);
            
            // Processamento de porcentagens e valores
            processedCell = processedCell.replace(/(\d+)[,\.]?(\d*)\\%/g, '$1$2%');
            processedCell = processedCell.replace(/R\\\$\s*(\d+)[,\.]?(\d*)/g, 'R$ $1$2');
            
            return processedCell;
          })
        );
      }
    }
  });
  
  return conteudoProcessado;
}
