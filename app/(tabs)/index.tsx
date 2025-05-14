import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

/**
 * Tela inicial do aplicativo "Investindo com Sabedoria"
 * Apresenta os conceitos fundamentais baseados no eBook e convida à navegação
 */
export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Investindo com Sabedoria</Text>
        <Text style={styles.subtitle}>Guia Prático para Iniciantes</Text>
      </View>

      <View style={styles.introContainer}>
        <Text style={styles.introText}>
          Bem-vindo ao mundo dos investimentos! Este aplicativo foi criado para 
          facilitar sua jornada de educação financeira, com base no eBook "Investindo 
          com Sabedoria" de Luciana Araujo.
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card}>
          <Link href="/simuladores" asChild>
            <View style={styles.cardContent}>
              <FontAwesome name="calculator" size={40} color="#2E7D32" />
              <Text style={styles.cardTitle}>Simuladores</Text>
              <Text style={styles.cardText}>
                Faça cálculos de juros compostos e compare diferentes investimentos
              </Text>
            </View>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Link href="/biblioteca" asChild>
            <View style={styles.cardContent}>
              <FontAwesome name="book" size={40} color="#2E7D32" />
              <Text style={styles.cardTitle}>Biblioteca</Text>
              <Text style={styles.cardText}>
                Acesse o conteúdo completo organizado por capítulos
              </Text>
            </View>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Link href="/perfil" asChild>
            <View style={styles.cardContent}>
              <FontAwesome name="user" size={40} color="#2E7D32" />
              <Text style={styles.cardTitle}>Perfil do Investidor</Text>
              <Text style={styles.cardText}>
                Descubra seu perfil com nosso questionário
              </Text>
            </View>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Link href="/glossario" asChild>
            <View style={styles.cardContent}>
              <FontAwesome name="list" size={40} color="#2E7D32" />
              <Text style={styles.cardTitle}>Glossário</Text>
              <Text style={styles.cardText}>
                Consulte termos financeiros explicados de forma simples
              </Text>
            </View>
          </Link>
        </TouchableOpacity>
      </View>

      <View style={styles.quotesContainer}>
        <Text style={styles.quote}>
          "A verdadeira liberdade financeira não se encontra em promessas de riqueza fácil, 
          mas no poder de entender o que poucos explicam."
        </Text>
        <Text style={styles.quoteAuthor}>- Luciana Araujo</Text>
      </View>

      <View style={styles.conceptsContainer}>
        <Text style={styles.sectionTitle}>Conceitos Fundamentais</Text>
        
        <View style={styles.conceptItem}>
          <FontAwesome name="star" size={24} color="#FFD700" />
          <View style={styles.conceptTextContainer}>
            <Text style={styles.conceptTitle}>Juros Compostos</Text>
            <Text style={styles.conceptText}>
              "Magia disfarçada de matemática" - o efeito bola de neve que faz seu dinheiro crescer
            </Text>
          </View>
        </View>
        
        <View style={styles.conceptItem}>
          <FontAwesome name="exchange" size={24} color="#FFD700" />
          <View style={styles.conceptTextContainer}>
            <Text style={styles.conceptTitle}>Ativos vs. Passivos</Text>
            <Text style={styles.conceptText}>
              Ativos colocam dinheiro no seu bolso, passivos tiram
            </Text>
          </View>
        </View>
        
        <View style={styles.conceptItem}>
          <FontAwesome name="pie-chart" size={24} color="#FFD700" />
          <View style={styles.conceptTextContainer}>
            <Text style={styles.conceptTitle}>A Trindade Impossível</Text>
            <Text style={styles.conceptText}>
              Segurança, liquidez e rentabilidade - escolha apenas dois
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.ctaButton}>
          <Link href="/calculadora/juros-compostos" asChild>
            <Text style={styles.ctaButtonText}>Começar a Simular Investimentos</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
    textAlign: 'center',
  },
  introContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'center',
  },
  cardsContainer: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    width: '48%',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    padding: 15,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quotesContainer: {
    backgroundColor: '#E8F5E9',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginTop: 10,
  },
  conceptsContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  conceptItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  conceptTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  conceptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  conceptText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ctaContainer: {
    margin: 15,
    marginBottom: 30,
  },
  ctaButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
