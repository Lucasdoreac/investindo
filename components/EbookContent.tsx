import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

/**
 * Componente para renderizar o conteúdo do eBook de forma estruturada
 * Preserva a formatação original e estiliza adequadamente os elementos
 */
interface EbookContentProps {
  content: string;
  style?: any;
}

export default function EbookContent({ content, style }: EbookContentProps) {
  // Processamento do texto para identificar títulos, subtítulos e parágrafos
  const processContent = () => {
    // Dividir o conteúdo em linhas
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    
    // Iteramos por cada linha para determinar seu tipo e renderizá-la adequadamente
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Pular linhas vazias
      if (line === '') continue;
      
      // Verificar se é um título principal (todo em maiúsculas e começa com #)
      if (line.startsWith('# ')) {
        elements.push(
          <Text key={i} style={styles.mainTitle}>
            {line.replace('# ', '')}
          </Text>
        );
        continue;
      }
      
      // Verificar se é um subtítulo nível 2
      if (line.startsWith('## ')) {
        elements.push(
          <Text key={i} style={styles.subtitle}>
            {line.replace('## ', '')}
          </Text>
        );
        continue;
      }
      
      // Verificar se é um subtítulo nível 3
      if (line.startsWith('### ')) {
        elements.push(
          <Text key={i} style={styles.subsubtitle}>
            {line.replace('### ', '')}
          </Text>
        );
        continue;
      }
      
      // Verificar se é uma lista com marcadores
      if (line.startsWith('- ') || line.startsWith('• ')) {
        elements.push(
          <View key={i} style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              {line.replace(/^[-•]\s/, '')}
            </Text>
          </View>
        );
        continue;
      }
      
      // Verificar se é texto em negrito
      if (line.includes('**') || line.includes('__')) {
        // Processa marcações de negrito
        const parts = line.split(/(\*\*.*?\*\*|__.*?__)/g);
        
        elements.push(
          <Text key={i} style={styles.paragraph}>
            {parts.map((part, idx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <Text key={idx} style={styles.bold}>{part.slice(2, -2)}</Text>;
              }
              if (part.startsWith('__') && part.endsWith('__')) {
                return <Text key={idx} style={styles.bold}>{part.slice(2, -2)}</Text>;
              }
              return part;
            })}
          </Text>
        );
        continue;
      }
      
      // Verificar se é texto em itálico
      if (line.includes('*') || line.includes('_')) {
        // Processa marcações de itálico
        const parts = line.split(/(\*.*?\*|_.*?_)/g);
        
        elements.push(
          <Text key={i} style={styles.paragraph}>
            {parts.map((part, idx) => {
              if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
                return <Text key={idx} style={styles.italic}>{part.slice(1, -1)}</Text>;
              }
              if (part.startsWith('_') && part.endsWith('_') && !part.startsWith('__')) {
                return <Text key={idx} style={styles.italic}>{part.slice(1, -1)}</Text>;
              }
              return part;
            })}
          </Text>
        );
        continue;
      }
      
      // Verificar se é uma citação
      if (line.startsWith('> ')) {
        elements.push(
          <View key={i} style={styles.quoteContainer}>
            <Text style={styles.quote}>
              {line.replace('> ', '')}
            </Text>
          </View>
        );
        continue;
      }
      
      // Parágrafo normal
      elements.push(
        <Text key={i} style={styles.paragraph}>
          {line}
        </Text>
      );
    }
    
    return elements;
  };
  
  return (
    <ScrollView 
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
    >
      {processContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 16,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
    marginTop: 16,
  },
  subsubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 14,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 16,
  },
  bullet: {
    fontSize: 16,
    color: '#2E7D32',
    marginRight: 8,
  },
  bulletText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  quoteContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#2E7D32',
    paddingLeft: 12,
    marginVertical: 10,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#444',
    lineHeight: 24,
  },
});
