import React from 'react';
import { StyleSheet, View, Text, Alert, Platform } from 'react-native';
import { LatexElement } from '../types/LatexTypes';

interface FixedContentViewProps {
  content: LatexElement[] | null;
  style?: any;
}

/**
 * Componente para visualização de conteúdo quando ocorre uma falha
 * ao carregar o conteúdo avançado
 */
const FixedContentView: React.FC<FixedContentViewProps> = ({ content, style }) => {
  if (!content) return null;

  const renderElement = (element: LatexElement, index: number) => {
    switch (element.type) {
      case 'section':
        return (
          <View key={`section-${index}`} style={styles.section}>
            <Text style={getTitleStyle(element.level)}>{element.title}</Text>
            <View style={styles.sectionContent}>
              {element.content.map((item, idx) => renderElement(item, idx))}
            </View>
          </View>
        );
      
      case 'text':
        return (
          <Text 
            key={`text-${index}`} 
            style={[
              styles.paragraph,
              element.style?.bold && styles.bold,
              element.style?.italic && styles.italic,
            ]}
          >
            {element.content}
          </Text>
        );
      
      case 'list':
        return (
          <View key={`list-${index}`} style={styles.list}>
            {element.items.map((item, idx) => (
              <View key={`item-${idx}`} style={styles.listItem}>
                <Text style={styles.bullet}>{element.ordered ? `${idx + 1}.` : '•'}</Text>
                <Text style={styles.listItemText}>
                  {typeof item === 'string' ? item : 'Item da lista'}
                </Text>
              </View>
            ))}
          </View>
        );
      
      case 'table':
        return (
          <View key={`table-${index}`} style={styles.table}>
            {element.headers && (
              <View style={styles.tableHeader}>
                {element.headers.map((header, idx) => (
                  <View key={`header-${idx}`} style={styles.tableHeaderCell}>
                    <Text style={styles.tableHeaderText}>{header}</Text>
                  </View>
                ))}
              </View>
            )}
            {element.rows.map((row, rowIdx) => (
              <View key={`row-${rowIdx}`} style={[
                styles.tableRow,
                rowIdx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
              ]}>
                {row.map((cell, cellIdx) => (
                  <View key={`cell-${rowIdx}-${cellIdx}`} style={styles.tableCell}>
                    <Text style={styles.tableCellText}>{cell}</Text>
                  </View>
                ))}
              </View>
            ))}
            {element.caption && (
              <Text style={styles.tableCaption}>{element.caption}</Text>
            )}
          </View>
        );
      
      case 'highlight':
        return (
          <View key={`highlight-${index}`} style={[
            styles.highlight,
            element.style === 'warning' && styles.highlightWarning,
            element.style === 'important' && styles.highlightImportant,
          ]}>
            <Text style={styles.highlightText}>
              {typeof element.content === 'string' 
                ? element.content 
                : 'Conteúdo destacado'}
            </Text>
          </View>
        );
      
      case 'formula':
        return (
          <View key={`formula-${index}`} style={styles.formula}>
            <Text style={styles.formulaText}>{element.content}</Text>
          </View>
        );
      
      case 'image':
        return (
          <View key={`image-${index}`} style={styles.image}>
            <Text style={styles.imagePlaceholder}>[Imagem ou diagrama indisponível]</Text>
            {element.caption && (
              <Text style={styles.imageCaption}>{element.caption}</Text>
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  const getTitleStyle = (level: number) => {
    switch (level) {
      case 1:
        return styles.title1;
      case 2:
        return styles.title2;
      case 3:
        return styles.title3;
      default:
        return styles.title4;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {content.map((element, index) => renderElement(element, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  section: {
    marginBottom: 20,
  },
  sectionContent: {
    marginLeft: 10,
  },
  title1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
    marginTop: 8,
  },
  title2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
    marginTop: 16,
  },
  title3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 14,
  },
  title4: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  list: {
    marginVertical: 10,
    marginLeft: 5,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 20,
    fontSize: 16,
    color: '#2E7D32',
    marginRight: 5,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  table: {
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 10,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableRowEven: {
    backgroundColor: '#fff',
  },
  tableRowOdd: {
    backgroundColor: '#f9f9f9',
  },
  tableCell: {
    flex: 1,
    padding: 10,
  },
  tableCellText: {
    textAlign: 'center',
  },
  tableCaption: {
    padding: 10,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
  },
  highlight: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  highlightWarning: {
    backgroundColor: '#FFF8E1',
    borderLeftColor: '#FFA000',
  },
  highlightImportant: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: '#C62828',
  },
  highlightText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  formula: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  formulaText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 16,
  },
  image: {
    marginVertical: 10,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#666',
    borderRadius: 8,
    overflow: 'hidden',
    paddingTop: 65,
  },
  imageCaption: {
    marginTop: 5,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
});

export default FixedContentView;